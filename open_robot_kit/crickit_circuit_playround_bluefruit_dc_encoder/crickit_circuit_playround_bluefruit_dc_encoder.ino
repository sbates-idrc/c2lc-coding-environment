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

#define LEFT_ENCODER_SIGNAL CRICKIT_SIGNAL1
#define RIGHT_ENCODER_SIGNAL CRICKIT_SIGNAL2

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

seesaw_Motor leftMotor(&crickit);
seesaw_Motor rightMotor(&crickit);

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

    // Configure the GPIO pins for reading the motor encoders
    crickit.pinMode(LEFT_ENCODER_SIGNAL, INPUT_PULLUP);
    crickit.pinMode(RIGHT_ENCODER_SIGNAL, INPUT_PULLUP);

    // Attach motors
    leftMotor.attach(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    rightMotor.attach(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    setupBluetooth();
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
            runMotors(0.6, 0.6, 120, 120);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandLeft) {
            runMotors(-0.6, 0.6, 50, 50);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandRight) {
            runMotors(0.6, -0.6, 50, 50);
            notificationCharacteristic.notify8(notificationCommandFinished);
        }
    }

    WEAVLY_ROBOT_PRINTLN("Command completed");
}

void runMotors(float leftThrottle, float rightThrottle, int leftCount, int rightCount)
{
    int leftEncoderCount = 0;
    int rightEncoderCount = 0;
    bool leftDone = false;
    bool rightDone = false;
    leftMotor.throttle(leftThrottle);
    rightMotor.throttle(rightThrottle);
    bool previousLeftEncoderVal = crickit.digitalRead(LEFT_ENCODER_SIGNAL);
    bool previousRightEncoderVal = crickit.digitalRead(RIGHT_ENCODER_SIGNAL);
    while (!leftDone || !rightDone) {
        bool leftEncoderVal = crickit.digitalRead(LEFT_ENCODER_SIGNAL);
        bool rightEncoderVal = crickit.digitalRead(RIGHT_ENCODER_SIGNAL);
        if (previousLeftEncoderVal && !leftEncoderVal) {
            ++leftEncoderCount;
        }
        if (previousRightEncoderVal && !rightEncoderVal) {
            ++rightEncoderCount;
        }
        previousLeftEncoderVal = leftEncoderVal;
        previousRightEncoderVal = rightEncoderVal;
        if (!leftDone && leftEncoderCount > leftCount) {
            leftMotor.throttle(0);
            leftDone = true;
        }
        if (!rightDone && rightEncoderCount > rightCount) {
            rightMotor.throttle(0);
            rightDone = true;
        }
    }
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
