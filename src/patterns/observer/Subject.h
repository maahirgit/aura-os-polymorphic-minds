#ifndef SUBJECT_H
#define SUBJECT_H

#include <vector>
#include "Observer.h"
using namespace std;

class Subject {
    vector<Observer*> observers;

public:
    void addObserver(Observer* o) {
        observers.push_back(o);
    }

    void notify(string msg) {
        for(auto o : observers)
            o->update(msg);
    }
};

#endif
