#include "Motor.h"
#include "weavly_math.h"
#include <cmath>

namespace Weavly::Robot {

void Motor::throttle(float value)
{
    if (m_motorPinA < 0 || m_motorPinB < 0) {
        return;
    }

    value = clamp(value, -1.0, 1.0);

    // Operate the motor in 'slow decay mode'

    uint16_t absolute = fabs(value) * 0xFFFF;

    if (value < 0) {
        m_crickit.analogWrite(m_motorPinA, 0xFFFF);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF - absolute);
    } else {
        m_crickit.analogWrite(m_motorPinA, 0xFFFF - absolute);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF);
    }
}

}
