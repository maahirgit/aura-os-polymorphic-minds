#include "KioskCore.h"
#include <iostream>
using namespace std;

void KioskCore::setPricingStrategy(PricingStrategy* p) {
    pricing = p;
}

void KioskCore::setState(State* s) {
    state = s;
}

void KioskCore::processOrder(int basePrice) {
    state->handle();
    int finalPrice = pricing->calculatePrice(basePrice);
    cout << "Final Price: " << finalPrice << endl;
}
