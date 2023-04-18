#ifndef WEAVLY_ROBOT_MOCK_ARDUINO_H
#define WEAVLY_ROBOT_MOCK_ARDUINO_H

namespace Weavly::Robot::Test {
void setNextDigitalRead(int value);
void setNextMillis(unsigned long value);
}

int digitalRead(int pin);
unsigned long millis();

#endif
