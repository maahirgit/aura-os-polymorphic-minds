const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const Registry = require('./patterns/Registry');
const EventSystem = require('./patterns/EventSystem');
const KioskFactory = require('./patterns/KioskFactory');
const { PricingContext, StandardPricing, DiscountPricing, EmergencyPricing } = require('./patterns/PricingStrategy');
const { ActiveState, MaintenanceState, EmergencyLockdownState } = require('./patterns/KioskState');
const { PurchaseItemCommand } = require('./patterns/TransactionCommand');
const { AutomaticRetryHandler, HardwareRecalibrationHandler, TechnicianAlertHandler } = require('./patterns/FailureHandler');
const { KioskMemento, KioskCaretaker } = require('./patterns/Memento');
const { SolarPowerDecorator, CoolingAddonDecorator } = require('./patterns/HardwareDecorator');
const AdminProxy = require('./patterns/SecurityProxy');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Simulation State
let kiosks = [];
let transactions = [];
let systemLogs = [
    { id: uuidv4(), time: new Date().toLocaleTimeString(), message: "System Initialized", type: "INFO" }
];

// Initialize Failure Chain
const retryHandler = new AutomaticRetryHandler();
const recalibrationHandler = new HardwareRecalibrationHandler();
const techAlertHandler = new TechnicianAlertHandler();
retryHandler.setNext(recalibrationHandler).setNext(techAlertHandler);

// Initialize with some kiosks
function initKiosks() {
    const k1 = KioskFactory.createKiosk('PHARMACY', 'K-101', 'Zephyrus General Hospital');
    k1.inventory = {
        'p1': { id: 'p1', name: 'Pain Relief', count: 50, price: 15.0, isEssential: true },
        'p2': { id: 'p2', name: 'Antibiotics', count: 30, price: 45.0, isEssential: true }
    };
    k1.telemetry = { temp: 22.4, power: 1.2, signal: -65 };
    
    const k2 = KioskFactory.createKiosk('FOOD', 'K-202', 'Metro Central Station');
    k2.inventory = {
        'f1': { id: 'f1', name: 'Daily Sandwich', count: 20, price: 8.5, isEssential: false },
        'f2': { id: 'f2', name: 'Mineral Water', count: 100, price: 1.5, isEssential: true }
    };
    k2.telemetry = { temp: 4.2, power: 2.5, signal: -78 }; // Lower temp for food

    const k3 = KioskFactory.createKiosk('EMERGENCY', 'K-303', 'Sector 7 Disaster Zone');
    k3.inventory = {
        'e1': { id: 'e1', name: 'First Aid Kit', count: 10, price: 25.0, isEssential: true },
        'e2': { id: 'e2', name: 'Emergency Ration', count: 50, price: 5.0, isEssential: true }
    };
    k3.telemetry = { temp: 28.1, power: 0.8, signal: -110 };

    kiosks = [k1, k2, k3];
}

initKiosks();

// Update telemetry periodically
setInterval(() => {
    kiosks.forEach(k => {
        k.telemetry.temp += (Math.random() - 0.5) * 0.5;
        k.telemetry.power += (Math.random() - 0.5) * 0.1;
        k.telemetry.signal += (Math.random() - 0.5) * 2;
    });
}, 3000);

function addLog(message, type = "INFO") {
    systemLogs.unshift({ id: uuidv4(), time: new Date().toLocaleTimeString(), message, type });
    if (systemLogs.length > 50) systemLogs.pop();
}

// Routes
app.get('/api/config', (req, res) => res.json(Registry.getConfig()));
app.get('/api/logs', (req, res) => res.json(systemLogs));

app.get('/api/kiosks', (req, res) => {
    const safeKiosks = kiosks.map(k => ({
        id: k.id,
        type: k.type,
        location: k.location,
        inventory: k.inventory,
        state: k.state.getStatus(),
        health: k.health,
        modules: k.modules,
        telemetry: k.telemetry
    }));
    res.json(safeKiosks);
});

app.post('/api/kiosks', (req, res) => {
    const { type, id, location } = req.body;
    try {
        const newKiosk = KioskFactory.createKiosk(type, id, location);
        // Default inventory for demonstration
        newKiosk.inventory = {
            'item-1': { id: 'item-1', name: 'Sample Item', count: 10, price: 5.0, isEssential: true }
        };
        newKiosk.telemetry = { temp: 20.0, power: 1.0, signal: -70 };
        kiosks.push(newKiosk);
        addLog(`DEPLOYED NEW NODE: ${id} (${type}) at ${location}`, "SUCCESS");
        const safeKiosk = {
            id: newKiosk.id,
            type: newKiosk.type,
            location: newKiosk.location,
            inventory: newKiosk.inventory,
            state: newKiosk.state.getStatus(),
            health: newKiosk.health,
            modules: newKiosk.modules,
            telemetry: newKiosk.telemetry
        };
        res.json({ success: true, kiosk: safeKiosk });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/simulate-failure', (req, res) => {
    const { kioskId, type } = req.body;
    const kiosk = kiosks.find(k => k.id === kioskId);
    if (!kiosk) return res.status(404).json({ error: "Kiosk not found" });

    addLog(`MANUAL FAILURE INJECTED: ${type} at ${kioskId}`, "WARN");
    
    const failure = { type, kioskId: kiosk.id };
    const resolution = retryHandler.handle(failure);
    
    if (!resolution.resolved) {
        kiosk.state = new MaintenanceState(kiosk);
        kiosk.health = 45;
        addLog(`CRITICAL: ${resolution.message}`, "ERROR");
    } else {
        addLog(`SUCCESS: ${resolution.message}`, "SUCCESS");
    }

    res.json(resolution);
});

app.post('/api/purchase', (req, res) => {
    const { kioskId, itemId, quantity } = req.body;
    const kiosk = kiosks.find(k => k.id === kioskId);
    
    if (!kiosk) return res.status(404).json({ error: "Kiosk not found" });
    
    addLog(`Transaction request: ${quantity}x ${itemId} at ${kioskId}`);

    const item = kiosk.inventory[itemId];
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Check System State (State Pattern)
    const stateResult = kiosk.state.handlePurchase(item);
    if (!stateResult.success) return res.status(403).json(stateResult);

    // Dynamic Pricing (Strategy Pattern)
    const pricingContext = new PricingContext();
    if (Registry.config.emergencyMode) {
        pricingContext.setStrategy(new EmergencyPricing());
    } else if (item.count > 40) {
        pricingContext.setStrategy(new DiscountPricing());
    }
    
    const finalPrice = pricingContext.calculatePrice(item.price, quantity);

    // Execute Command (Command Pattern)
    const command = new PurchaseItemCommand(kiosk, item, quantity);
    const result = command.execute();

    if (result.success) {
        // Simulate potential hardware failure (Failure Handling Chain)
        if (Math.random() < 0.1) {
            const failure = { type: 'MOTOR_STALL', kioskId: kiosk.id };
            const resolution = retryHandler.handle(failure);
            
            if (!resolution.resolved) {
                command.undo(); // Atomic Rollback
                kiosk.state = new MaintenanceState(kiosk);
                EventSystem.notify('HardwareFailureEvent', { kioskId: kiosk.id, failureType: failure.type });
                return res.status(500).json({ error: "Hardware Failure", resolution });
            }
        }

        const transaction = {
            id: uuidv4(),
            kioskId,
            itemId,
            quantity,
            totalPrice: finalPrice,
            timestamp: new Date()
        };
        transactions.push(transaction);
        
        // Low Stock Event (Observer Pattern)
        if (item.count < 5) {
            EventSystem.notify('LowStockEvent', { kioskId, itemId, count: item.count });
        }

        res.json({ ...result, transaction });
    } else {
        res.status(400).json(result);
    }
});

app.post('/api/toggle-emergency', (req, res) => {
    const { enabled } = req.body;
    Registry.updateConfig({ emergencyMode: enabled });
    
    kiosks.forEach(k => {
        if (enabled) {
            k.state = new EmergencyLockdownState(k);
            k.pricingStrategy = new EmergencyPricing();
        } else {
            k.state = new ActiveState(k);
            k.pricingStrategy = new StandardPricing();
        }
    });

    EventSystem.notify('EmergencyModeActivated', { enabled });
    res.json({ message: `Emergency mode ${enabled ? 'activated' : 'deactivated'}` });
});

const caretaker = new KioskCaretaker();

// Routes...
// ... (rest of the routes)

app.post('/api/kiosks/:id/checkpoint', (req, res) => {
    const kiosk = kiosks.find(k => k.id === req.params.id);
    if (!kiosk) return res.status(404).json({ error: "Node not found" });
    
    // Create a safe snapshot of the data (no circular references)
    const snapshot = {
        location: kiosk.location,
        inventory: JSON.parse(JSON.stringify(kiosk.inventory)),
        health: kiosk.health
    };

    const memento = new KioskMemento(snapshot);
    caretaker.addMemento(kiosk.id, memento);
    addLog(`CHECKPOINT CREATED for ${kiosk.id}`, "SUCCESS");
    res.json({ success: true, timestamp: memento.timestamp });
});

app.post('/api/kiosks/:id/restore', (req, res) => {
    const kiosk = kiosks.find(k => k.id === req.params.id);
    if (!kiosk) return res.status(404).json({ error: "Node not found" });
    
    const memento = caretaker.getLatest(kiosk.id);
    if (!memento) return res.status(400).json({ error: "No checkpoint found" });

    // Restore logic
    kiosk.location = memento.data.location;
    kiosk.inventory = memento.data.inventory;
    addLog(`RESTORED ${kiosk.id} from checkpoint (${memento.timestamp.toLocaleTimeString()})`, "WARN");
    res.json({ success: true });
});

app.patch('/api/kiosks/:id', (req, res) => {
    const { id } = req.params;
    const { location, inventory, addons } = req.body;
    let kiosk = kiosks.find(k => k.id === id);
    
    if (!kiosk) return res.status(404).json({ error: "Node not found" });

    // Use Proxy Pattern for security
    try {
        const proxy = new AdminProxy(kiosk, "ADMIN"); // Simulating admin role
        if (location) proxy.updateLocation(location);
        if (inventory) proxy.updateInventory(inventory);
        
        // Use Decorator Pattern for addons
        if (addons?.includes('SOLAR')) {
            kiosk = new SolarPowerDecorator(kiosk);
            kiosks = kiosks.map(k => k.id === id ? kiosk : k);
        }
        if (addons?.includes('COOLING')) {
            kiosk = new CoolingAddonDecorator(kiosk);
            kiosks = kiosks.map(k => k.id === id ? kiosk : k);
        }

        addLog(`UPDATED NODE: ${id} modified via Secure Proxy`, "SUCCESS");
        res.json({ success: true });
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Aura Retail OS Backend running on http://localhost:${PORT}`);
});
