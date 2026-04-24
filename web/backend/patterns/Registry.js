const fs = require('fs');
const path = require('path');

class Registry {
    constructor() {
        if (Registry.instance) {
            return Registry.instance;
        }
        this.config = {
            city: "Zephyrus",
            version: "2.0.0-Modular",
            emergencyMode: false,
            maintenanceSchedule: [],
            activeKiosks: []
        };
        this.dataPath = path.join(__dirname, '../data/registry.json');
        this.load();
        Registry.instance = this;
    }

    load() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const data = fs.readFileSync(this.dataPath, 'utf8');
                this.config = { ...this.config, ...JSON.parse(data) };
            }
        } catch (err) {
            console.error("Error loading registry:", err);
        }
    }

    save() {
        try {
            const dir = path.dirname(this.dataPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(this.dataPath, JSON.stringify(this.config, null, 2));
        } catch (err) {
            console.error("Error saving registry:", err);
        }
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.save();
    }
}

module.exports = new Registry();
