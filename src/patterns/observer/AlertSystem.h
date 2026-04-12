#ifndef ALERT_SYSTEM_H
#define ALERT_SYSTEM_H

#include "Observer.h"
#include <iostream>
using namespace std;

class AlertSystem : public Observer {
public:
    void update(string message) override {
        cout << "🔔 ALERT: " << message << endl;
    }
};

#endif
