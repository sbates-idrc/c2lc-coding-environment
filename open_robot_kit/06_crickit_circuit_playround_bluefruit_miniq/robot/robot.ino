#include "weavly_debug_print.h"
#include "RobotMotors.h"
#include <bluefruit.h>
#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

// Pins

const int leftEncoderPin = A2;
const int rightEncoderPin = A3;

// Constants

const float minThrottle = 0.25;
const unsigned long pauseTimeMs = 600;
const unsigned long speedSamplePeriodMs = 50;

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

Weavly::Robot::RobotMotors motors(crickit, minThrottle, pauseTimeMs, speedSamplePeriodMs);

unsigned long startOfMovementTimeMs = 0;

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
    pinMode(leftEncoderPin, INPUT_PULLUP);
    pinMode(rightEncoderPin, INPUT_PULLUP);
    attachInterrupt(leftEncoderPin, handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(rightEncoderPin, handleRightEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(CRICKIT_MOTOR_A1, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_A2, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_B1, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_B2, 30);

    // Attach the motors
    motors.attachLeftMotor(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    motors.attachRightMotor(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    motors.onMovementFinished(handleMovementFinished);

    setupBluetooth();

    WEAVLY_ROBOT_PRINTLN("Robot ready");
}

void handleLeftEncoderInterrupt()
{
    motors.incrementLeftEncoderCount();
}

void handleRightEncoderInterrupt()
{
    motors.incrementRightEncoderCount();
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

    if (motors.isWaiting() && len == 1) {
        switch(data[0]) {
        case commandForward:
            WEAVLY_ROBOT_PRINTLN("Forward");
            startOfMovementTimeMs = millis();
            motors.startMotors(400, 1, 1, 3600, 4000, 0.25, 0.25);
            break;
        case commandLeft:
            WEAVLY_ROBOT_PRINTLN("Left");
            startOfMovementTimeMs = millis();
            motors.startMotors(400, -1, 1, 1100, 1340, -0.25, 0.25);
            break;
        case commandRight:
            WEAVLY_ROBOT_PRINTLN("Right");
            startOfMovementTimeMs = millis();
            motors.startMotors(400, 1, -1, 1100, 1340, 0.25, -0.25);
            break;
        }
    }
}

void handleMovementFinished()
{
    WEAVLY_ROBOT_PRINT("Movement took: ");
    WEAVLY_ROBOT_PRINT(millis() - startOfMovementTimeMs);
    WEAVLY_ROBOT_PRINTLN(" ms");
    printEncoderCounts();
    notificationCharacteristic.notify8(notificationCommandFinished);
}

void printEncoderCounts()
{
    WEAVLY_ROBOT_PRINT("Left: ");
    WEAVLY_ROBOT_PRINTLN(motors.getLeftEncoderCount());
    WEAVLY_ROBOT_PRINT("Right: ");
    WEAVLY_ROBOT_PRINTLN(motors.getRightEncoderCount());
}

void loop()
{
    motors.updateMotors();
}
