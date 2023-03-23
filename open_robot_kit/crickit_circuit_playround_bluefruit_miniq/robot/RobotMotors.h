#ifndef WEAVLY_ROBOT_ROBOT_MOTORS_H
#define WEAVLY_ROBOT_ROBOT_MOTORS_H

#include "Motor.h"
#include "MotorMovement.h"

namespace Weavly::Robot {

enum class RobotMotorsState {
    waiting,
    moving,
    pauseAtEndOfMovement
};

class RobotMotors {
public:
    RobotMotors(Adafruit_Crickit& crickit, unsigned long pauseTimeMs, unsigned long speedSamplePeriodMs)
        : m_leftMotor(crickit, speedSamplePeriodMs),
        m_rightMotor(crickit, speedSamplePeriodMs),
        m_state(RobotMotorsState::waiting),
        m_pauseTimeMs(pauseTimeMs),
        m_endOfPauseTime(0),
        m_movementFinishedCallback(nullptr)
        { }
    void attachLeftMotor(int pinA, int pinB);
    void attachRightMotor(int pinA, int pinB);
    int getLeftEncoderCount();
    int getRightEncoderCount();
    void incrementLeftEncoderCount();
    void incrementRightEncoderCount();
    void onMovementFinished(void (*callback)());
    void startMotors(unsigned long rampUpTimeMs,
        float leftThrottle,
        float rightThrottle,
        int rampDownEncoderCount,
        int encoderCountGoal,
        float leftEndThrottle,
        float rightEndThrottle);
    void updateMotors();
    bool isWaiting();
private:
    Motor m_leftMotor;
    Motor m_rightMotor;
    RobotMotorsState m_state;
    unsigned long m_pauseTimeMs;
    unsigned long m_endOfPauseTime;
    MotorMovement m_leftMotorMovement;
    MotorMovement m_rightMotorMovement;
    void (*m_movementFinishedCallback)();
};

}

#endif
