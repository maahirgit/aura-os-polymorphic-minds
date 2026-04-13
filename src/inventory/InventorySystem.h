#ifndef INVENTORY_SYSTEM_H
#define INVENTORY_SYSTEM_H

#include <string>
#include <map>
using namespace std;

class InventorySystem {
private:
    map<string, int> stock;
    map<string, int> prices;

public:
    InventorySystem(string systemType);

    void displayItems();
    bool isAvailable(string item);
    int getPrice(string item);

    int getStock(string item);
    void reduceStock(string item, int quantity);

    void addItem(string item, int quantity, int price);
};

#endif
