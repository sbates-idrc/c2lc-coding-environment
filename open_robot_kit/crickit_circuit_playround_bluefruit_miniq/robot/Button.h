#ifndef WEAVLY_ROBOT_BUTTON_H
#define WEAVLY_ROBOT_BUTTON_H

namespace Weavly::Robot {

class Button {
public:
    Button(int pin) : m_pin(pin), m_lastValue(0), m_lastPressTime(0) {}
    bool isPressed();

private:
    int m_pin;
    int m_lastValue;
    unsigned long m_lastPressTime;
};

}

#endif
