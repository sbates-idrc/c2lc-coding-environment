#include <bluefruit.h>
#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

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

    // Attach motors
    leftMotor.attach(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    rightMotor.attach(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    setupBluetooth();
}

void setupBluetooth()
{
    if (!Bluefruit.begin()) {
        Serial.println("Error starting Bluefruit");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("Bluefruit started");
    }

    Bluefruit.setTxPower(4);

    Bluefruit.setName(name);
    Serial.print("Set name: ");
    Serial.println(name);

    Bluefruit.Periph.setConnectCallback(connectCallback);
    Bluefruit.Periph.setDisconnectCallback(disconnectCallback);

    if (robotService.begin() != ERROR_NONE) {
        Serial.println("Error starting robotService");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("robotService started");
    }

    commandCharacteristic.setProperties(CHR_PROPS_WRITE);
    commandCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
    commandCharacteristic.setFixedLen(1);
    commandCharacteristic.setWriteCallback(commandCallback);

    if (commandCharacteristic.begin() != ERROR_NONE) {
        Serial.println("Error starting commandCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("commandCharacteristic started");
    }

    notificationCharacteristic.setProperties(CHR_PROPS_NOTIFY);
    notificationCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    notificationCharacteristic.setFixedLen(1);

    if (notificationCharacteristic.begin() != ERROR_NONE) {
        Serial.println("Error starting notificationCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("notificationCharacteristic started");
    }

    startAdvertising();
}

void startAdvertising()
{
    Bluefruit.Advertising.addService(robotService);
    Bluefruit.Advertising.addName();
    Bluefruit.Advertising.start(0);
}

void connectCallback(uint16_t conn_handle)
{
    Serial.println("Connected");
}

void disconnectCallback(uint16_t conn_handle, uint8_t reason)
{
    Serial.println("Disconnected");
}

void commandCallback(uint16_t conn_hdl, BLECharacteristic* chr, uint8_t* data, uint16_t len)
{
    Serial.println("Command received");

    if (len == 1) {
        if (data[0] == commandForward) {
            leftMotor.throttle(0.3);
            rightMotor.throttle(0.3);
            delay(800);
            leftMotor.throttle(0);
            rightMotor.throttle(0);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandLeft) {
            leftMotor.throttle(-0.3);
            rightMotor.throttle(0.3);
            delay(472);
            leftMotor.throttle(0);
            rightMotor.throttle(0);
            notificationCharacteristic.notify8(notificationCommandFinished);
        } else if (data[0] == commandRight) {
            leftMotor.throttle(0.3);
            rightMotor.throttle(-0.3);
            delay(472);
            leftMotor.throttle(0);
            rightMotor.throttle(0);
            notificationCharacteristic.notify8(notificationCommandFinished);
        }
    }

    Serial.println("Command completed");
}

void loop()
{
    // logAccelerometer();
}

void logAccelerometer()
{
    Serial.print("motionX: ");
    Serial.print(CircuitPlayground.motionX());
    Serial.print(" motionY: ");
    Serial.print(CircuitPlayground.motionY());
    Serial.print(" motionZ: ");
    Serial.println(CircuitPlayground.motionZ());
}
