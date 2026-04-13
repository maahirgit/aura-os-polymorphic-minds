#ifndef EMERGENCY_STATE_H
#define EMERGENCY_STATE_H

#include "State.h"
#include <iostream>
using namespace std;

class EmergencyState : public State {
public:
    void handle() override {
        cout << "Emergency Mode Activated\n";
    }
};

#endif
