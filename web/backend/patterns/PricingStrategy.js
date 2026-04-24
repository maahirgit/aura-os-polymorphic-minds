class PricingStrategy {
    calculate(basePrice, quantity) {
        throw new Error("calculate method must be implemented");
    }
}

class StandardPricing extends PricingStrategy {
    calculate(basePrice, quantity) {
        return basePrice * quantity;
    }
}

class DiscountPricing extends PricingStrategy {
    constructor(discountRate = 0.8) {
        super();
        this.discountRate = discountRate;
    }
    calculate(basePrice, quantity) {
        return basePrice * quantity * this.discountRate;
    }
}

class EmergencyPricing extends PricingStrategy {
    calculate(basePrice, quantity) {
        // Essential items are cheaper or capped in emergency
        return (basePrice * 0.5) * quantity;
    }
}

class PricingContext {
    constructor() {
        this.strategy = new StandardPricing();
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    calculatePrice(basePrice, quantity) {
        return this.strategy.calculate(basePrice, quantity);
    }
}

module.exports = {
    PricingContext,
    StandardPricing,
    DiscountPricing,
    EmergencyPricing
};
