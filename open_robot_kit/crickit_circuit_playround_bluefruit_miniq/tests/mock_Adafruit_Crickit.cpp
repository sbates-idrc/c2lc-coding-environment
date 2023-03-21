#include "mock_Adafruit_Crickit.h"

void Adafruit_Crickit::analogWrite(uint8_t pin, uint16_t value)
{
    if (pin == 0) {
        lastPin0Val = value;
    } else if (pin == 1) {
        lastPin1Val = value;
    }
}
