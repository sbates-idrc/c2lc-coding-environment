#include "Motor.h"
#include "weavly_math.h"
#include <cmath>

namespace Weavly::Robot {

void Motor::throttle(float value)
{
    if (m_motorPinA < 0 || m_motorPinB < 0) {
        return;
    }

    value = value * m_throttleFactor;

    value = clamp(value, -1.0, 1.0);

    // Operate the motor in 'slow decay mode'

    float absolute = fabs(value);

    if (absolute > 0 && absolute < m_minThrottle) {
        absolute = m_minThrottle;
    }

    uint16_t absolute16 = absolute * 0xFFFF;

    if (value < 0) {
        m_crickit.analogWrite(m_motorPinA, 0xFFFF);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF - absolute16);
    } else {
        m_crickit.analogWrite(m_motorPinA, 0xFFFF - absolute16);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF);
    }
}

}
