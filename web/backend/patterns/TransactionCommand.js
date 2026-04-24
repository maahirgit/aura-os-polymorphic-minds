class Command {
    execute() {
        throw new Error("execute method must be implemented");
    }
    undo() {
        throw new Error("undo method must be implemented");
    }
}

class PurchaseItemCommand extends Command {
    constructor(kiosk, item, quantity) {
        super();
        this.kiosk = kiosk;
        this.item = item;
        this.quantity = quantity;
        this.snapshot = null;
    }

    execute() {
        // Save snapshot for rollback
        this.snapshot = {
            inventoryCount: this.kiosk.inventory[this.item.id].count
        };

        if (this.kiosk.inventory[this.item.id].count >= this.quantity) {
            this.kiosk.inventory[this.item.id].count -= this.quantity;
            return { success: true, message: `Purchased ${this.quantity} x ${this.item.name}` };
        } else {
            return { success: false, message: "Insufficient stock" };
        }
    }

    undo() {
        if (this.snapshot) {
            this.kiosk.inventory[this.item.id].count = this.snapshot.inventoryCount;
            console.log(`[Command] Undo purchase of ${this.item.name}. Stock restored.`);
        }
    }
}

class RefundCommand extends Command {
    constructor(kiosk, transactionId) {
        super();
        this.kiosk = kiosk;
        this.transactionId = transactionId;
    }

    execute() {
        // Logic for refunding a transaction
        return { success: true, message: "Transaction refunded" };
    }

    undo() {
        // Reverse refund
    }
}

module.exports = {
    PurchaseItemCommand,
    RefundCommand
};
