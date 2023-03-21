#include "RobotMotors.h"

namespace Weavly::Robot {

void RobotMotors::attachLeftMotor(int pinA, int pinB)
{
    m_leftMotor.attach(pinA, pinB);
}

void RobotMotors::attachRightMotor(int pinA, int pinB)
{
    m_rightMotor.attach(pinA, pinB);
}

int RobotMotors::getLeftEncoderCount()
{
    return m_leftMotor.getEncoderCount();
}

int RobotMotors::getRightEncoderCount()
{
    return m_rightMotor.getEncoderCount();
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

    m_leftMotor.setEncoderCount(0);
    m_rightMotor.setEncoderCount(0);

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

        if (m_leftMotor.getEncoderCount() >= m_leftMotorMovement.encoderCountGoal) {
            leftDone = true;
            m_leftMotor.throttle(0);
        } else {
            m_leftMotor.throttle(m_leftMotorMovement.getThrottle(now, m_leftMotor.getEncoderCount()));
        }

        if (m_rightMotor.getEncoderCount() >= m_rightMotorMovement.encoderCountGoal) {
            rightDone = true;
            m_rightMotor.throttle(0);
        } else {
            m_rightMotor.throttle(m_rightMotorMovement.getThrottle(now, m_rightMotor.getEncoderCount()));
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

}
