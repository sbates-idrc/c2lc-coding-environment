#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

// #define WEAVLY_ROBOT_DEBUG

#ifdef WEAVLY_ROBOT_DEBUG
    #define WEAVLY_ROBOT_PRINT(x) Serial.print(x);
    #define WEAVLY_ROBOT_PRINTLN(x) Serial.println(x);
#else
    #define WEAVLY_ROBOT_PRINT(x) ;
    #define WEAVLY_ROBOT_PRINTLN(x) ;
#endif

#define LEFT_ENCODER_PIN A2
#define RIGHT_ENCODER_PIN A3

// Classes

namespace Weavly::Robot {

class MotorWithEncoder {
public:
    MotorWithEncoder(Adafruit_Crickit& crickit)
        : m_crickit(crickit),
        m_motorPinA(-1),
        m_motorPinB(-1),
        m_throttle(0),
        m_encoderCount(0),
        m_adjustmentEncoderCount(0)
    {
    }

    void attachMotor(int pinA, int pinB)
    {
        m_motorPinA = pinA;
        m_motorPinB = pinB;
    }

    void forward()
    {
        if (m_motorPinA < 0 || m_motorPinB < 0) {
            return;
        }

        // Operate the motor in 'slow decay mode'

        uint16_t absolute = fabs(m_throttle) * 0xFFFF;
        m_crickit.analogWrite(m_motorPinA, 0xFFFF - absolute);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF);
    }

    void off()
    {
        m_crickit.analogWrite(m_motorPinA, 0xFFFF);
        m_crickit.analogWrite(m_motorPinB, 0xFFFF);
    }

    float getThrottle()
    {
        return m_throttle;
    }

    void setThrottle(float value)
    {
        m_throttle = constrain(value, 0.0, 1.0);
    }

    int getEncoderCount()
    {
        return m_encoderCount;
    }

    void setEncoderCount(int count)
    {
        m_encoderCount = count;
    }

    int getAdjustmentEncoderCount()
    {
        return m_adjustmentEncoderCount;
    }

    void setAdjustmentEncoderCount(int count)
    {
        m_adjustmentEncoderCount = count;
    }

    void incrementEncoderCount()
    {
        ++m_encoderCount;
        ++m_adjustmentEncoderCount;
    }

private:
    Adafruit_Crickit& m_crickit;
    int m_motorPinA;
    int m_motorPinB;
    float m_throttle;
    int m_encoderCount;
    int m_adjustmentEncoderCount;
};

enum class MoveState {
    notMoving,
    moveRequested,
    moving
};

}

// Globals

const int motorPwmFreq = 26;
const float minThrottle = 0.55;
const int moveDelay = 1000;
const int numEncoderCountToMove = 600;

Adafruit_Crickit crickit;

Weavly::Robot::MotorWithEncoder leftMotor(crickit);
Weavly::Robot::MotorWithEncoder rightMotor(crickit);

Weavly::Robot::MoveState moveState = Weavly::Robot::MoveState::notMoving;
unsigned long startMoveTime = 0;

void setup()
{
#ifdef WEAVLY_ROBOT_DEBUG
    Serial.begin(115200);
    while (!Serial) {
        delay(10);
    }
#endif

    if (!CircuitPlayground.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting CircuitPlayground");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("CircuitPlayground started");
    }

    if (!crickit.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting crickit");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("Crickit started");
    }

    // Set up the pins to read the motor encoders
    pinMode(LEFT_ENCODER_PIN, INPUT_PULLUP);
    pinMode(RIGHT_ENCODER_PIN, INPUT_PULLUP);
    attachInterrupt(LEFT_ENCODER_PIN, handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(RIGHT_ENCODER_PIN, handleRightEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(CRICKIT_MOTOR_A1, motorPwmFreq);
    crickit.setPWMFreq(CRICKIT_MOTOR_A2, motorPwmFreq);
    crickit.setPWMFreq(CRICKIT_MOTOR_B1, motorPwmFreq);
    crickit.setPWMFreq(CRICKIT_MOTOR_B2, motorPwmFreq);

    // Attach the motors
    leftMotor.attachMotor(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    rightMotor.attachMotor(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    // Set starting throttle values
    leftMotor.setThrottle(minThrottle);
    rightMotor.setThrottle(minThrottle);
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
}

void handleRightEncoderInterrupt()
{
    rightMotor.incrementEncoderCount();
}

void loop()
{
    switch(moveState) {
    case Weavly::Robot::MoveState::notMoving:
        if (CircuitPlayground.rightButton()) {
            // Schedule the move
            moveState = Weavly::Robot::MoveState::moveRequested;
            startMoveTime = millis() + moveDelay;
        }
        break;
    case Weavly::Robot::MoveState::moveRequested:
        if (millis() > startMoveTime) {
            // Reset the encoder counts and start moving
            leftMotor.setEncoderCount(0);
            rightMotor.setEncoderCount(0);
            leftMotor.setAdjustmentEncoderCount(0);
            rightMotor.setAdjustmentEncoderCount(0);
            leftMotor.forward();
            rightMotor.forward();
            moveState = Weavly::Robot::MoveState::moving;
        }
        break;
    case Weavly::Robot::MoveState::moving:
        if (leftMotor.getEncoderCount() > numEncoderCountToMove) {
            // Stop moving
            leftMotor.off();
            rightMotor.off();
            moveState = Weavly::Robot::MoveState::notMoving;
        } else {
            adjustMotors();
        }
        break;
    }
}

void adjustMotors()
{
    if (leftMotor.getAdjustmentEncoderCount() > 100) {
        if (leftMotor.getAdjustmentEncoderCount() > rightMotor.getAdjustmentEncoderCount()) {
            // Can we slow the left motor down?
            if (leftMotor.getThrottle() - 0.01 >= minThrottle) {
                leftMotor.setThrottle(leftMotor.getThrottle() - 0.01);
            } else {
                // Speed the right motor up
                rightMotor.setThrottle(rightMotor.getThrottle() + 0.01);
            }
        } else if (rightMotor.getAdjustmentEncoderCount() > leftMotor.getAdjustmentEncoderCount()) {
            // Can we slow the right motor down?
            if (rightMotor.getThrottle() - 0.01 >= minThrottle) {
                rightMotor.setThrottle(rightMotor.getThrottle() - 0.01);
            } else {
                // Speed the left motor up
                leftMotor.setThrottle(leftMotor.getThrottle() + 0.01);
            }
        }
        printMotorState();
        leftMotor.setAdjustmentEncoderCount(0);
        rightMotor.setAdjustmentEncoderCount(0);
    }
}

void printMotorState()
{
    WEAVLY_ROBOT_PRINT("Left adjustment encoder count: ");
    WEAVLY_ROBOT_PRINTLN(leftMotor.getAdjustmentEncoderCount());
    WEAVLY_ROBOT_PRINT("Right adjustment encoder count: ");
    WEAVLY_ROBOT_PRINTLN(rightMotor.getAdjustmentEncoderCount());
    WEAVLY_ROBOT_PRINT("Left throttle: ");
    WEAVLY_ROBOT_PRINTLN(leftMotor.getThrottle());
    WEAVLY_ROBOT_PRINT("Right throttle: ");
    WEAVLY_ROBOT_PRINTLN(rightMotor.getThrottle());
}
