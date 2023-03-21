# Adafruit CRICKIT with Circuit Playround Bluefruit and DFRobot miniQ chassis

## Parts

- DFRobot 2WD miniQ chassis ROB0049
  - <https://www.dfrobot.com/product-367.html>
- DFRobot Geared motor w/Encoder 6V 41RPM 380:1 FIT0487
  - <https://www.dfrobot.com/product-1437.html>
- Nylon M3 standoffs, for attaching the CRICKIT to the chassis
  - 3 x 30 mm standoffs
  - 6 x washers
  - 3 x bolts
  - 3 x screws

## Tools

- Phillips-head screwdriver size PH1, for attaching the motors and caster
  wheels to the chassis
- Phillips-head screwdriver size PH00, for the DC motor terminals on the
  CRICKIT
- 26 AWG Wire strippers

## Running the tests

```text
cd tests
vagrant up
vagrant ssh
mkdir build
cd build
cmake -G Ninja /open_robot_kit/tests
ninja
./tests
```
