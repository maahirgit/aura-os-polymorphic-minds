#ifndef IKIOSK_HPP
#define IKIOSK_HPP

#include <string>
#include <map>
#include <vector>

struct Item {
    std::string id;
    std::string name;
    int count;
    double price;
    bool isEssential;
};

// Interface for Kiosk (used by Decorator)
class IKiosk {
public:
    virtual ~IKiosk() = default;
    
    virtual std::string getId() const = 0;
    virtual std::string getType() const = 0;
    virtual std::string getLocation() const = 0;
    virtual int getHealth() const = 0;
    virtual void setHealth(int h) = 0;
    
    virtual std::map<std::string, Item>& getInventory() = 0;
    virtual std::vector<std::string> getModules() const = 0;
    virtual std::map<std::string, double> getTelemetry() const = 0;
    virtual void updateTelemetry(const std::string& key, double value) = 0;
    virtual std::string getStatus() const = 0;
};

#endif // IKIOSK_HPP
