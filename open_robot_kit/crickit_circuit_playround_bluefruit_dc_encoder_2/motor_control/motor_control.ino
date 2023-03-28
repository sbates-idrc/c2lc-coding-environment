// A program to control the motor voltage using the 2 buttons on the
// Circuit Playground. This program does not connect to Weavly.

#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

#define LEFT_ENCODER_PIN A2

// Classes

namespace Weavly::Robot {

class MotorWithEncoder {
public:
    MotorWithEncoder(Adafruit_Crickit& crickit)
        : m_crickit(crickit),
        m_motorPinA(-1),
        m_motorPinB(-1),
        m_encoderCount(0)
    {
    }

    void attachMotor(int pinA, int pinB)
    {
        m_motorPinA = pinA;
        m_motorPinB = pinB;
    }

    void throttle(float value)
    {
        if (m_motorPinA < 0 || m_motorPinB < 0) {
            return;
        }

        value = constrain(value, -1.0, 1.0);

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

class Button {
public:
    Button(int pin) : m_pin(pin), m_lastValue(0), m_lastPressTime(0) {}

    bool isPressed()
    {
        bool isPressed = false;
        int value = digitalRead(m_pin);

        if (value == 1 && m_lastValue == 0) {
            unsigned long now = millis();
            if (now - m_lastPressTime > 200) {
                isPressed = true;
                m_lastPressTime = now;
            }
        }

        m_lastValue = value;
        return isPressed;
    }

private:
    int m_pin;
    int m_lastValue;
    unsigned long m_lastPressTime;
};

}

// Globals

Adafruit_Crickit crickit;

Weavly::Robot::MotorWithEncoder leftMotor(crickit);

Weavly::Robot::Button leftButton(CPLAY_LEFTBUTTON);
Weavly::Robot::Button rightButton(CPLAY_RIGHTBUTTON);

float motorThrottle = 0;

unsigned long lastReportedTime = 0;
int lastReportedEncoderCount = 0;

void setup()
{
    Serial.begin(115200);
    while (!Serial) {
        delay(10);
    }

    if (!CircuitPlayground.begin()) {
        Serial.println("Error starting CircuitPlayground");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("CircuitPlayground started");
    }

    if (!crickit.begin()) {
        Serial.println("Error starting crickit");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("Crickit started");
    }

    // Set up pins to read the motor encoders
    pinMode(LEFT_ENCODER_PIN, INPUT_PULLUP);
    attachInterrupt(LEFT_ENCODER_PIN, handleLeftEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(CRICKIT_MOTOR_A1, 26);
    crickit.setPWMFreq(CRICKIT_MOTOR_A2, 26);

    // Attach the motors
    leftMotor.attachMotor(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);

    // Set up Ciruit Playground buttons
    pinMode(CPLAY_LEFTBUTTON, INPUT_PULLDOWN);
    pinMode(CPLAY_RIGHTBUTTON, INPUT_PULLDOWN);

    printState();
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
}

void printState()
{
    Serial.print("Motor throttle: ");
    Serial.println(motorThrottle);
}

void loop()
{
    float stepSize = 0.05;

    if (leftButton.isPressed()) {
        motorThrottle = constrain(motorThrottle + stepSize, 0.0, 1.0);
        printState();
    }

    if (rightButton.isPressed()) {
        motorThrottle = constrain(motorThrottle - stepSize, 0.0, 1.0);
        printState();
    }

    leftMotor.throttle(motorThrottle);

    unsigned long now = millis();
    if (now - lastReportedTime > 1000) {
        int encoderCount = leftMotor.getEncoderCount();
        float ticksPerSecond = ((encoderCount - lastReportedEncoderCount) * 1000) / (now - lastReportedTime);
        Serial.print("Ticks per second: ");
        Serial.println(ticksPerSecond);
        lastReportedTime = now;
        lastReportedEncoderCount = encoderCount;
    }
}
