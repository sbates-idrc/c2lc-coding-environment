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
    Motor(Adafruit_Crickit& crickit, float throttleFactor, float minThrottle)
        : m_crickit(crickit),
        m_throttleFactor(throttleFactor),
        m_minThrottle(minThrottle),
        m_motorPinA(-1),
        m_motorPinB(-1),
        m_encoderCount(0),
        m_speedEncoderCount(0)
    {
    }

    void attach(int pinA, int pinB)
    {
        m_motorPinA = pinA;
        m_motorPinB = pinB;
    }

    void setThrottleFactor(float throttleFactor)
    {
        m_throttleFactor = throttleFactor;
    }

    float getThrottleFactor()
    {
        return m_throttleFactor;
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
        ++m_speedEncoderCount;
    }

    int getSpeedEncoderCount()
    {
        return m_speedEncoderCount;
    }

    void resetSpeedEncoderCount()
    {
        m_speedEncoderCount = 0;
    }

private:
    Adafruit_Crickit& m_crickit;
    float m_throttleFactor;
    float m_minThrottle;
    int m_motorPinA;
    int m_motorPinB;
    int m_encoderCount;
    int m_speedEncoderCount;
};

}

#endif