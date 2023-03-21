#ifndef WEAVLY_ROBOT_MOCK_ADAFRUIT_CRICKIT_H
#define WEAVLY_ROBOT_MOCK_ADAFRUIT_CRICKIT_H

#include <cstdint>

class Adafruit_Crickit {
public:
    Adafruit_Crickit() : lastPin0Val(0), lastPin1Val(0) { }
    void analogWrite(uint8_t pin, uint16_t value);
    uint16_t lastPin0Val;
    uint16_t lastPin1Val;
};

#endif
