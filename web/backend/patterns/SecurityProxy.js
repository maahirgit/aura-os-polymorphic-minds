class AdminProxy {
    constructor(kiosk, userRole) {
        this.kiosk = kiosk;
        this.userRole = userRole;
    }

    updateInventory(data) {
        if (this.userRole !== 'ADMIN') {
            throw new Error("ACCESS_DENIED: Unauthorized attempt to modify secure inventory.");
        }
        // If authorized, delegate to real kiosk
        this.kiosk.inventory = { ...this.kiosk.inventory, ...data };
        return true;
    }

    updateLocation(loc) {
        if (this.userRole !== 'ADMIN') {
             throw new Error("ACCESS_DENIED: Relocation requires administrative clearance.");
        }
        this.kiosk.location = loc;
        return true;
    }
}

module.exports = AdminProxy;
