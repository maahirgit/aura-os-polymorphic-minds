#ifndef ACTIVE_STATE_H
#define ACTIVE_STATE_H

#include "State.h"
#include <iostream>
using namespace std;

class ActiveState : public State {
public:
    void handle() override {
        cout << "Kiosk is Active\n";
    }
};

#endif
