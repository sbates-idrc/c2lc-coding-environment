#ifndef WEAVLY_ROBOT_MOTOR_H
#define WEAVLY_ROBOT_MOTOR_H

namespace Weavly::Robot {

class MotorMovement {
public:
    unsigned long startTimeMs;
    unsigned long rampUpTimeMs;
    float throttle;
    int rampDownEncoderCount;
    int encoderCountGoal;
    float endThrottle;
    float getThrottle(unsigned long timeMs, int encoderCount);
};

}

#endif
