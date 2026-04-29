#ifndef MEMENTO_HPP
#define MEMENTO_HPP

#include "Kiosk.hpp"
#include <map>
#include <string>

// Snapshot struct
struct KioskSnapshot {
    std::string location;
    std::map<std::string, Item> inventory;
    int health;
};

// Memento
class KioskMemento {
private:
    KioskSnapshot data;
    std::string timestamp;

public:
    KioskMemento(const KioskSnapshot& snapshot, const std::string& ts) 
        : data(snapshot), timestamp(ts) {}

    KioskSnapshot getData() const { return data; }
    std::string getTimestamp() const { return timestamp; }
};

// Caretaker
class KioskCaretaker {
private:
    std::map<std::string, std::vector<KioskMemento>> history;

public:
    void addMemento(const std::string& kioskId, const KioskMemento& memento) {
        history[kioskId].push_back(memento);
        std::cout << "[Caretaker] Saved checkpoint for Kiosk " << kioskId << " at " << memento.getTimestamp() << "\n";
    }

    // Returns a pointer to Memento or nullptr if no history
    const KioskMemento* getLatest(const std::string& kioskId) const {
        if (history.find(kioskId) != history.end() && !history.at(kioskId).empty()) {
            return &history.at(kioskId).back();
        }
        return nullptr;
    }
};

#endif // MEMENTO_HPP
