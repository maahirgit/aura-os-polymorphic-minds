#ifndef DISCOUNT_PRICING_H
#define DISCOUNT_PRICING_H

#include "PricingStrategy.h"
#include <iostream>
using namespace std;

class DiscountPricing : public PricingStrategy {
public:
    int calculatePrice(int price) override {
        cout << "Discount Applied\n";
        return price * 0.8;
    }
};

#endif