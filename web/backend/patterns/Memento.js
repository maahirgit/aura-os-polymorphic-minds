class KioskMemento {
    constructor(state) {
        this.data = JSON.parse(JSON.stringify(state)); // Deep copy
        this.timestamp = new Date();
    }
}

class KioskCaretaker {
    constructor() {
        this.mementos = {}; // kioskId -> Array of mementos
    }

    addMemento(kioskId, memento) {
        if (!this.mementos[kioskId]) this.mementos[kioskId] = [];
        this.mementos[kioskId].push(memento);
        if (this.mementos[kioskId].length > 5) this.mementos[kioskId].shift(); // Keep last 5
    }

    getLatest(kioskId) {
        const list = this.mementos[kioskId];
        return list && list.length > 0 ? list[list.length - 1] : null;
    }
}

module.exports = { KioskMemento, KioskCaretaker };
