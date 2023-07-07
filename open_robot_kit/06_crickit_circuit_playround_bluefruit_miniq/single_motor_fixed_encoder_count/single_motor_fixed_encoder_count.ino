#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

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

}

// Select motor

#define WEAVLY_ROBOT_LEFT_MOTOR

#ifdef WEAVLY_ROBOT_LEFT_MOTOR
    // Left
    const int encoderPin = A2;
    const int motorPin1 = CRICKIT_MOTOR_A1;
    const int motorPin2 = CRICKIT_MOTOR_A2;
#else
    // Right
    const int encoderPin = A3;
    const int motorPin1 = CRICKIT_MOTOR_B1;
    const int motorPin2 = CRICKIT_MOTOR_B2;
#endif

// Globals

const int encoderCountGoal = 30000;
Adafruit_Crickit crickit;
Weavly::Robot::MotorWithEncoder motor(crickit);
bool running = false;

void setup()
{
    Serial.begin(9600);
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
    pinMode(encoderPin, INPUT_PULLUP);
    attachInterrupt(encoderPin, handleEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(motorPin1, 30);
    crickit.setPWMFreq(motorPin2, 30);

    // Attach the motor
    motor.attachMotor(motorPin1, motorPin2);

    Serial.println("Robot ready");
}

void handleEncoderInterrupt()
{
    motor.incrementEncoderCount();
}

void loop()
{
    if (Serial.available() > 0) {
        String input = Serial.readString();
        input.trim();
        if (!running && input == "on") {
            Serial.println("ON");
            running = true;
            motor.setEncoderCount(0);
            motor.throttle(1.0);
        }
    }

    if (running && motor.getEncoderCount() > encoderCountGoal) {
        Serial.print("Completed ");
        Serial.print(encoderCountGoal);
        Serial.println(" encoder counts");
        motor.throttle(0);
        running = false;
    }
}
