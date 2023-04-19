#include "MotorMovement.h"

namespace Weavly::Robot {

float MotorMovement::getThrottle(unsigned long timeMs, float encoderCount)
{
    if (timeMs >= startTimeMs) {
        if (timeMs <= startTimeMs + rampUpTimeMs) {
            // Ramp up phase
            return (throttle * (timeMs - startTimeMs)) / rampUpTimeMs;
        } else if (encoderCount <= encoderCountGoal) {
            if (encoderCount <= rampDownEncoderCount) {
                // Full throttle phase
                return throttle;
            } else {
                // Ramp down phase
                return throttle +
                    ((endThrottle - throttle) * (encoderCount - rampDownEncoderCount)) /
                    (encoderCountGoal - rampDownEncoderCount);
            }
        }
    }

    return 0;
}

bool MotorMovement::atFullThrottle(unsigned long timeMs, float encoderCount)
{
    return (timeMs > startTimeMs + rampUpTimeMs)
        && (encoderCount < rampDownEncoderCount);
}

}
