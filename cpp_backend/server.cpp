#include "httplib.h"
#include "json.hpp"
#include "patterns/Registry.hpp"
#include "patterns/EventSystem.hpp"
#include "patterns/KioskFactory.hpp"
#include "patterns/HardwareDecorator.hpp"
#include "patterns/PricingStrategy.hpp"
#include "patterns/FailureHandler.hpp"
#include "patterns/TransactionCommand.hpp"
#include "patterns/Memento.hpp"
#include "patterns/SecurityProxy.hpp"

#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <chrono>
#include <ctime>

using json = nlohmann::json;

// Global State
std::vector<std::shared_ptr<IKiosk>> kiosks;
std::vector<json> systemLogs;
std::vector<json> transactions;
KioskCaretaker caretaker;

std::shared_ptr<FailureHandler> retryHandler;

std::string getCurrentTime() {
    auto now = std::chrono::system_clock::now();
    std::time_t end_time = std::chrono::system_clock::to_time_t(now);
    std::string t = std::ctime(&end_time);
    t.pop_back(); // remove newline
    return t;
}

void addLog(const std::string& message, const std::string& type = "INFO") {
    json log = {
        {"id", std::to_string(std::chrono::system_clock::now().time_since_epoch().count())}, 
        {"time", getCurrentTime()}, 
        {"message", message}, 
        {"type", type}
    };
    systemLogs.insert(systemLogs.begin(), log);
    if(systemLogs.size() > 50) systemLogs.pop_back();
    std::cout << "[" << type << "] " << message << "\n";
}

json kioskToJson(const std::shared_ptr<IKiosk>& k) {
    json j;
    j["id"] = k->getId();
    j["type"] = k->getType();
    j["location"] = k->getLocation();
    j["health"] = k->getHealth();
    j["state"] = k->getStatus();
    
    json inv = json::object();
    for (const auto& pair : k->getInventory()) {
        inv[pair.first] = {
            {"id", pair.second.id},
            {"name", pair.second.name},
            {"count", pair.second.count},
            {"price", pair.second.price},
            {"isEssential", pair.second.isEssential}
        };
    }
    j["inventory"] = inv;
    j["modules"] = k->getModules();
    j["telemetry"] = k->getTelemetry();
    return j;
}

void initKiosks() {
    auto k1 = KioskFactory::createKiosk("PHARMACY", "K-101", "Zephyrus General Hospital");
    k1->getInventory()["p1"] = {"p1", "Pain Relief", 50, 15.0, true};
    k1->getInventory()["p2"] = {"p2", "Antibiotics", 30, 45.0, true};

    auto k2 = KioskFactory::createKiosk("FOOD", "K-202", "Metro Central Station");
    k2->getInventory()["f1"] = {"f1", "Daily Sandwich", 20, 8.5, false};
    k2->getInventory()["f2"] = {"f2", "Mineral Water", 100, 1.5, true};

    auto k3 = KioskFactory::createKiosk("EMERGENCY", "K-303", "Sector 7 Disaster Zone");
    k3->getInventory()["e1"] = {"e1", "First Aid Kit", 10, 25.0, true};
    k3->getInventory()["e2"] = {"e2", "Emergency Ration", 50, 5.0, true};

    kiosks.push_back(k1);
    kiosks.push_back(k2);
    kiosks.push_back(k3);
    
    addLog("System Initialized", "INFO");
}

int main() {
    initKiosks();
    
    // Setup Failure Chain
    retryHandler = std::make_shared<AutomaticRetryHandler>();
    auto recalibrationHandler = std::make_shared<HardwareRecalibrationHandler>();
    auto techAlertHandler = std::make_shared<TechnicianAlertHandler>();
    retryHandler->setNext(recalibrationHandler)->setNext(techAlertHandler);

    httplib::Server svr;

    // CORS Middleware
    auto setCors = [](httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    };

    svr.Options(R"(.*)", [&](const httplib::Request&, httplib::Response& res) {
        setCors(res);
        res.status = 200;
    });

    svr.Get("/api/config", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        json j = Registry::getInstance().getConfig();
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/logs", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        res.set_content(json(systemLogs).dump(), "application/json");
    });

    svr.Get("/api/kiosks", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        json arr = json::array();
        for (const auto& k : kiosks) {
            arr.push_back(kioskToJson(k));
        }
        res.set_content(arr.dump(), "application/json");
    });

    svr.Post("/api/kiosks", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        try {
            auto body = json::parse(req.body);
            auto newKiosk = KioskFactory::createKiosk(body["type"], body["id"], body["location"]);
            newKiosk->getInventory()["item-1"] = {"item-1", "Sample Item", 10, 5.0, true};
            kiosks.push_back(newKiosk);
            addLog("DEPLOYED NEW NODE: " + body["id"].get<std::string>(), "SUCCESS");
            
            json resp = {{"success", true}, {"kiosk", kioskToJson(newKiosk)}};
            res.set_content(resp.dump(), "application/json");
        } catch (std::exception& e) {
            json err = {{"error", e.what()}};
            res.status = 400;
            res.set_content(err.dump(), "application/json");
        }
    });

    svr.Post("/api/simulate-failure", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        auto body = json::parse(req.body);
        std::string kioskId = body["kioskId"];
        std::string type = body["type"];

        std::shared_ptr<IKiosk> target = nullptr;
        for (auto& k : kiosks) {
            if (k->getId() == kioskId) target = k;
        }

        if (!target) {
            res.status = 404;
            res.set_content(R"({"error":"Kiosk not found"})", "application/json");
            return;
        }

        addLog("MANUAL FAILURE INJECTED: " + type + " at " + kioskId, "WARN");
        FailureResolution resolution = retryHandler->handle(type, kioskId);
        
        if (!resolution.resolved) {
            // Need cast to Kiosk to set state, assuming it's not decorated initially
            if (auto ptr = std::dynamic_pointer_cast<Kiosk>(target)) {
                ptr->setState(std::make_shared<MaintenanceState>(ptr.get()));
            }
            target->setHealth(45);
            addLog("CRITICAL: " + resolution.message, "ERROR");
        } else {
            addLog("SUCCESS: " + resolution.message, "SUCCESS");
        }

        json resp = {{"resolved", resolution.resolved}, {"message", resolution.message}};
        res.set_content(resp.dump(), "application/json");
    });

    svr.Post("/api/purchase", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        auto body = json::parse(req.body);
        std::string kioskId = body["kioskId"];
        std::string itemId = body["itemId"];
        int quantity = body["quantity"];

        std::shared_ptr<Kiosk> target = nullptr;
        for (auto& k : kiosks) {
            if (k->getId() == kioskId) {
                target = std::dynamic_pointer_cast<Kiosk>(k);
                break;
            }
        }

        if (!target) {
            res.status = 404;
            res.set_content(R"({"error":"Kiosk not found"})", "application/json");
            return;
        }

        auto& inv = target->getInventory();
        if (inv.find(itemId) == inv.end()) {
            res.status = 404;
            res.set_content(R"({"error":"Item not found"})", "application/json");
            return;
        }

        Item item = inv[itemId];
        
        // State Check
        PurchaseResult stateRes = target->getState()->handlePurchase(item);
        if (!stateRes.success) {
            res.status = 403;
            json err = {{"success", false}, {"message", stateRes.message}};
            res.set_content(err.dump(), "application/json");
            return;
        }

        // Strategy Check
        PricingContext pricingContext(target->getPricingStrategy());
        double finalPrice = pricingContext.calculatePrice(item.price, quantity);

        // Command Pattern
        PurchaseItemCommand command(target, item, quantity);
        CommandResult cmdRes = command.execute();

        if (cmdRes.success) {
            addLog("Transaction request: " + std::to_string(quantity) + "x " + itemId + " at " + kioskId);
            json trans = {
                {"id", "trans_" + std::to_string(std::chrono::system_clock::now().time_since_epoch().count())},
                {"kioskId", kioskId},
                {"itemId", itemId},
                {"quantity", quantity},
                {"totalPrice", finalPrice},
                {"timestamp", getCurrentTime()}
            };
            transactions.push_back(trans);
            
            json resp = {{"success", true}, {"message", cmdRes.message}, {"transaction", trans}};
            res.set_content(resp.dump(), "application/json");
        } else {
            res.status = 400;
            json err = {{"success", false}, {"message", cmdRes.message}};
            res.set_content(err.dump(), "application/json");
        }
    });

    svr.Patch(R"(/api/kiosks/(.*))", [&](const httplib::Request& req, httplib::Response& res) {
        setCors(res);
        std::string id = req.matches[1];
        auto body = json::parse(req.body);

        std::shared_ptr<Kiosk> target = nullptr;
        for (auto& k : kiosks) {
            if (k->getId() == id) {
                target = std::dynamic_pointer_cast<Kiosk>(k);
                break;
            }
        }
        if (!target) {
            res.status = 404;
            res.set_content(R"({"error":"Node not found"})", "application/json");
            return;
        }

        try {
            AdminProxy proxy(target, "ADMIN"); // Simulating valid auth
            if (body.contains("health")) proxy.updateHealth(body["health"]);
            
            // Apply Decorators
            if (body.contains("addons")) {
                for (auto addon : body["addons"]) {
                    if (addon == "SOLAR") {
                        auto decorated = std::make_shared<SolarPowerDecorator>(target);
                        for (auto& k : kiosks) if (k->getId() == id) k = decorated;
                    } else if (addon == "COOLING") {
                        auto decorated = std::make_shared<CoolingAddonDecorator>(target);
                        for (auto& k : kiosks) if (k->getId() == id) k = decorated;
                    }
                }
            }

            addLog("UPDATED NODE: " + id + " modified via Secure Proxy", "SUCCESS");
            res.set_content(R"({"success":true})", "application/json");
        } catch (std::exception& e) {
            res.status = 403;
            json err = {{"error", e.what()}};
            res.set_content(err.dump(), "application/json");
        }
    });

    std::cout << "Aura Retail OS C++ Backend running on http://localhost:5000\n";
    svr.listen("0.0.0.0", 5000);

    return 0;
}
