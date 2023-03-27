#include "../robot/MotorMovement.h"
#include <catch2/catch_test_macros.hpp>

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

TEST_CASE("MotorMovement::atFullThrottle")
{
    Weavly::Robot::MotorMovement movement;
    movement.startTimeMs = 100;
    movement.rampUpTimeMs = 500;
    movement.throttle = 0.75;
    movement.rampDownEncoderCount = 1100;
    movement.encoderCountGoal = 1500;
    movement.endThrottle = 0.25;

    // Before the motor starts
    REQUIRE_FALSE(movement.atFullThrottle(0, 0));

    // Ramp up phase
    REQUIRE_FALSE(movement.atFullThrottle(100, 0));
    REQUIRE_FALSE(movement.atFullThrottle(600, 0));

    // Full throttle phase
    REQUIRE(movement.atFullThrottle(601, 0));
    REQUIRE(movement.atFullThrottle(601, 1099));

    // Ramp down phase
    REQUIRE_FALSE(movement.atFullThrottle(601, 1100));

    // After the encoder count goal has been reached
    REQUIRE_FALSE(movement.atFullThrottle(601, 1501));
}
