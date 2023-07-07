#include "../robot/weavly_math.h"
#include <catch2/catch_test_macros.hpp>

TEST_CASE("clamp")
{
    REQUIRE(Weavly::Robot::clamp(50, 100, 200) == 100);
    REQUIRE(Weavly::Robot::clamp(100, 100, 200) == 100);
    REQUIRE(Weavly::Robot::clamp(150, 100, 200) == 150);
    REQUIRE(Weavly::Robot::clamp(200, 100, 200) == 200);
    REQUIRE(Weavly::Robot::clamp(250, 100, 200) == 200);
}
