class FailureHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handle(failure) {
        if (this.nextHandler) {
            return this.nextHandler.handle(failure);
        }
        return { resolved: false, message: "Failure could not be resolved." };
    }
}

class AutomaticRetryHandler extends FailureHandler {
    handle(failure) {
        if (failure.type === 'NETWORK' || failure.type === 'DISPENSE_TIMEOUT') {
            console.log(`[Chain] Attempting automatic retry for ${failure.type}...`);
            // Simulate 50% success on retry
            if (Math.random() > 0.5) {
                return { resolved: true, message: "Resolved via automatic retry." };
            }
        }
        return super.handle(failure);
    }
}

class HardwareRecalibrationHandler extends FailureHandler {
    handle(failure) {
        if (failure.type === 'SENSOR_ERROR' || failure.type === 'MOTOR_STALL') {
            console.log(`[Chain] Attempting hardware recalibration for ${failure.type}...`);
            return { resolved: true, message: "Resolved via hardware recalibration." };
        }
        return super.handle(failure);
    }
}

class TechnicianAlertHandler extends FailureHandler {
    handle(failure) {
        console.log(`[Chain] Escalating ${failure.type} to technician...`);
        return { resolved: false, message: "Technician alerted. Kiosk entering maintenance mode.", maintenanceRequired: true };
    }
}

module.exports = {
    AutomaticRetryHandler,
    HardwareRecalibrationHandler,
    TechnicianAlertHandler
};
