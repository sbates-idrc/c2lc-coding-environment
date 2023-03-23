static unsigned long nextMillisValue = 0;

namespace Weavly::Robot::Test {

void setNextMillis(unsigned long value)
{
    nextMillisValue = value;
}

}

unsigned long millis()
{
    return nextMillisValue;
}
