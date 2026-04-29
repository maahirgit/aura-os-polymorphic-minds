#ifndef KIOSK_FACTORY_HPP
#define KIOSK_FACTORY_HPP

#include "Kiosk.hpp"
#include <memory>
#include <stdexcept>

// Factory Pattern
class KioskFactory {
public:
    static std::shared_ptr<Kiosk> createKiosk(const std::string& type, const std::string& id, const std::string& location) {
        auto kiosk = std::make_shared<Kiosk>(type, id, location);

        if (type == "PHARMACY") {
            kiosk->setHealth(100);
            kiosk->updateTelemetry("temp", 22.4); // Room temp for meds
        } 
        else if (type == "FOOD") {
            kiosk->setHealth(100);
            kiosk->updateTelemetry("temp", 4.2); // Refrigerated
        } 
        else if (type == "EMERGENCY") {
            kiosk->setHealth(100);
            kiosk->setState(std::make_shared<EmergencyLockdownState>(kiosk.get()));
        } 
        else {
            throw std::invalid_argument("Unknown Kiosk Type: " + type);
        }

        std::cout << "[Factory] Created " << type << " Kiosk " << id << " at " << location << "\n";
        return kiosk;
    }
};

#endif // KIOSK_FACTORY_HPP
