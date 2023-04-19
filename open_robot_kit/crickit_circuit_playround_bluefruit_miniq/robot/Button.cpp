#include "Button.h"

#ifdef WEAVLY_ROBOT_TEST_BUILD
    #include "../tests/mock_arduino.h"
#else
    #include "Arduino.h"
#endif

namespace Weavly::Robot {

bool Button::isPressed()
{
    bool isPressed = false;
    int value = digitalRead(m_pin);

    if (value == 1 && m_lastValue == 0) {
        unsigned long now = millis();
        if (now - m_lastPressTime > m_debouncePeriodMs) {
            isPressed = true;
            m_lastPressTime = now;
        }
    }

    m_lastValue = value;
    return isPressed;
}

}
