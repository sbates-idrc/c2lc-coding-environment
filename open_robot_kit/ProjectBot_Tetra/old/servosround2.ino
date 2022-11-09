/*
  LED

  This example creates a BLE peripheral with service that contains a
  characteristic to control an LED.

  The circuit:
  - Arduino MKR WiFi 1010, Arduino Uno WiFi Rev2 board, Arduino Nano 33 IoT,
    Arduino Nano 33 BLE, or Arduino Nano 33 BLE Sense board.

  You can use a generic BLE central app, like LightBlue (iOS and Android) or
  nRF Connect (Android), to interact with the services and characteristics
  created in this sketch.

  This example code is in the public domain.
*/

#include <ArduinoBLE.h>
#include <Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;
Servo servo4;

BLEService ledService("19B10000-E8F2-537E-4F6C-D104768A1214"); // BLE LED Service

// BLE LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEByteCharacteristic switchCharacteristic2("19B10002-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEByteCharacteristic switchCharacteristic3("19B10003-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEByteCharacteristic switchCharacteristic4("19B10004-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEByteCharacteristic switchCharacteristic5("19B10005-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);

const int ledPin = 5;

void setup() {
  servo1.attach(8);
  servo2.attach(2);
  servo3.attach(3);
  servo4.attach(4);
  Serial.begin(9600);
  while (!Serial);
  // set LED pin to output mode
  pinMode(ledPin, OUTPUT);

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("LED");
  BLE.setAdvertisedService(ledService);

  // add the characteristic to the service
  ledService.addCharacteristic(switchCharacteristic);
  ledService.addCharacteristic(switchCharacteristic2);
  ledService.addCharacteristic(switchCharacteristic3);
  ledService.addCharacteristic(switchCharacteristic4);
  ledService.addCharacteristic(switchCharacteristic5);

  // add service
  BLE.addService(ledService);

  // set the initial value for the characeristic:
  switchCharacteristic.writeValue(0);
  switchCharacteristic2.writeValue(0);
  switchCharacteristic3.writeValue(0);
  switchCharacteristic4.writeValue(0);
  switchCharacteristic5.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("BLE LED Peripheral");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      if (switchCharacteristic5.written())  {
        if (switchCharacteristic.value() && switchCharacteristic2.value()&& switchCharacteristic3.value()&& switchCharacteristic4.value()) {   // any value other than 0
          Serial.println("LED on");
          servo1.write(180);
          servo2.write(180);
          servo3.write(180);
          servo4.write(180);
        } 
        else if (switchCharacteristic.value() && switchCharacteristic4.value()){
          servo1.write(180);
          servo4.write(180);
          servo2.write(90);
          servo3.write(90);
        }
        else if (switchCharacteristic2.value() && switchCharacteristic3.value()){
          servo2.write(180);
          servo3.write(180);
          servo1.write(90);
          servo4.write(90);
        }
      }
  else {                              // a 0 value
    Serial.println(F("LED off"));
    servo1.write(90);
    servo2.write(90);
    servo3.write(90);
    servo4.write(90);
        }
      }
    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
    }
  }
