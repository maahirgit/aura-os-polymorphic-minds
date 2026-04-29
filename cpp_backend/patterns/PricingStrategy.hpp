#ifndef PRICING_STRATEGY_HPP
#define PRICING_STRATEGY_HPP

#include <iostream>
#include <memory>

// Strategy Interface
class PricingStrategy {
public:
    virtual ~PricingStrategy() = default;
    virtual double calculatePrice(double basePrice, int quantity) = 0;
};

// Concrete Strategy: Standard
class StandardPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice, int quantity) override {
        return basePrice * quantity;
    }
};

// Concrete Strategy: Discount
class DiscountPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice, int quantity) override {
        // 10% discount on bulk or special conditions
        return (basePrice * quantity) * 0.90;
    }
};

// Concrete Strategy: Emergency
class EmergencyPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice, int quantity) override {
        // Price caps during emergencies (e.g., 50% discount to ensure access)
        return (basePrice * quantity) * 0.50;
    }
};

// Context
class PricingContext {
private:
    std::shared_ptr<PricingStrategy> strategy;

public:
    PricingContext(std::shared_ptr<PricingStrategy> initStrategy = std::make_shared<StandardPricing>()) 
        : strategy(initStrategy) {}

    void setStrategy(std::shared_ptr<PricingStrategy> newStrategy) {
        strategy = newStrategy;
    }

    double calculatePrice(double basePrice, int quantity) {
        if (!strategy) {
            return basePrice * quantity;
        }
        return strategy->calculatePrice(basePrice, quantity);
    }
};

#endif // PRICING_STRATEGY_HPP
