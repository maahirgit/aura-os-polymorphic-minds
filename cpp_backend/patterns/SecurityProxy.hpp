#ifndef SECURITY_PROXY_HPP
#define SECURITY_PROXY_HPP

#include "Kiosk.hpp"
#include <string>
#include <stdexcept>

// Proxy Pattern
class AdminProxy {
private:
    std::shared_ptr<Kiosk> realKiosk;
    std::string userRole;

    bool checkAccess() const {
        return userRole == "ADMIN" || userRole == "TECHNICIAN";
    }

public:
    AdminProxy(std::shared_ptr<Kiosk> kiosk, const std::string& role) 
        : realKiosk(kiosk), userRole(role) {}

    void updateHealth(int health) {
        if (!checkAccess()) {
            throw std::runtime_error("Access Denied: Requires ADMIN or TECHNICIAN role.");
        }
        realKiosk->setHealth(health);
        std::cout << "[Proxy] Authorized health update for Kiosk " << realKiosk->getId() << "\n";
    }

    void forceState(std::shared_ptr<KioskState> newState) {
        if (userRole != "ADMIN") {
            throw std::runtime_error("Access Denied: State overrides require ADMIN role.");
        }
        realKiosk->setState(newState);
        std::cout << "[Proxy] Authorized state override for Kiosk " << realKiosk->getId() << "\n";
    }
};

#endif // SECURITY_PROXY_HPP
