#include <iostream>
#include "patterns/Registry.hpp"
#include "patterns/EventSystem.hpp"
#include "patterns/KioskFactory.hpp"
#include "patterns/HardwareDecorator.hpp"
#include "patterns/PricingStrategy.hpp"
#include "patterns/FailureHandler.hpp"
#include "patterns/TransactionCommand.hpp"
#include "patterns/Memento.hpp"
#include "patterns/SecurityProxy.hpp"

int main() {
    std::cout << "=== Aura Retail OS (C++ Backend Simulation) ===\n\n";

    // 1. Singleton (Registry)
    auto& registry = Registry::getInstance();
    registry.updateConfig("emergencyMode", "false");

    // 2. Observer (EventSystem)
    auto& events = EventSystem::getInstance();
    events.subscribe("LOW_STOCK", [](const std::string& data) {
        std::cout << "[Alert] " << data << "\n";
    });

    // 3. Factory & State (KioskFactory creates Kiosk with ActiveState)
    auto pharmacyKiosk = KioskFactory::createKiosk("PHARMACY", "K-101", "Central Hospital");
    
    // Setup Inventory
    Item aspirin = {"p1", "Aspirin", 50, 10.0, true};
    pharmacyKiosk->getInventory()["p1"] = aspirin;

    // 4. Decorator (Adding Solar Backup)
    std::shared_ptr<IKiosk> decoratedKiosk = std::make_shared<SolarPowerDecorator>(pharmacyKiosk);
    std::cout << "Kiosk " << decoratedKiosk->getId() << " Telemetry Solar: " 
              << decoratedKiosk->getTelemetry().at("solarCharge") << "%\n\n";

    // 5. Strategy (Pricing)
    PricingContext pricingContext;
    double price = pricingContext.calculatePrice(aspirin.price, 2);
    std::cout << "Standard Price for 2 Aspirin: $" << price << "\n";
    
    pricingContext.setStrategy(std::make_unique<DiscountPricing>());
    std::cout << "Discount Price for 2 Aspirin: $" << pricingContext.calculatePrice(aspirin.price, 2) << "\n\n";

    // 6. Command (Transaction)
    PurchaseItemCommand purchase(pharmacyKiosk, aspirin, 2);
    purchase.execute();
    std::cout << "Remaining Aspirin count: " << pharmacyKiosk->getInventory()["p1"].count << "\n";
    purchase.undo(); // Rollback
    std::cout << "Restored Aspirin count: " << pharmacyKiosk->getInventory()["p1"].count << "\n\n";

    // 7. Memento (Snapshotting)
    KioskCaretaker caretaker;
    KioskSnapshot snap = {pharmacyKiosk->getLocation(), pharmacyKiosk->getInventory(), pharmacyKiosk->getHealth()};
    caretaker.addMemento(pharmacyKiosk->getId(), KioskMemento(snap, "12:00 PM"));

    // 8. Chain of Responsibility (Failure Handling)
    auto retryHandler = std::make_shared<AutomaticRetryHandler>();
    auto alertHandler = std::make_shared<TechnicianAlertHandler>();
    retryHandler->setNext(alertHandler);

    std::cout << "\nSimulating Failure...\n";
    auto resolution = retryHandler->handle("MOTOR_STALL", pharmacyKiosk->getId());
    std::cout << "Resolution: " << resolution.message << "\n\n";

    // 9. Proxy (Security)
    AdminProxy adminProxy(pharmacyKiosk, "GUEST");
    try {
        adminProxy.updateHealth(50);
    } catch (const std::exception& e) {
        std::cout << "[SecurityProxy Caught Exception]: " << e.what() << "\n";
    }

    AdminProxy validProxy(pharmacyKiosk, "ADMIN");
    validProxy.updateHealth(80);

    std::cout << "\n=== Simulation Complete ===\n";
    return 0;
}
