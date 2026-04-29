#ifndef EVENT_SYSTEM_HPP
#define EVENT_SYSTEM_HPP

#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <functional>

// Using std::function to allow lambda callbacks
using EventCallback = std::function<void(const std::string&)>;

class EventSystem {
private:
    std::map<std::string, std::vector<EventCallback>> subscribers;

    EventSystem() {} // Private constructor

public:
    // Delete copy constructor and assignment operator
    EventSystem(const EventSystem&) = delete;
    EventSystem& operator=(const EventSystem&) = delete;

    static EventSystem& getInstance() {
        static EventSystem instance;
        return instance;
    }

    void subscribe(const std::string& eventType, EventCallback callback) {
        subscribers[eventType].push_back(callback);
    }

    void notify(const std::string& eventType, const std::string& data) {
        std::cout << "[EventSystem] Notifying: " << eventType << " | Data: " << data << std::endl;
        if (subscribers.find(eventType) != subscribers.end()) {
            for (const auto& callback : subscribers[eventType]) {
                callback(data);
            }
        }
    }
};

#endif // EVENT_SYSTEM_HPP
