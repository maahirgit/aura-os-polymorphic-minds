class KioskDecorator {
    constructor(kiosk) {
        this.kiosk = kiosk;
    }

    get id() { return this.kiosk.id; }
    get type() { return this.kiosk.type; }
    get location() { return this.kiosk.location; }
    get inventory() { return this.kiosk.inventory; }
    get health() { return this.kiosk.health; }
    get state() { return this.kiosk.state; }
    get telemetry() { return this.kiosk.telemetry; }
    get modules() { return this.kiosk.modules; }

    set state(s) { this.kiosk.state = s; }
    set health(h) { this.kiosk.health = h; }
}

class SolarPowerDecorator extends KioskDecorator {
    get modules() {
        return [...this.kiosk.modules, 'SOLAR_BACKUP'];
    }

    get telemetry() {
        const base = this.kiosk.telemetry;
        return { ...base, solarCharge: 95 }; // Adds solar metric
    }
}

class CoolingAddonDecorator extends KioskDecorator {
    get modules() {
        return [...this.kiosk.modules, 'ADVANCED_COOLING'];
    }

    get telemetry() {
        const base = this.kiosk.telemetry;
        return { ...base, temp: base.temp - 5 }; // Simulates cooling
    }
}

module.exports = { SolarPowerDecorator, CoolingAddonDecorator };
