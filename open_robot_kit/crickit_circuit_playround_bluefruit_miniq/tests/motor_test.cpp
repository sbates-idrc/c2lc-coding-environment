#include "../robot/motor.h"
#include "mock_Adafruit_Crickit.h"
#include <catch2/catch_test_macros.hpp>

TEST_CASE("Motor::throttle")
{
    Adafruit_Crickit crickit;
    Weavly::Robot::Motor motor(crickit);

    motor.attach(0, 1);

    // Initial values
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(0);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(-1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(-0.25);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0xC000);

    motor.throttle(0.25);
    REQUIRE(crickit.lastPin0Val == 0xC000);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    motor.throttle(1);
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);

    // Out of range protection

    motor.throttle(-2.1);
    REQUIRE(crickit.lastPin0Val == 0xFFFF);
    REQUIRE(crickit.lastPin1Val == 0);

    motor.throttle(2.1);
    REQUIRE(crickit.lastPin0Val == 0);
    REQUIRE(crickit.lastPin1Val == 0xFFFF);
}

TEST_CASE("MotorMovement::getThrottle")
{
    Weavly::Robot::MotorMovement movement;
    movement.startTimeMs = 100;
    movement.rampUpTimeMs = 500;
    movement.throttle = 0.75;
    movement.rampDownEncoderCount = 1100;
    movement.encoderCountGoal = 1500;
    movement.endThrottle = 0.25;

    // Before the motor starts
    REQUIRE(movement.getThrottle(0, 0) == 0);

    // Ramp up phase
    REQUIRE(movement.getThrottle(100, 0) == 0);
    REQUIRE(movement.getThrottle(350, 0) == 0.375);
    REQUIRE(movement.getThrottle(600, 0) == 0.75);

    // Full throttle phase
    REQUIRE(movement.getThrottle(601, 0) == 0.75);
    REQUIRE(movement.getThrottle(601, 1100) == 0.75);

    // Ramp down phase
    REQUIRE(movement.getThrottle(601, 1300) == 0.5);
    REQUIRE(movement.getThrottle(601, 1500) == 0.25);

    // After the encoder count goal has been reached
    REQUIRE(movement.getThrottle(601, 1501) == 0);
}
