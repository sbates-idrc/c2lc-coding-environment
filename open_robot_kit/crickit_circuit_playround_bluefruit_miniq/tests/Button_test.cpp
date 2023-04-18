#include "../robot/Button.h"
#include "mock_arduino.h"
#include <catch2/catch_test_macros.hpp>

TEST_CASE("isPressed() returns true when the pin value changes from 0 to 1")
{
    Weavly::Robot::Button b(0, 200);
    Weavly::Robot::Test::setNextMillis(1000);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1001);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE(b.isPressed());
}

TEST_CASE("isPressed() returns false when the pin stays at 1")
{
    Weavly::Robot::Button b(0, 200);
    Weavly::Robot::Test::setNextMillis(1000);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1001);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1300);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE_FALSE(b.isPressed());
}

TEST_CASE("isPressed() returns false within the debounce period")
{
    Weavly::Robot::Button b(0, 200);
    Weavly::Robot::Test::setNextMillis(1000);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1001);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1100);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1101);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE_FALSE(b.isPressed());
}

TEST_CASE("isPressed() returns true when the pin value changes from 0 to 1 after the debounce period")
{
    Weavly::Robot::Button b(0, 200);
    Weavly::Robot::Test::setNextMillis(1000);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1001);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1300);
    Weavly::Robot::Test::setNextDigitalRead(0);
    REQUIRE_FALSE(b.isPressed());
    Weavly::Robot::Test::setNextMillis(1301);
    Weavly::Robot::Test::setNextDigitalRead(1);
    REQUIRE(b.isPressed());
}
