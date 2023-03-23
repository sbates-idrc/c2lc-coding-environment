#include "../robot/Motor.h"
#include "mock_Adafruit_Crickit.h"
#include "mock_arduino.h"
#include <catch2/catch_test_macros.hpp>

TEST_CASE("Motor::throttle")
{
    Adafruit_Crickit crickit;
    Weavly::Robot::Motor motor(crickit, 100);

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

TEST_CASE("Motor::measureSpeed")
{
    Adafruit_Crickit crickit;
    Weavly::Robot::Motor motor(crickit, 100);

    // Set our starting millis value
    Weavly::Robot::Test::setNextMillis(2000);

    // Initial speed should be 0
    REQUIRE(motor.measureSpeed() == 0);

    // Increment the encoder and call measureSpeed before the sample period
    // has ended
    motor.incrementEncoderCount();
    Weavly::Robot::Test::setNextMillis(2050);
    REQUIRE(motor.measureSpeed() == 0);

    // Increment again and measure right at the end of the sample period
    motor.incrementEncoderCount();
    Weavly::Robot::Test::setNextMillis(2100);
    REQUIRE(motor.measureSpeed() == 20);

    // Check when measureSpeed is called after the sample period has ended
    motor.incrementEncoderCount();
    Weavly::Robot::Test::setNextMillis(2350);
    REQUIRE(motor.measureSpeed() == 4);

    // Check when the speed is below 1 per second
    motor.incrementEncoderCount();
    Weavly::Robot::Test::setNextMillis(6350);
    REQUIRE(motor.measureSpeed() == 0.25);
}
