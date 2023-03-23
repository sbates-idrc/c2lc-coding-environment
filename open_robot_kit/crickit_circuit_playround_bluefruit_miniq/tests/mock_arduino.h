#ifndef WEAVLY_ROBOT_MOCK_ARDUINO_H
#define WEAVLY_ROBOT_MOCK_ARDUINO_H

namespace Weavly::Robot::Test {
void setNextMillis(unsigned long value);
}

unsigned long millis();

#endif
