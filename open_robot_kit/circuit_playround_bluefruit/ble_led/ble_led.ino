#include <bluefruit.h>

BLEService robotService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLECharacteristic commandCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214");
BLECharacteristic notificationCharacteristic("19B10002-E8F2-537E-4F6C-D104768A1214");

void connect_callback(uint16_t conn_handle)
{
    (void) conn_handle;

    Serial.println("Connect");
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
    (void) conn_handle;
    (void) reason;
    
    Serial.println("Disconnect");
}

void command_callback(uint16_t conn_hdl, BLECharacteristic* chr, uint8_t* data, uint16_t len)
{
    (void) conn_hdl;
    (void) chr;
    (void) len;

    Serial.println("Command received");

    notificationCharacteristic.notify8(0x01);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    notificationCharacteristic.notify8(0x02);

    Serial.println("Command completed");
}

void setup()
{
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }

    Serial.println("Hello World");

    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, LOW);

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
