#include <ArduinoBLE.h>

#define WEAVLY_ROBOT_DEBUG

#ifdef WEAVLY_ROBOT_DEBUG
    #define WEAVLY_ROBOT_PRINT(x) Serial.print(x);
    #define WEAVLY_ROBOT_PRINTLN(x) Serial.println(x);
#else
    #define WEAVLY_ROBOT_PRINT(x) ;
    #define WEAVLY_ROBOT_PRINTLN(x) ;
#endif

// Pins

int channelA_directionPin = 12;
int channelA_pwmPin = 3;
int channelA_brakePin = 9;

int channelB_directionPin = 13;
// The shield expects PWM on pin D11 but on the Arduino UNO WiFi Rev 2
// D11 does not support PWM. We use pin D10 instead and wire them together.
int channelB_pwmPin = 10;
int channelB_pwmPin_shield = 11;
int channelB_brakePin = 8;

int leftEncoderPin = 4;
int rightEncoderPin = 5;

// Classes

namespace Weavly::Robot {

enum class State {
    waiting,
    forward,
    left,
    right
};

enum class Direction {
    forward,
    backward
};

class Motor {
public:
    Motor()
        : m_motorDirectionPin(-1),
        m_motorPwmPin(-1),
        m_motorBrakePin(-1),
        m_encoderCount(0)
    {
    }

    void attach(int directionPin, int pwmPin, int brakePin)
    {
        m_motorDirectionPin = directionPin;
        m_motorPwmPin = pwmPin;
        m_motorBrakePin = brakePin;
    }

    void setDirection(Direction dir)
    {
        if (dir == Direction::forward) {
            digitalWrite(m_motorDirectionPin, LOW);
        } else {
            digitalWrite(m_motorDirectionPin, HIGH);
        }
    }

    void run(int value)
    {
        digitalWrite(m_motorBrakePin, LOW);
        analogWrite(m_motorPwmPin, value);
    }

    void brake()
    {
        digitalWrite(m_motorBrakePin, HIGH);
        analogWrite(m_motorPwmPin, 0);
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
    int m_motorDirectionPin;
    int m_motorPwmPin;
    int m_motorBrakePin;
    int m_encoderCount;
};

}

// Weavly robot protocol

const char robotServiceUuid[] = "19B10000-E8F2-537E-4F6C-D104768A1214";
const char commandCharacteristicUuid[] = "19B10001-E8F2-537E-4F6C-D104768A1214";
const char notificationCharacteristicUuid[] = "19B10002-E8F2-537E-4F6C-D104768A1214";

const byte commandForward = 1;
const byte commandLeft = 3;
const byte commandRight = 2;

const byte notificationCommandFinished = 2;

// Globals

const char name[] = "WeavlyRobot";

BLEService robotService(robotServiceUuid);
BLEByteCharacteristic commandCharacteristic(commandCharacteristicUuid, BLERead | BLEWrite | BLENotify);
BLEByteCharacteristic notificationCharacteristic(notificationCharacteristicUuid, BLERead | BLEWrite | BLENotify);

Weavly::Robot::Motor leftMotor;
Weavly::Robot::Motor rightMotor;

Weavly::Robot::State state = Weavly::Robot::State::waiting;

void setup()
{
#ifdef WEAVLY_ROBOT_DEBUG
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }
#endif

    if (!BLE.begin()) {
        WEAVLY_ROBOT_PRINTLN("Starting BLE failed");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("BLE started");
    }

    // Set up the motor pins
    pinMode(channelA_directionPin, OUTPUT);
    pinMode(channelA_pwmPin, OUTPUT);
    pinMode(channelA_brakePin, OUTPUT);
    pinMode(channelB_directionPin, OUTPUT);
    pinMode(channelB_pwmPin, OUTPUT);
    // The channelB_pwmPin_shield is physically wired to channelB_pwmPin.
    // Set it to INPUT to ensure that we don't set the voltage on both pins
    // at once.
    pinMode(channelB_pwmPin_shield, INPUT);
    pinMode(channelB_brakePin, OUTPUT);

    // Set up the encoder pins
    pinMode(leftEncoderPin, INPUT_PULLUP);
    pinMode(rightEncoderPin, INPUT_PULLUP);

    // Attach the motors
    leftMotor.attach(channelA_directionPin, channelA_pwmPin, channelA_brakePin);
    rightMotor.attach(channelB_directionPin, channelB_pwmPin, channelB_brakePin);

    // Attach the encoder interrupt handlers
    attachInterrupt(digitalPinToInterrupt(leftEncoderPin), handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(digitalPinToInterrupt(rightEncoderPin), handleRightEncoderInterrupt, FALLING);

    // Set local name and add advetising
    BLE.setLocalName(name);
    BLE.setAdvertisedService(robotService);

    // Add the characteristics to the service
    robotService.addCharacteristic(commandCharacteristic);
    robotService.addCharacteristic(notificationCharacteristic);

    // Add the service
    BLE.addService(robotService);

    // Set the initial value for the characeristics
    commandCharacteristic.writeValue(0);
    notificationCharacteristic.writeValue(0);

    // Start advertising
    BLE.advertise();

    WEAVLY_ROBOT_PRINTLN("Robot ready");
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
    // WEAVLY_ROBOT_PRINT("Left: ");
    // WEAVLY_ROBOT_PRINTLN(leftMotor.getEncoderCount());
}

void handleRightEncoderInterrupt()
{
    rightMotor.incrementEncoderCount();
    // WEAVLY_ROBOT_PRINT("Right: ");
    // WEAVLY_ROBOT_PRINTLN(rightMotor.getEncoderCount());
}

void loop()
{
    BLEDevice central = BLE.central();

    if (central) {
        WEAVLY_ROBOT_PRINTLN("Connected");

        while (central.connected()) {
            switch(state) {
            case Weavly::Robot::State::waiting:
                if (commandCharacteristic.written()) {
                    switch (commandCharacteristic.value()) {
                    case commandForward:
                        WEAVLY_ROBOT_PRINTLN("Forward");
                        state = Weavly::Robot::State::forward;
                        leftMotor.setEncoderCount(0);
                        rightMotor.setEncoderCount(0);
                        leftMotor.setDirection(Weavly::Robot::Direction::forward);
                        rightMotor.setDirection(Weavly::Robot::Direction::forward);
                        leftMotor.run(96);
                        rightMotor.run(96);
                        break;
                    case commandLeft:
                        WEAVLY_ROBOT_PRINTLN("Left");
                        state = Weavly::Robot::State::left;
                        leftMotor.setEncoderCount(0);
                        rightMotor.setEncoderCount(0);
                        rightMotor.setDirection(Weavly::Robot::Direction::forward);
                        rightMotor.run(96);
                        break;
                    case commandRight:
                        WEAVLY_ROBOT_PRINTLN("Right");
                        state = Weavly::Robot::State::right;
                        leftMotor.setEncoderCount(0);
                        rightMotor.setEncoderCount(0);
                        leftMotor.setDirection(Weavly::Robot::Direction::forward);
                        leftMotor.run(96);
                        break;
                    }
                }
                break;
            case Weavly::Robot::State::forward:
                {
                    bool leftDone = false;
                    bool rightDone = false;
                    if (leftMotor.getEncoderCount() >= 200) {
                        leftDone = true;
                        leftMotor.brake();
                    }
                    if (rightMotor.getEncoderCount() >= 200) {
                        rightDone = true;
                        rightMotor.brake();
                    }
                    if (leftDone && rightDone) {
                        WEAVLY_ROBOT_PRINTLN("Forward done");
                        printEncoderCounts();
                        notificationCharacteristic.writeValue(notificationCommandFinished);
                        state = Weavly::Robot::State::waiting;
                    }
                }
                break;
            case Weavly::Robot::State::left:
                if (rightMotor.getEncoderCount() >= 200) {
                    rightMotor.brake();
                    WEAVLY_ROBOT_PRINTLN("Left done");
                    printEncoderCounts();
                    notificationCharacteristic.writeValue(notificationCommandFinished);
                    state = Weavly::Robot::State::waiting;
                }
                break;
            case Weavly::Robot::State::right:
                if (leftMotor.getEncoderCount() >= 200) {
                    leftMotor.brake();
                    WEAVLY_ROBOT_PRINTLN("Right done");
                    printEncoderCounts();
                    notificationCharacteristic.writeValue(notificationCommandFinished);
                    state = Weavly::Robot::State::waiting;
                }
                break;
            }
        }

        WEAVLY_ROBOT_PRINTLN("Disconnected");
    }
}

void printEncoderCounts()
{
    WEAVLY_ROBOT_PRINT("Left: ");
    WEAVLY_ROBOT_PRINTLN(leftMotor.getEncoderCount());
    WEAVLY_ROBOT_PRINT("Right: ");
    WEAVLY_ROBOT_PRINTLN(rightMotor.getEncoderCount());

}
