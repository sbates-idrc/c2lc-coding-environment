#include <bluefruit.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

BLEService robotService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLECharacteristic commandCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214");
BLECharacteristic notificationCharacteristic("19B10002-E8F2-537E-4F6C-D104768A1214");

Adafruit_Crickit crickit;

seesaw_Motor motor_a(&crickit);
seesaw_Motor motor_b(&crickit);

void connect_callback(uint16_t conn_handle)
{
    (void) conn_handle;

    Serial.println("Connected");
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
    (void) conn_handle;
    (void) reason;
    
    Serial.println("Disconnected");
}

void command_callback(uint16_t conn_hdl, BLECharacteristic* chr, uint8_t* data, uint16_t len)
{
    (void) conn_hdl;
    (void) chr;

    Serial.println("Command received");

    if (len == 1) {
        if (data[0] == 0x01) {
            // Forward
            notificationCharacteristic.notify8(0x01);
            motor_a.throttle(0.3);
            motor_b.throttle(0.3);
            delay(800);
            motor_a.throttle(0);
            motor_b.throttle(0);
            notificationCharacteristic.notify8(0x02);
        } else if (data[0] == 0x03) {
            // Left
            notificationCharacteristic.notify8(0x01);
            motor_a.throttle(-0.3);
            motor_b.throttle(0.3);
            delay(472);
            motor_a.throttle(0);
            motor_b.throttle(0);
            notificationCharacteristic.notify8(0x02);
        } else if (data[0] == 0x02) {
            // Right
            notificationCharacteristic.notify8(0x01);
            motor_a.throttle(0.3);
            motor_b.throttle(-0.3);
            delay(472);
            motor_a.throttle(0);
            motor_b.throttle(0);
            notificationCharacteristic.notify8(0x02);
        }
    }

    Serial.println("Command completed");
}

void setup()
{
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }

    if (!crickit.begin()) {
        Serial.println("Error starting crickit");
        while (1) {
            delay(1);
        }
    } else {
        Serial.println("Crickit started");
    }

    // Attach motor a
    motor_a.attach(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);

    // Attach motor b
    motor_b.attach(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    Bluefruit.begin();
    Bluefruit.setTxPower(4);
    Bluefruit.Periph.setConnectCallback(connect_callback);
    Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

    robotService.begin();

    commandCharacteristic.setProperties(CHR_PROPS_WRITE);
    commandCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
    commandCharacteristic.setFixedLen(1);
    commandCharacteristic.setWriteCallback(command_callback);
    commandCharacteristic.begin();

    notificationCharacteristic.setProperties(CHR_PROPS_NOTIFY);
    notificationCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    notificationCharacteristic.setFixedLen(1);
    notificationCharacteristic.begin();

    Bluefruit.Advertising.addService(robotService);
    Bluefruit.Advertising.start(0);
}

void loop()
{
}
