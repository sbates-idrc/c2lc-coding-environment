// This example drives a single 28BYJ-48 stepper motor with an Adafruit
// Crickit and Circuit Playground Bluefruit.
//
// Wiring (order right to left, when the word "Motor" on the Crickit is
// reading horizontally; that is: Motor 1, GND, Motor 2):
//
// - Orange
// - Pink
// - Red
// - Yellow
// - Blue
//
// As in this diagram:
// https://learn.adafruit.com/assets/57247
// On:
// https://learn.adafruit.com/adafruit-crickit-creative-robotic-interactive-construction-kit/circuitpython-steppers
//

#include <Adafruit_Crickit.h>

#define WEAVLY_ROBOT_DEBUG

#ifdef WEAVLY_ROBOT_DEBUG
    #define WEAVLY_ROBOT_PRINT(x) Serial.print(x);
    #define WEAVLY_ROBOT_PRINTLN(x) Serial.println(x);
#else
    #define WEAVLY_ROBOT_PRINT(x) ;
    #define WEAVLY_ROBOT_PRINTLN(x) ;
#endif

const int stepDelayMs = 25;

Adafruit_Crickit crickit;

void setup()
{
#ifdef WEAVLY_ROBOT_DEBUG
    Serial.begin(115200);
    while (!Serial) {
        delay(10);
    }
#endif

    if (!crickit.begin()) {
        WEAVLY_ROBOT_PRINTLN("Starting crickit failed");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("Crickit started");
    }
}

void loop()
{
    crickit.analogWrite(CRICKIT_MOTOR_A1, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_A2, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_B1, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_B2, 0x0000);

    delay(stepDelayMs);

    crickit.analogWrite(CRICKIT_MOTOR_A1, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_A2, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_B1, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_B2, 0xFFFF);

    delay(stepDelayMs);

    crickit.analogWrite(CRICKIT_MOTOR_A1, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_A2, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_B1, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_B2, 0xFFFF);

    delay(stepDelayMs);

    crickit.analogWrite(CRICKIT_MOTOR_A1, 0x0000);
    crickit.analogWrite(CRICKIT_MOTOR_A2, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_B1, 0xFFFF);
    crickit.analogWrite(CRICKIT_MOTOR_B2, 0x0000);

    delay(stepDelayMs);
}
