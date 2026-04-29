#ifndef TRANSACTION_COMMAND_HPP
#define TRANSACTION_COMMAND_HPP

#include "Kiosk.hpp"
#include <iostream>

struct CommandResult {
    bool success;
    std::string message;
};

// Command Interface
class Command {
public:
    virtual ~Command() = default;
    virtual CommandResult execute() = 0;
    virtual CommandResult undo() = 0;
};

// Concrete Command
class PurchaseItemCommand : public Command {
private:
    std::shared_ptr<Kiosk> kiosk;
    Item item;
    int quantity;
    bool executed;

public:
    PurchaseItemCommand(std::shared_ptr<Kiosk> k, const Item& i, int q)
        : kiosk(k), item(i), quantity(q), executed(false) {}

    CommandResult execute() override {
        if (executed) {
            return {false, "Command already executed"};
        }

        auto& inv = kiosk->getInventory();
        if (inv.find(item.id) == inv.end() || inv[item.id].count < quantity) {
            return {false, "Insufficient inventory for " + item.name};
        }

        // Deduct inventory
        inv[item.id].count -= quantity;
        executed = true;
        
        std::cout << "[Command] Executed purchase: " << quantity << "x " << item.name << " from Kiosk " << kiosk->getId() << "\n";
        return {true, "Purchase successful"};
    }

    CommandResult undo() override {
        if (!executed) {
            return {false, "Command has not been executed yet"};
        }

        // Restock inventory
        auto& inv = kiosk->getInventory();
        inv[item.id].count += quantity;
        executed = false;

        std::cout << "[Command] Undid purchase: Restocked " << quantity << "x " << item.name << " to Kiosk " << kiosk->getId() << "\n";
        return {true, "Purchase undone successfully"};
    }
};

#endif // TRANSACTION_COMMAND_HPP
