// Pins

const int channelA_directionPin = 12;
const int channelA_pwmPin = 3;
const int channelA_brakePin = 9;

const int channelB_directionPin = 13;
// The shield expects PWM on pin D11 but on the Arduino UNO WiFi Rev 2
// D11 does not support PWM. We use pin D10 instead and wire them together.
const int channelB_pwmPin = 10;
const int channelB_pwmPin_shield = 11;
const int channelB_brakePin = 8;

const int leftEncoderPin = 4;
const int rightEncoderPin = 5;

// Classes

namespace Weavly::Robot {

enum class Direction {
    forward,
    backward
};

class Motor {
public:
    Motor()
        : m_motorDirectionPin(-1),
        m_motorPwmPin(-1),
        m_motorBrakePin(-1),
        m_encoderCount(0)
    {
    }

    void attach(int directionPin, int pwmPin, int brakePin)
    {
        m_motorDirectionPin = directionPin;
        m_motorPwmPin = pwmPin;
        m_motorBrakePin = brakePin;
    }

    void setDirection(Direction dir)
    {
        if (dir == Direction::forward) {
            digitalWrite(m_motorDirectionPin, LOW);
        } else {
            digitalWrite(m_motorDirectionPin, HIGH);
        }
    }

    void run(int value)
    {
        digitalWrite(m_motorBrakePin, LOW);
        analogWrite(m_motorPwmPin, value);
    }

    void brake()
    {
        digitalWrite(m_motorBrakePin, HIGH);
        analogWrite(m_motorPwmPin, 0);
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
    int m_motorDirectionPin;
    int m_motorPwmPin;
    int m_motorBrakePin;
    int m_encoderCount;
};

}

// Globals

Weavly::Robot::Motor leftMotor;
Weavly::Robot::Motor rightMotor;

bool running = false;

void setup()
{
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }

    // Set up the motor pins
    pinMode(channelA_directionPin, OUTPUT);
    pinMode(channelA_pwmPin, OUTPUT);
    pinMode(channelA_brakePin, OUTPUT);
    pinMode(channelB_directionPin, OUTPUT);
    pinMode(channelB_pwmPin, OUTPUT);
    // The channelB_pwmPin_shield is physically wired to channelB_pwmPin.
    // Set it to INPUT to ensure that we don't set the voltage on both pins
    // at once.
    pinMode(channelB_pwmPin_shield, INPUT);
    pinMode(channelB_brakePin, OUTPUT);

    // Set up the encoder pins
    pinMode(leftEncoderPin, INPUT_PULLUP);
    pinMode(rightEncoderPin, INPUT_PULLUP);

    // Attach the motors
    leftMotor.attach(channelA_directionPin, channelA_pwmPin, channelA_brakePin);
    rightMotor.attach(channelB_directionPin, channelB_pwmPin, channelB_brakePin);

    // Attach the encoder interrupt handlers
    attachInterrupt(digitalPinToInterrupt(leftEncoderPin), handleLeftEncoderInterrupt, FALLING);
    attachInterrupt(digitalPinToInterrupt(rightEncoderPin), handleRightEncoderInterrupt, FALLING);

    Serial.println("Ready");
}

void handleLeftEncoderInterrupt()
{
    leftMotor.incrementEncoderCount();
}

void handleRightEncoderInterrupt()
{
    rightMotor.incrementEncoderCount();
}

void loop()
{
    if (Serial.available() > 0) {
        String input = Serial.readString();
        input.trim();
        if (!running) {
            if (input == "left") {
                Serial.println("LEFT");
                running = true;
                leftMotor.setEncoderCount(0);
                rightMotor.setEncoderCount(0);
                leftMotor.setDirection(Weavly::Robot::Direction::forward);
                leftMotor.run(96);
            } else if (input == "right") {
                Serial.println("RIGHT");
                running = true;
                leftMotor.setEncoderCount(0);
                rightMotor.setEncoderCount(0);
                rightMotor.setDirection(Weavly::Robot::Direction::forward);
                rightMotor.run(96);
            } else if (input == "both") {
                Serial.println("BOTH");
                running = true;
                leftMotor.setEncoderCount(0);
                rightMotor.setEncoderCount(0);
                leftMotor.setDirection(Weavly::Robot::Direction::forward);
                rightMotor.setDirection(Weavly::Robot::Direction::forward);
                leftMotor.run(96);
                rightMotor.run(96);
            }
        } else {
            Serial.println("OFF");
            leftMotor.brake();
            rightMotor.brake();
            running = false;
            printEncoderCounts();
        }
    }
}

void printEncoderCounts()
{
    Serial.print("Left: ");
    Serial.println(leftMotor.getEncoderCount());
    Serial.print("Right: ");
    Serial.println(rightMotor.getEncoderCount());
}
