static unsigned int nextDigitalRead = 0;
static unsigned long nextMillisValue = 0;

namespace Weavly::Robot::Test {

void setNextDigitalRead(int value)
{
    nextDigitalRead = value;
}

void setNextMillis(unsigned long value)
{
    nextMillisValue = value;
}

}

int digitalRead(int pin)
{
    (void)pin;
    return nextDigitalRead;
}

unsigned long millis()
{
    return nextMillisValue;
}
