const { ActiveState } = require('./KioskState');
const { StandardPricing } = require('./PricingStrategy');

class Kiosk {
    constructor(id, type, location) {
        this.id = id;
        this.type = type;
        this.location = location;
        this.inventory = {};
        this.state = new ActiveState(this);
        this.pricingStrategy = new StandardPricing();
        this.health = 100;
        this.modules = [];
    }
}

class PharmacyKiosk extends Kiosk {
    constructor(id, location) {
        super(id, "PHARMACY", location);
        this.modules = ["VerificationModule", "ClimateControl"];
    }
}

class FoodKiosk extends Kiosk {
    constructor(id, location) {
        super(id, "FOOD", location);
        this.modules = ["Refrigeration"];
    }
}

class EmergencyReliefKiosk extends Kiosk {
    constructor(id, location) {
        super(id, "EMERGENCY", location);
        this.modules = ["SolarPanel", "SatelliteLink"];
    }
}

class KioskFactory {
    static createKiosk(type, id, location) {
        switch (type.toUpperCase()) {
            case 'PHARMACY':
                return new PharmacyKiosk(id, location);
            case 'FOOD':
                return new FoodKiosk(id, location);
            case 'EMERGENCY':
                return new EmergencyReliefKiosk(id, location);
            default:
                throw new Error("Unknown kiosk type");
        }
    }
}

module.exports = KioskFactory;
