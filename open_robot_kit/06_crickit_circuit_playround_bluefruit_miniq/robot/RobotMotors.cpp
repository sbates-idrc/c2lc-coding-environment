#include "RobotMotors.h"
#include "weavly_debug_print.h"

namespace Weavly::Robot {

void RobotMotors::attachLeftMotor(int pinA, int pinB)
{
    m_leftMotor.attach(pinA, pinB);
}

void RobotMotors::attachRightMotor(int pinA, int pinB)
{
    m_rightMotor.attach(pinA, pinB);
}

float RobotMotors::getScaledLeftEncoderCount()
{
    return m_leftMotor.getScaledEncoderCount();
}

float RobotMotors::getScaledRightEncoderCount()
{
    return m_rightMotor.getScaledEncoderCount();
}

void RobotMotors::incrementLeftEncoderCount()
{
    m_leftMotor.incrementEncoderCount();
}

void RobotMotors::incrementRightEncoderCount()
{
    m_rightMotor.incrementEncoderCount();
}

void RobotMotors::onMovementFinished(void (*callback)(void))
{
    m_movementFinishedCallback = callback;
}

void RobotMotors::startMotors(unsigned long rampUpTimeMs,
        float leftThrottle,
        float rightThrottle,
        int rampDownEncoderCount,
        int encoderCountGoal,
        float leftEndThrottle,
        float rightEndThrottle)
{
    unsigned long now = millis();

    m_state = RobotMotorsState::moving;

    m_startedMeasuringSpeeds = false;

    m_leftMotor.resetEncoderCount();
    m_rightMotor.resetEncoderCount();

    m_leftMotorMovement.startTimeMs = now;
    m_leftMotorMovement.rampUpTimeMs = rampUpTimeMs;
    m_leftMotorMovement.throttle = leftThrottle;
    m_leftMotorMovement.rampDownEncoderCount = rampDownEncoderCount;
    m_leftMotorMovement.encoderCountGoal = encoderCountGoal;
    m_leftMotorMovement.endThrottle = leftEndThrottle;

    m_rightMotorMovement.startTimeMs = now;
    m_rightMotorMovement.rampUpTimeMs = rampUpTimeMs;
    m_rightMotorMovement.throttle = rightThrottle;
    m_rightMotorMovement.rampDownEncoderCount = rampDownEncoderCount;
    m_rightMotorMovement.encoderCountGoal = encoderCountGoal;
    m_rightMotorMovement.endThrottle = rightEndThrottle;
}

void RobotMotors::updateMotors()
{
    if (m_state == RobotMotorsState::moving) {
        unsigned long now = millis();
        bool leftDone = false;
        bool rightDone = false;

        bool bothMotorsFullThrottle =
            m_leftMotorMovement.atFullThrottle(now, m_leftMotor.getScaledEncoderCount())
            && m_rightMotorMovement.atFullThrottle(now, m_rightMotor.getScaledEncoderCount());

        if (!m_startedMeasuringSpeeds && bothMotorsFullThrottle) {
            // We have ramped up the motors, start measuring their speeds
            m_startedMeasuringSpeeds = true;
            m_startOfSpeedSampleTimeMs = now;
            m_leftMotor.resetSpeedEncoderCount();
            m_rightMotor.resetSpeedEncoderCount();
        }

        if (m_startedMeasuringSpeeds
                && bothMotorsFullThrottle
                && now >= m_startOfSpeedSampleTimeMs + m_speedSamplePeriodMs) {
            WEAVLY_ROBOT_PRINT("Left throttleFactor: ");
            WEAVLY_ROBOT_PRINTLN(m_leftMotor.getThrottleFactor());
            WEAVLY_ROBOT_PRINT("Right throttleFactor: ");
            WEAVLY_ROBOT_PRINTLN(m_rightMotor.getThrottleFactor());
            WEAVLY_ROBOT_PRINT("Left speed: ");
            WEAVLY_ROBOT_PRINTLN(m_leftMotor.getScaledSpeedEncoderCount());
            WEAVLY_ROBOT_PRINT("Right speed: ");
            WEAVLY_ROBOT_PRINTLN(m_rightMotor.getScaledSpeedEncoderCount());

            if (m_leftMotor.getScaledSpeedEncoderCount() > m_rightMotor.getScaledSpeedEncoderCount()) {
                this->adjustMotorThrottleFactors(m_leftMotor, m_rightMotor);
            } else {
                this->adjustMotorThrottleFactors(m_rightMotor, m_leftMotor);
            }

            // Start a new sample perod
            m_startOfSpeedSampleTimeMs = now;
            m_leftMotor.resetSpeedEncoderCount();
            m_rightMotor.resetSpeedEncoderCount();
        }

        if (m_leftMotor.getScaledEncoderCount() >= m_leftMotorMovement.encoderCountGoal) {
            leftDone = true;
            m_leftMotor.throttle(0);
        } else {
            m_leftMotor.throttle(m_leftMotorMovement.getThrottle(now, m_leftMotor.getScaledEncoderCount()));
        }

        if (m_rightMotor.getScaledEncoderCount() >= m_rightMotorMovement.encoderCountGoal) {
            rightDone = true;
            m_rightMotor.throttle(0);
        } else {
            m_rightMotor.throttle(m_rightMotorMovement.getThrottle(now, m_rightMotor.getScaledEncoderCount()));
        }

        if (leftDone && rightDone) {
            m_state = RobotMotorsState::pauseAtEndOfMovement;
            m_endOfPauseTime = now + m_pauseTimeMs;
        }
    } else if (m_state == RobotMotorsState::pauseAtEndOfMovement) {
        if (millis() > m_endOfPauseTime) {
            m_state = RobotMotorsState::waiting;
            m_movementFinishedCallback();
        }
    }
}

bool RobotMotors::isWaiting()
{
    return m_state == RobotMotorsState::waiting;
}

void RobotMotors::adjustMotorThrottleFactors(Motor& fasterMotor, Motor& slowerMotor)
{
    // Super simple initial balancing algorithm
    if (slowerMotor.getThrottleFactor() < 1.0) {
        slowerMotor.setThrottleFactor(slowerMotor.getThrottleFactor() + 0.01);
    } else {
        fasterMotor.setThrottleFactor(fasterMotor.getThrottleFactor() - 0.01);
    }
}

}
