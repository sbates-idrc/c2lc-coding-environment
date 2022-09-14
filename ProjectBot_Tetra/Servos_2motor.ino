
#include <ArduinoBLE.h>
#include <Servo.h>

Servo servo1;
Servo servo2;

BLEService servoService("19B10000-E8F2-537E-4F6C-D104768A1214"); // BLE LED Service

// BLE LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite | BLENotify);
BLEByteCharacteristic switchCharacteristic2("19B10002-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite | BLENotify);

//const int ledPin = 9; // pin to use for the LED

void setup() {
pinMode(9,OUTPUT);
pinMode(10,OUTPUT);
digitalWrite(9,LOW);
digitalWrite(10,LOW);
servo1.attach(9);
servo1.write(89);
servo2.attach(10);
servo2.write(86);


Serial.begin(9600);
  while (!Serial);

  // set LED pin to output mode
  //pinMode(ledPin, OUTPUT);

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("LED");
  BLE.setAdvertisedService(servoService);

  // add the characteristic to the service
  servoService.addCharacteristic(switchCharacteristic);
  servoService.addCharacteristic(switchCharacteristic2);

  // add service
  BLE.addService(servoService);

  // set the initial value for the characeristic:
  switchCharacteristic.writeValue(0);
  switchCharacteristic2.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("BLE LED Peripheral");
}

void loop() {
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
    // while the central is still connected to peripheral:
    while (central.connected()) {
      //Serial.println("In loop");
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      int code_speed;
      //if (switchCharacteristic2.written()){
        //if (switchCharacteristic2.value()== 1){
          //code_speed = 250;
      //}
        //else if (switchCharacteristic2.value()== 2){
          //code_speed = 400;
      //}
         //else if (switchCharacteristic2.value()== 4){
          //code_speed = 900;
      //}
         //else if (switchCharacteristic2.value()== 6){
          //code_speed = 1400;
      //}
         //else if (switchCharacteristic2.value()== 5){
          //code_speed = 1900;
      //}

     //}
      if (switchCharacteristic.written()) {
        Serial.println(switchCharacteristic2.value());
        // The line below should be at the end of each command for the queue or any sync to work
        switchCharacteristic2.writeValue((byte)0x01);
        Serial.println(switchCharacteristic2.value());
        // The line below was where I was seeing 0x00 is read as 128
        Serial.println(switchCharacteristic.value());
          if (switchCharacteristic.value() == 1){
            Serial.println("LED on");
            servo1.write(-180);
            servo2.write(180);
            delay(code_speed);
            servo1.write(89);
            servo2.write(86);
            Serial.println("I wrote a 1");
          }
          else if (switchCharacteristic.value() == 2){
            Serial.println("LED on");
            servo1.write(180);
            servo2.write(180);
            delay(code_speed);
            servo1.write(89);
            servo2.write(86);
            Serial.println("I wrote a 2");
          }
          else if (switchCharacteristic.value() == 3){
            Serial.println(F("LED off"));
            servo1.write(-180);
            servo2.write(-180);
            delay(code_speed);
            servo1.write(89);
            servo2.write(86);
            Serial.println("I wrote a 3");
          }
            }
   }
    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }

}
