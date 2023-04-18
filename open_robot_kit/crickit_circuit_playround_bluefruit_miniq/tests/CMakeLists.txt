cmake_minimum_required(VERSION 3.22)

project(open_robot_kit)

set(CMAKE_CXX_STANDARD 17)

Include(FetchContent)

FetchContent_Declare(Catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG 3f0283de7a9c43200033da996ff9093be3ac84dc # v3.3.2
)

FetchContent_MakeAvailable(Catch2)

add_executable(tests
    ../robot/Button.cpp
    ../robot/Motor.cpp
    ../robot/MotorMovement.cpp
    ../robot/weavly_math.cpp
    mock_Adafruit_Crickit.cpp
    mock_arduino.cpp
    Button_test.cpp
    Motor_test.cpp
    MotorMovement_test.cpp
    weavly_math_test.cpp
)

target_compile_definitions(tests PRIVATE WEAVLY_ROBOT_TEST_BUILD)

target_compile_options(tests
    PRIVATE
    -Wall -Wextra -Wpedantic -Werror
)

target_link_libraries(tests Catch2::Catch2WithMain)
