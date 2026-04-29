#ifndef FAILURE_HANDLER_HPP
#define FAILURE_HANDLER_HPP

#include <iostream>
#include <string>
#include <memory>

struct FailureResolution {
    bool resolved;
    std::string message;
};

// Handler Interface
class FailureHandler {
protected:
    std::shared_ptr<FailureHandler> nextHandler;

public:
    virtual ~FailureHandler() = default;

    std::shared_ptr<FailureHandler> setNext(std::shared_ptr<FailureHandler> handler) {
        nextHandler = handler;
        return handler;
    }

    virtual FailureResolution handle(const std::string& failureType, const std::string& kioskId) {
        if (nextHandler) {
            return nextHandler->handle(failureType, kioskId);
        }
        return {false, "Failure could not be resolved by any handler."};
    }
};

// Concrete Handler 1
class AutomaticRetryHandler : public FailureHandler {
public:
    FailureResolution handle(const std::string& failureType, const std::string& kioskId) override {
        if (failureType == "NETWORK_TIMEOUT" || failureType == "PAYMENT_SYNC_ERROR") {
            std::cout << "[AutomaticRetryHandler] Retrying operation for kiosk " << kioskId << "...\n";
            return {true, "Resolved automatically via retry protocol."};
        }
        return FailureHandler::handle(failureType, kioskId);
    }
};

// Concrete Handler 2
class HardwareRecalibrationHandler : public FailureHandler {
public:
    FailureResolution handle(const std::string& failureType, const std::string& kioskId) override {
        if (failureType == "SENSOR_MISMATCH" || failureType == "DISPENSER_JAM") {
            std::cout << "[HardwareRecalibrationHandler] Running recalibration cycle on kiosk " << kioskId << "...\n";
            return {true, "Hardware recalibrated successfully."};
        }
        return FailureHandler::handle(failureType, kioskId);
    }
};

// Concrete Handler 3
class TechnicianAlertHandler : public FailureHandler {
public:
    FailureResolution handle(const std::string& failureType, const std::string& kioskId) override {
        if (failureType == "MOTOR_STALL" || failureType == "POWER_SURGE") {
            std::cout << "[TechnicianAlertHandler] Critical failure on kiosk " << kioskId << ". Dispatching technician.\n";
            return {false, "Requires physical technician intervention. Dispatched."};
        }
        return FailureHandler::handle(failureType, kioskId);
    }
};

#endif // FAILURE_HANDLER_HPP
