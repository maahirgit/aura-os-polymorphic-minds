#ifndef STANDARD_PRICING_H
#define STANDARD_PRICING_H

#include "PricingStrategy.h"
#include <iostream>
using namespace std;

class StandardPricing : public PricingStrategy {
public:
    int calculatePrice(int price) override {
        cout << "Standard Pricing Applied\n";
        return price;
    }
};

#endif
