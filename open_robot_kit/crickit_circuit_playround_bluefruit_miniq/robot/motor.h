#ifndef WEAVLY_ROBOT_MOTOR_H
#define WEAVLY_ROBOT_MOTOR_H

#ifdef WEAVLY_ROBOT_TEST_BUILD
    #include "../tests/mock_Adafruit_Crickit.h"
#else
    #include <Adafruit_Crickit.h>
#endif

namespace Weavly::Robot {

class Motor {
public:
    Motor(Adafruit_Crickit& crickit)
        : m_crickit(crickit),
        m_motorPinA(-1),
        m_motorPinB(-1),
        m_encoderCount(0)
    {
    }

    void attach(int pinA, int pinB)
    {
        m_motorPinA = pinA;
        m_motorPinB = pinB;
    }

    void throttle(float value);

    int getEncoderCount()
    {
        return m_encoderCount;
    }

    void setEncoderCount(int count)
    {
        m_encoderCount = count;
    }

    void incrementEncoderCount()
    {
        ++m_encoderCount;
    }

private:
    Adafruit_Crickit& m_crickit;
    int m_motorPinA;
    int m_motorPinB;
    int m_encoderCount;
};

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
