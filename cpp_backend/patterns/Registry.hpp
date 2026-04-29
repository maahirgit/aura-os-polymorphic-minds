#ifndef REGISTRY_HPP
#define REGISTRY_HPP

#include <iostream>
#include <map>
#include <string>

class Registry {
private:
    std::map<std::string, std::string> config;

    // Private constructor for Singleton
    Registry() {
        config["environment"] = "PRODUCTION";
        config["emergencyMode"] = "false";
        config["version"] = "1.0.0";
    }

public:
    // Delete copy constructor and assignment operator
    Registry(const Registry&) = delete;
    Registry& operator=(const Registry&) = delete;

    static Registry& getInstance() {
        static Registry instance;
        return instance;
    }

    std::map<std::string, std::string> getConfig() const {
        return config;
    }

    void updateConfig(const std::string& key, const std::string& value) {
        config[key] = value;
        std::cout << "[Registry] Config updated: " << key << " = " << value << std::endl;
    }

    std::string getConfigValue(const std::string& key) {
        if (config.find(key) != config.end()) {
            return config[key];
        }
        return "";
    }
};

#endif // REGISTRY_HPP
