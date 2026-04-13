#ifndef SYSTEM_FACTORY_H
#define SYSTEM_FACTORY_H

#include "../../inventory/InventorySystem.h"
#include <string>
using namespace std;

class SystemFactory {
public:
    static InventorySystem createSystem(string type) {
        return InventorySystem(type);
    }
};

#endif
