#ifndef KIOSK_STATE_HPP
#define KIOSK_STATE_HPP

#include <iostream>
#include <string>
#include <memory>
#include "IKiosk.hpp"

struct PurchaseResult {
    bool success;
    std::string message;
};

// State Interface
class KioskState {
protected:
    IKiosk* kiosk;

public:
    KioskState(IKiosk* k) : kiosk(k) {}
    virtual ~KioskState() = default;

    virtual PurchaseResult handlePurchase(const Item& item) = 0;
    virtual std::string getStatus() const = 0;
};

// Concrete State: Active
class ActiveState : public KioskState {
public:
    ActiveState(IKiosk* k) : KioskState(k) {}
    
    PurchaseResult handlePurchase(const Item& item) override {
        std::cout << "Processing purchase of " << item.name << " in Active mode.\n";
        return {true, "Purchase successful"};
    }
    
    std::string getStatus() const override { return "ActiveState"; }
};

// Concrete State: Maintenance
class MaintenanceState : public KioskState {
public:
    MaintenanceState(IKiosk* k) : KioskState(k) {}
    
    PurchaseResult handlePurchase(const Item& item) override {
        std::cout << "Cannot purchase " << item.name << ". Kiosk is in Maintenance mode.\n";
        return {false, "System under maintenance. Please try again later."};
    }
    
    std::string getStatus() const override { return "MaintenanceState"; }
};

// Concrete State: Emergency Lockdown
class EmergencyLockdownState : public KioskState {
public:
    EmergencyLockdownState(IKiosk* k) : KioskState(k) {}
    
    PurchaseResult handlePurchase(const Item& item) override {
        if (item.isEssential) {
            std::cout << "Processing emergency distribution of essential item: " << item.name << "\n";
            return {true, "Emergency essential item distributed."};
        }
        std::cout << "Non-essential item " << item.name << " is locked down.\n";
        return {false, "Only essential items are available during emergency lockdown."};
    }
    
    std::string getStatus() const override { return "EmergencyLockdownState"; }
};

#endif // KIOSK_STATE_HPP
