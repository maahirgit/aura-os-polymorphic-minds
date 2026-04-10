#ifndef PRICING_STRATEGY_H
#define PRICING_STRATEGY_H

class PricingStrategy {
public:
    virtual int calculatePrice(int price) = 0;
};

#endif
