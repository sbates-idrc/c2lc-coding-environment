#include "Motor.h"
#include "weavly_math.h"
#include <cmath>

#ifdef WEAVLY_ROBOT_TEST_BUILD
    #include "../tests/mock_arduino.h"
#endif

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

float Motor::measureSpeed()
{
    unsigned long now = millis();

    if (now >= m_startOfSpeedSampleTimeMs + m_speedSamplePeriodMs) {
        m_encoderCountsPerSecond = 1000.0f * m_speedEncoderCount /
                (now - m_startOfSpeedSampleTimeMs);
        m_startOfSpeedSampleTimeMs = now;
        m_speedEncoderCount = 0;
    }

    return m_encoderCountsPerSecond;
}

}
