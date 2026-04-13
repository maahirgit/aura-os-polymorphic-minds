#ifndef KIOSK_CORE_H
#define KIOSK_CORE_H

#include "../patterns/strategy/PricingStrategy.h"
#include "../patterns/state/State.h"

class KioskCore {
private:
    PricingStrategy* pricing;
    State* state;

public:
    void setPricingStrategy(PricingStrategy* p);
    void setState(State* s);
    void processOrder(int basePrice);
};

#endif
