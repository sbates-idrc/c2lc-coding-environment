#ifndef WEAVLY_ROBOT_MOTOR_MOVEMENT_H
#define WEAVLY_ROBOT_MOTOR_MOVEMENT_H

namespace Weavly::Robot {

struct MotorMovement {
    unsigned long startTimeMs;
    unsigned long rampUpTimeMs;
    float throttle;
    int rampDownEncoderCount;
    int encoderCountGoal;
    float endThrottle;
    float getThrottle(unsigned long timeMs, float encoderCount);
    bool atFullThrottle(unsigned long timeMs, float encoderCount);
};

}

#endif
