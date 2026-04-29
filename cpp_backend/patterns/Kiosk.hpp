#ifndef KIOSK_HPP
#define KIOSK_HPP

#include "IKiosk.hpp"
#include "KioskState.hpp"
#include "PricingStrategy.hpp"
#include <memory>

// Concrete Component
class Kiosk : public IKiosk {
private:
    std::string id;
    std::string type;
    std::string location;
    int health;
    std::map<std::string, Item> inventory;
    std::map<std::string, double> telemetry;
    std::vector<std::string> modules;
    std::shared_ptr<KioskState> state;
    std::shared_ptr<PricingStrategy> pricingStrategy;

public:
    Kiosk(std::string type, std::string id, std::string location) 
        : type(type), id(id), location(location), health(100) {
        state = std::make_shared<ActiveState>(this);
        pricingStrategy = std::make_shared<StandardPricing>();
        modules.push_back("BASE_UNIT");
        telemetry["temp"] = 20.0;
        telemetry["power"] = 1.0;
    }

    std::string getId() const override { return id; }
    std::string getType() const override { return type; }
    std::string getLocation() const override { return location; }
    int getHealth() const override { return health; }
    void setHealth(int h) override { health = h; }
    
    std::map<std::string, Item>& getInventory() override { return inventory; }
    std::vector<std::string> getModules() const override { return modules; }
    std::map<std::string, double> getTelemetry() const override { return telemetry; }
    void updateTelemetry(const std::string& key, double value) override { telemetry[key] = value; }
    std::string getStatus() const override { return state ? state->getStatus() : "Unknown"; }

    // Setters for State and Strategy
    void setState(std::shared_ptr<KioskState> newState) { state = newState; }
    std::shared_ptr<KioskState> getState() const { return state; }
    
    void setPricingStrategy(std::shared_ptr<PricingStrategy> ps) { pricingStrategy = ps; }
    std::shared_ptr<PricingStrategy> getPricingStrategy() const { return pricingStrategy; }
};

#endif // KIOSK_HPP
