class EventSystem {
    constructor() {
        if (EventSystem.instance) {
            return EventSystem.instance;
        }
        this.subscribers = {};
        EventSystem.instance = this;
    }

    subscribe(eventType, callback) {
        if (!this.subscribers[eventType]) {
            this.subscribers[eventType] = [];
        }
        this.subscribers[eventType].push(callback);
    }

    notify(eventType, data) {
        console.log(`[EventSystem] Notifying: ${eventType}`, data);
        if (this.subscribers[eventType]) {
            this.subscribers[eventType].forEach(callback => callback(data));
        }
    }
}

module.exports = new EventSystem();
