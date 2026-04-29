#ifndef HARDWARE_DECORATOR_HPP
#define HARDWARE_DECORATOR_HPP

#include "IKiosk.hpp"
#include <memory>

// Base Decorator
class KioskDecorator : public IKiosk {
protected:
    std::shared_ptr<IKiosk> kiosk;

public:
    KioskDecorator(std::shared_ptr<IKiosk> k) : kiosk(k) {}

    std::string getId() const override { return kiosk->getId(); }
    std::string getType() const override { return kiosk->getType(); }
    std::string getLocation() const override { return kiosk->getLocation(); }
    int getHealth() const override { return kiosk->getHealth(); }
    void setHealth(int h) override { kiosk->setHealth(h); }
    
    std::map<std::string, Item>& getInventory() override { return kiosk->getInventory(); }
    void updateTelemetry(const std::string& key, double value) override { kiosk->updateTelemetry(key, value); }
    std::string getStatus() const override { return kiosk->getStatus(); }
    
    // Virtual methods to be overridden by concrete decorators
    virtual std::vector<std::string> getModules() const override {
        return kiosk->getModules();
    }
    
    virtual std::map<std::string, double> getTelemetry() const override {
        return kiosk->getTelemetry();
    }
};

// Concrete Decorator 1
class SolarPowerDecorator : public KioskDecorator {
public:
    SolarPowerDecorator(std::shared_ptr<IKiosk> k) : KioskDecorator(k) {}

    std::vector<std::string> getModules() const override {
        auto mods = kiosk->getModules();
        mods.push_back("SOLAR_BACKUP");
        return mods;
    }

    std::map<std::string, double> getTelemetry() const override {
        auto tel = kiosk->getTelemetry();
        tel["solarCharge"] = 95.0; // Adds new metric
        return tel;
    }
};

// Concrete Decorator 2
class CoolingAddonDecorator : public KioskDecorator {
public:
    CoolingAddonDecorator(std::shared_ptr<IKiosk> k) : KioskDecorator(k) {}

    std::vector<std::string> getModules() const override {
        auto mods = kiosk->getModules();
        mods.push_back("ADVANCED_COOLING");
        return mods;
    }

    std::map<std::string, double> getTelemetry() const override {
        auto tel = kiosk->getTelemetry();
        tel["temp"] -= 5.0; // Modifies existing metric
        return tel;
    }
};

#endif // HARDWARE_DECORATOR_HPP
