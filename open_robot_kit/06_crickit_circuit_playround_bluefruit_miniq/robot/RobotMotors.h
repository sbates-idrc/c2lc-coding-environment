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
    RobotMotors(Adafruit_Crickit& crickit, float minThrottle, unsigned long pauseTimeMs, unsigned long speedSamplePeriodMs)
        : m_leftMotor(crickit, 1.0, 1.0, minThrottle),
        m_rightMotor(crickit, 1.0, 1.0, minThrottle),
        m_state(RobotMotorsState::waiting),
        m_pauseTimeMs(pauseTimeMs),
        m_speedSamplePeriodMs(speedSamplePeriodMs),
        m_startOfSpeedSampleTimeMs(0),
        m_endOfPauseTime(0),
        m_startedMeasuringSpeeds(false),
        m_movementFinishedCallback(nullptr)
        { }
    void attachLeftMotor(int pinA, int pinB);
    void attachRightMotor(int pinA, int pinB);
    float getScaledLeftEncoderCount();
    float getScaledRightEncoderCount();
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
    unsigned long m_speedSamplePeriodMs;
    unsigned long m_startOfSpeedSampleTimeMs;
    unsigned long m_endOfPauseTime;
    bool m_startedMeasuringSpeeds;
    MotorMovement m_leftMotorMovement;
    MotorMovement m_rightMotorMovement;
    void (*m_movementFinishedCallback)();
    void adjustMotorThrottleFactors(Motor& fasterMotor, Motor& slowerMotor);
};

}

#endif
