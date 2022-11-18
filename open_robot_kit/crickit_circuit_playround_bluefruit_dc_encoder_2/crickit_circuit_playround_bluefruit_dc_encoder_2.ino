#include <bluefruit.h>
#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

//#define WEAVLY_ROBOT_DEBUG

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

// Weavly robot protocol

const char robotServiceUuid[] = "19B10000-E8F2-537E-4F6C-D104768A1214";
const char commandCharacteristicUuid[] = "19B10001-E8F2-537E-4F6C-D104768A1214";
const char notificationCharacteristicUuid[] = "19B10002-E8F2-537E-4F6C-D104768A1214";

const uint8_t commandForward = 1;
const uint8_t commandLeft = 3;
const uint8_t commandRight = 2;

const uint8_t notificationCommandFinished = 2;

// Globals

const char name[] = "WeavlyRobot";

BLEService robotService(robotServiceUuid);
BLECharacteristic commandCharacteristic(commandCharacteristicUuid);
BLECharacteristic notificationCharacteristic(notificationCharacteristicUuid);

Adafruit_Crickit crickit;

Weavly::Robot::MotorWithEncoder leftMotor(crickit);
Weavly::Robot::MotorWithEncoder rightMotor(crickit);

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

    // Set up pins to read the motor encoders
    pinMode(LEFT_ENCODER_PIN, INPUT_PULLUP);
    pinMode(RIGHT_ENCODER_PIN, INPUT_PULLUP);
    attachInterrupt(LEFT_ENCODER_PIN, handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(RIGHT_ENCODER_PIN, handleRightEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(CRICKIT_MOTOR_A1, 50);
    crickit.setPWMFreq(CRICKIT_MOTOR_A2, 50);
    crickit.setPWMFreq(CRICKIT_MOTOR_B1, 50);
    crickit.setPWMFreq(CRICKIT_MOTOR_B2, 50);

    // Attach the motors
    leftMotor.attachMotor(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    rightMotor.attachMotor(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    setupBluetooth();
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
}

void handleRightEncoderInterrupt()
{
    rightMotor.incrementEncoderCount();
}

void setupBluetooth()
{
    if (!Bluefruit.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting Bluefruit");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("Bluefruit started");
    }

    Bluefruit.setTxPower(4);

    Bluefruit.setName(name);
    WEAVLY_ROBOT_PRINT("Set name: ");
    WEAVLY_ROBOT_PRINTLN(name);

    Bluefruit.Periph.setConnectCallback(connectCallback);
    Bluefruit.Periph.setDisconnectCallback(disconnectCallback);

    if (robotService.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting robotService");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("robotService started");
    }

    commandCharacteristic.setProperties(CHR_PROPS_WRITE);
    commandCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
    commandCharacteristic.setFixedLen(1);
    commandCharacteristic.setWriteCallback(commandCallback);

    if (commandCharacteristic.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting commandCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("commandCharacteristic started");
    }

    notificationCharacteristic.setProperties(CHR_PROPS_NOTIFY);
    notificationCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    notificationCharacteristic.setFixedLen(1);

    if (notificationCharacteristic.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting notificationCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("notificationCharacteristic started");
    }

    startAdvertising();
}

void startAdvertising()
{
    Bluefruit.Advertising.addService(robotService);
    Bluefruit.Advertising.addName();
    Bluefruit.Advertising.start(0);
    WEAVLY_ROBOT_PRINTLN("Advertising started");
}

void connectCallback(uint16_t conn_handle)
{
    WEAVLY_ROBOT_PRINTLN("Connected");
}

void disconnectCallback(uint16_t conn_handle, uint8_t reason)
{
    WEAVLY_ROBOT_PRINTLN("Disconnected");
}

void commandCallback(uint16_t conn_hdl, BLECharacteristic* chr, uint8_t* data, uint16_t len)
{
    WEAVLY_ROBOT_PRINTLN("Command received");

    if (len == 1) {
        if (data[0] == commandForward) {
            runMotors(0.75, 0.75, 120, 120);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandLeft) {
            runMotors(-0.5, 0.5, 58, 58);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandRight) {
            runMotors(0.5, -0.5, 58, 58);
            notificationCharacteristic.notify8(notificationCommandFinished);
        }
    }

    WEAVLY_ROBOT_PRINTLN("Command completed");
}

void runMotors(float leftThrottle, float rightThrottle, int leftCount, int rightCount)
{
    leftMotor.setEncoderCount(0);
    rightMotor.setEncoderCount(0);
    bool leftDone = false;
    bool rightDone = false;
    leftMotor.throttle(leftThrottle);
    rightMotor.throttle(rightThrottle);
    while (!leftDone || !rightDone) {
        if (!leftDone && leftMotor.getEncoderCount() > leftCount) {
            leftMotor.throttle(0);
            leftDone = true;
        }
        if (!rightDone && rightMotor.getEncoderCount() > rightCount) {
            rightMotor.throttle(0);
            rightDone = true;
        }
        yield();
    }

    delay(500);
    WEAVLY_ROBOT_PRINT("Left encoder count: ");
    WEAVLY_ROBOT_PRINTLN(leftMotor.getEncoderCount());
    WEAVLY_ROBOT_PRINT("Right encoder count: ");
    WEAVLY_ROBOT_PRINTLN(rightMotor.getEncoderCount());
}

void loop()
{
    // logAccelerometer();
}

void logAccelerometer()
{
    WEAVLY_ROBOT_PRINT("motionX: ");
    WEAVLY_ROBOT_PRINT(CircuitPlayground.motionX());
    WEAVLY_ROBOT_PRINT(" motionY: ");
    WEAVLY_ROBOT_PRINT(CircuitPlayground.motionY());
    WEAVLY_ROBOT_PRINT(" motionZ: ");
    WEAVLY_ROBOT_PRINTLN(CircuitPlayground.motionZ());
}
