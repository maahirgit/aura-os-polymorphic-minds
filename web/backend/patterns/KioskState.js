class KioskState {
    constructor(kiosk) {
        this.kiosk = kiosk;
    }
    handlePurchase(item) {
        throw new Error("Method not implemented");
    }
    getStatus() {
        return this.constructor.name;
    }
}

class ActiveState extends KioskState {
    handlePurchase(item) {
        console.log(`Processing purchase of ${item.name} in Active mode.`);
        return { success: true, message: "Purchase successful" };
    }
}

class MaintenanceState extends KioskState {
    handlePurchase(item) {
        console.log(`Cannot purchase ${item.name}. Kiosk is in Maintenance mode.`);
        return { success: false, message: "System under maintenance. Please try again later." };
    }
}

class EmergencyLockdownState extends KioskState {
    handlePurchase(item) {
        if (item.isEssential) {
            console.log(`Processing emergency distribution of essential item: ${item.name}`);
            return { success: true, message: "Emergency essential item distributed." };
        }
        console.log(`Non-essential item ${item.name} is locked down.`);
        return { success: false, message: "Only essential items are available during emergency lockdown." };
    }
}

class PowerSavingState extends KioskState {
    handlePurchase(item) {
        console.log(`Processing purchase in Power Saving mode. Display dimmed.`);
        return { success: true, message: "Purchase successful (Power Saving Mode)" };
    }
}

module.exports = {
    ActiveState,
    MaintenanceState,
    EmergencyLockdownState,
    PowerSavingState
};
