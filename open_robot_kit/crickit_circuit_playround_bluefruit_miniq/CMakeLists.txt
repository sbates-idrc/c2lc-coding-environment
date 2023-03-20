cmake_minimum_required(VERSION 3.22)

project(open_robot_kit)

set(CMAKE_CXX_STANDARD 17)

Include(FetchContent)

FetchContent_Declare(Catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG v3.3.2)

FetchContent_MakeAvailable(Catch2)

add_executable(tests
    robot/motor.cpp
    tests/motor_test.cpp)

target_link_libraries(tests Catch2::Catch2WithMain)
