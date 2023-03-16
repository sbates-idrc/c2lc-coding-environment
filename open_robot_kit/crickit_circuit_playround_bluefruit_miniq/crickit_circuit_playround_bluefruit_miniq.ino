#include <bluefruit.h>
#include <Adafruit_Circuit_Playground.h>
#include <Adafruit_Crickit.h>
#include <seesaw_motor.h>

//#define WEAVLY_ROBOT_DEBUG

#ifdef WEAVLY_ROBOT_DEBUG
    #define WEAVLY_ROBOT_PRINT(x) Serial.print(x);
    #define WEAVLY_ROBOT_PRINTLN(x) Serial.println(x);
#else
    #define WEAVLY_ROBOT_PRINT(x) ;
    #define WEAVLY_ROBOT_PRINTLN(x) ;
#endif

// Pins

const int leftEncoderPin = A2;
const int rightEncoderPin = A3;

// Pause time at end of movement

const unsigned long pauseTimeMs = 600;

// Classes

namespace Weavly::Robot {

enum class State {
    waiting,
    pauseAtEndOfMovement,
    forward,
    left,
    right
};

class Motor {
public:
    Motor(Adafruit_Crickit& crickit)
        : m_crickit(crickit),
        m_motorPinA(-1),
        m_motorPinB(-1),
        m_encoderCount(0)
    {
    }

    void attach(int pinA, int pinB)
    {
        m_motorPinA = pinA;
        m_motorPinB = pinB;
    }

    void throttle(float value)
    {
        if (m_motorPinA < 0 || m_motorPinB < 0) {
            return;
        }

        value = constrain(value, -1.0, 1.0);

        // Operate the motor in 'slow decay mode'

        uint16_t absolute = fabs(value) * 0xFFFF;

        if (value < 0) {
            m_crickit.analogWrite(m_motorPinA, 0xFFFF);
            m_crickit.analogWrite(m_motorPinB, 0xFFFF - absolute);
        } else {
            m_crickit.analogWrite(m_motorPinA, 0xFFFF - absolute);
            m_crickit.analogWrite(m_motorPinB, 0xFFFF);
        }
    }

    int getEncoderCount()
    {
        return m_encoderCount;
    }

    void setEncoderCount(int count)
    {
        m_encoderCount = count;
    }

    void incrementEncoderCount()
    {
        ++m_encoderCount;
    }

private:
    Adafruit_Crickit& m_crickit;
    int m_motorPinA;
    int m_motorPinB;
    int m_encoderCount;
};

}

// Weavly robot protocol

const char robotServiceUuid[] = "19B10000-E8F2-537E-4F6C-D104768A1214";
const char commandCharacteristicUuid[] = "19B10001-E8F2-537E-4F6C-D104768A1214";
const char notificationCharacteristicUuid[] = "19B10002-E8F2-537E-4F6C-D104768A1214";

const uint8_t commandForward = 1;
const uint8_t commandLeft = 3;
const uint8_t commandRight = 2;

const uint8_t notificationCommandFinished = 2;

// Globals

const char name[] = "WeavlyRobot";

BLEService robotService(robotServiceUuid);
BLECharacteristic commandCharacteristic(commandCharacteristicUuid);
BLECharacteristic notificationCharacteristic(notificationCharacteristicUuid);

Adafruit_Crickit crickit;

Weavly::Robot::Motor leftMotor(crickit);
Weavly::Robot::Motor rightMotor(crickit);

Weavly::Robot::State state = Weavly::Robot::State::waiting;
unsigned long startOfMovementTime = 0;
unsigned long endOfPauseTime = 0;

void setup()
{
#ifdef WEAVLY_ROBOT_DEBUG
    Serial.begin(115200);
    while (!Serial) {
        delay(10);
    }
#endif

    if (!CircuitPlayground.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting CircuitPlayground");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("CircuitPlayground started");
    }

    if (!crickit.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting crickit");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("Crickit started");
    }

    // Set up pins to read the motor encoders
    pinMode(leftEncoderPin, INPUT_PULLUP);
    pinMode(rightEncoderPin, INPUT_PULLUP);
    attachInterrupt(leftEncoderPin, handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(rightEncoderPin, handleRightEncoderInterrupt, FALLING);

    // Set PWM frequencies for the motor pins
    crickit.setPWMFreq(CRICKIT_MOTOR_A1, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_A2, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_B1, 30);
    crickit.setPWMFreq(CRICKIT_MOTOR_B2, 30);

    // Attach the motors
    leftMotor.attach(CRICKIT_MOTOR_A1, CRICKIT_MOTOR_A2);
    rightMotor.attach(CRICKIT_MOTOR_B1, CRICKIT_MOTOR_B2);

    setupBluetooth();

    WEAVLY_ROBOT_PRINTLN("Robot ready");
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
}

void handleRightEncoderInterrupt()
{
    rightMotor.incrementEncoderCount();
}

void setupBluetooth()
{
    if (!Bluefruit.begin()) {
        WEAVLY_ROBOT_PRINTLN("Error starting Bluefruit");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("Bluefruit started");
    }

    Bluefruit.setTxPower(4);

    Bluefruit.setName(name);
    WEAVLY_ROBOT_PRINT("Set name: ");
    WEAVLY_ROBOT_PRINTLN(name);

    Bluefruit.Periph.setConnectCallback(connectCallback);
    Bluefruit.Periph.setDisconnectCallback(disconnectCallback);

    if (robotService.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting robotService");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("robotService started");
    }

    commandCharacteristic.setProperties(CHR_PROPS_WRITE);
    commandCharacteristic.setPermission(SECMODE_NO_ACCESS, SECMODE_OPEN);
    commandCharacteristic.setFixedLen(1);
    commandCharacteristic.setWriteCallback(commandCallback);

    if (commandCharacteristic.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting commandCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("commandCharacteristic started");
    }

    notificationCharacteristic.setProperties(CHR_PROPS_NOTIFY);
    notificationCharacteristic.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
    notificationCharacteristic.setFixedLen(1);

    if (notificationCharacteristic.begin() != ERROR_NONE) {
        WEAVLY_ROBOT_PRINTLN("Error starting notificationCharacteristic");
        while (1) {
            delay(10);
        }
    } else {
        WEAVLY_ROBOT_PRINTLN("notificationCharacteristic started");
    }

    startAdvertising();
}

void startAdvertising()
{
    Bluefruit.Advertising.addService(robotService);
    Bluefruit.Advertising.addName();
    Bluefruit.Advertising.start(0);
    WEAVLY_ROBOT_PRINTLN("Advertising started");
}

void connectCallback(uint16_t conn_handle)
{
    WEAVLY_ROBOT_PRINTLN("Connected");
}

void disconnectCallback(uint16_t conn_handle, uint8_t reason)
{
    WEAVLY_ROBOT_PRINTLN("Disconnected");
}

void commandCallback(uint16_t conn_hdl, BLECharacteristic* chr, uint8_t* data, uint16_t len)
{
    WEAVLY_ROBOT_PRINTLN("Command received");

    if (state == Weavly::Robot::State::waiting && len == 1) {
        switch(data[0]) {
        case commandForward:
            WEAVLY_ROBOT_PRINTLN("Forward");
            beginMovement(Weavly::Robot::State::forward);
            break;
        case commandLeft:
            WEAVLY_ROBOT_PRINTLN("Left");
            beginMovement(Weavly::Robot::State::left);
            break;
        case commandRight:
            WEAVLY_ROBOT_PRINTLN("Right");
            beginMovement(Weavly::Robot::State::right);
            break;
        }
    }
}

void beginMovement(Weavly::Robot::State newState)
{
    state = newState;
    startOfMovementTime = millis();
    leftMotor.setEncoderCount(0);
    rightMotor.setEncoderCount(0);
}

void loop()
{
    switch(state) {
    case Weavly::Robot::State::pauseAtEndOfMovement:
        if (millis() > endOfPauseTime) {
            state = Weavly::Robot::State::waiting;
            printEncoderCounts();
            notificationCharacteristic.notify8(notificationCommandFinished);
        }
        break;
    case Weavly::Robot::State::forward:
        if (runMotors(400, 1, 1, 3600, 3600, 4000, 4000, 0.25, 0.25)) {
            WEAVLY_ROBOT_PRINTLN("Forward done");
            state = Weavly::Robot::State::pauseAtEndOfMovement;
            endOfPauseTime = millis() + pauseTimeMs;
        }
        break;
    case Weavly::Robot::State::left:
        if (runMotors(400, -1, 1, 1100, 1100, 1340, 1340, -0.25, 0.25)) {
            WEAVLY_ROBOT_PRINTLN("Left done");
            state = Weavly::Robot::State::pauseAtEndOfMovement;
            endOfPauseTime = millis() + pauseTimeMs;
        }
        break;
    case Weavly::Robot::State::right:
        if (runMotors(400, 1, -1, 1100, 1100, 1340, 1340, 0.25, -0.25)) {
            WEAVLY_ROBOT_PRINTLN("Right done");
            state = Weavly::Robot::State::pauseAtEndOfMovement;
            endOfPauseTime = millis() + pauseTimeMs;
        }
        break;
    }
}

bool runMotors(unsigned long rampUpTimeMs,
        float leftThrottle,
        float rightThrottle,
        int leftRampDownEncoder,
        int rightRampDownEncoder,
        int leftEncoderGoal,
        int rightEncoderGoal,
        float leftEndThrottle,
        float rightEndThrottle)
{
    bool leftDone = runMotor(
        leftMotor,
        rampUpTimeMs,
        leftThrottle,
        leftRampDownEncoder,
        leftEncoderGoal,
        leftEndThrottle);
    bool rightDone = runMotor(
        rightMotor,
        rampUpTimeMs,
        rightThrottle,
        rightRampDownEncoder,
        rightEncoderGoal,
        rightEndThrottle);
    return leftDone && rightDone;
}

bool runMotor(Weavly::Robot::Motor& motor,
        unsigned long rampUpTimeMs,
        float throttle,
        int rampDownEncoder,
        int encoderGoal,
        float endThrottle)
{
    bool done = false;

    if (motor.getEncoderCount() >= encoderGoal) {
        // We have reached the encoder goal, turn the motor off
        done = true;
        motor.throttle(0);
    } else {
        unsigned long now = millis();
        if (now > startOfMovementTime && now < startOfMovementTime + rampUpTimeMs) {
            // We are in the ramp up phase
            motor.throttle((throttle * (now - startOfMovementTime)) / rampUpTimeMs);
        } else if (motor.getEncoderCount() > rampDownEncoder) {
            // We are in the ramp down phase
            motor.throttle(
                throttle +
                ((endThrottle - throttle) * (motor.getEncoderCount() - rampDownEncoder)) /
                (encoderGoal - rampDownEncoder));
        } else {
            motor.throttle(throttle);
        }
    }

    return done;
}

void printEncoderCounts()
{
    WEAVLY_ROBOT_PRINT("Left: ");
    WEAVLY_ROBOT_PRINTLN(leftMotor.getEncoderCount());
    WEAVLY_ROBOT_PRINT("Right: ");
    WEAVLY_ROBOT_PRINTLN(rightMotor.getEncoderCount());
}
