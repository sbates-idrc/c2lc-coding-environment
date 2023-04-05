#include <Arduino_LSM6DS3.h>

const float calibrationOffset = -3.77;

unsigned long lastUpdateTimeMs = 0;
unsigned long updatePeriodMs = 100;
float heading = 0;
float gyroscopeSampleRate = 1;

void setup()
{
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }

    if (!IMU.begin()) {
        Serial.println("Error starting IMU");
        while (1) {
            delay(10);
        }
    } else {
        Serial.println("IMU started");
    }

    gyroscopeSampleRate = IMU.gyroscopeSampleRate();

    Serial.println("Ready");
}

void loop()
{
    float x, y, z;

    if (IMU.gyroscopeAvailable()) {
        IMU.readGyroscope(x, y, z);
        z += calibrationOffset;
        heading += z / gyroscopeSampleRate;
    }

    unsigned long now = millis();

    if (now > lastUpdateTimeMs + updatePeriodMs) {
        Serial.println(heading);
        lastUpdateTimeMs = now;
    }
}
