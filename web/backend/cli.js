const readline = require('readline');
const KioskFactory = require('./patterns/KioskFactory');
const Registry = require('./patterns/Registry');
const { PricingContext, StandardPricing, EmergencyPricing } = require('./patterns/PricingStrategy');
const { PurchaseItemCommand } = require('./patterns/TransactionCommand');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize simulation kiosks
const kiosks = [
    KioskFactory.createKiosk('PHARMACY', 'K-101', 'General Hospital'),
    KioskFactory.createKiosk('FOOD', 'K-202', 'Metro Station'),
    KioskFactory.createKiosk('EMERGENCY', 'K-303', 'Disaster Zone')
];

// Seed inventory
kiosks[0].inventory = { 'p1': { id: 'p1', name: 'Pain Relief', count: 50, price: 15.0, isEssential: true } };
kiosks[1].inventory = { 'f1': { id: 'f1', name: 'Sandwich', count: 20, price: 8.5, isEssential: false } };
kiosks[2].inventory = { 'e1': { id: 'e1', name: 'Rations', count: 100, price: 5.0, isEssential: true } };

function showMenu() {
    console.log("\n--- Aura Retail OS CLI v2.0 ---");
    console.log(`City: ${Registry.config.city} | Mode: ${Registry.config.emergencyMode ? 'EMERGENCY' : 'STANDARD'}`);
    console.log("1. List Kiosks");
    console.log("2. Purchase Item");
    console.log("3. Toggle Emergency Mode");
    console.log("4. Exit");
    rl.question("Select option: ", handleOption);
}

function handleOption(option) {
    switch (option) {
        case '1':
            console.log("\nActive Kiosks:");
            kiosks.forEach(k => console.log(`- ${k.id} [${k.type}] at ${k.location} (Status: ${k.state.getStatus()})`));
            showMenu();
            break;
        case '2':
            purchaseFlow();
            break;
        case '3':
            Registry.config.emergencyMode = !Registry.config.emergencyMode;
            console.log(`\nEmergency Mode is now ${Registry.config.emergencyMode ? 'ON' : 'OFF'}`);
            showMenu();
            break;
        case '4':
            rl.close();
            break;
        default:
            console.log("Invalid option.");
            showMenu();
            break;
    }
}

function purchaseFlow() {
    console.log("\nAvailable Kiosks:");
    kiosks.forEach((k, i) => console.log(`${i + 1}. ${k.id} (${k.location})`));
    rl.question("Select Kiosk (number): ", (kIndex) => {
        const kiosk = kiosks[parseInt(kIndex) - 1];
        if (!kiosk) {
            console.log("Invalid kiosk.");
            return showMenu();
        }

        console.log(`\nInventory for ${kiosk.id}:`);
        Object.values(kiosk.inventory).forEach(item => {
            console.log(`- ${item.id}: ${item.name} ($${item.price}) [Stock: ${item.count}]`);
        });

        rl.question("Enter Item ID: ", (itemId) => {
            const item = kiosk.inventory[itemId];
            if (!item) {
                console.log("Invalid item.");
                return showMenu();
            }

            // Command Pattern
            const command = new PurchaseItemCommand(kiosk, item, 1);
            const result = command.execute();

            if (result.success) {
                console.log(`\n[SUCCESS] ${result.message}`);
                console.log(`Remaining stock: ${item.count}`);
            } else {
                console.log(`\n[FAILED] ${result.message}`);
            }
            showMenu();
        });
    });
}

showMenu();
