#include "../robot/Motor.h"
#include "mock_Adafruit_Crickit.h"
#include "mock_arduino.h"
#include <catch2/catch_test_macros.hpp>

TEST_CASE("Motor::throttle")
{
    Adafruit_Crickit crickit;
    Weavly::Robot::Motor motor(crickit, 1.0, 0.25);

    motor.attach(0, 1);

    // Initial values
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(0);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(1);
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(0.25);
    REQUIRE(crickit.lastPin0Val == 0xC000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-0.25);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xC000);

    // Out of range protection

    motor.throttle(-2.1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(2.1);
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    // Minimum throttle

    motor.throttle(0.1);
    REQUIRE(crickit.lastPin0Val == 0xC000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-0.1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xC000);

    // Set throttleFactor to 0.75

    motor.setThrottleFactor(0.75);

    // Now the throttle value should be multiplied by this factor

    motor.throttle(0);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(1);
    REQUIRE(crickit.lastPin0Val == 0x4000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0x4000);

    // And the minimum is not affected by the throttleFactor

    motor.throttle(0.25);
    REQUIRE(crickit.lastPin0Val == 0xC000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-0.25);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xC000);

    motor.throttle(0.1);
    REQUIRE(crickit.lastPin0Val == 0xC000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-0.1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xC000);
}
