// Pins

const int channelA_directionPin = 12;
const int channelA_pwmPin = 3;
const int channelA_brakePin = 9;

const int encoderPin = 4;

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

Weavly::Robot::Motor motor;

bool running = false;

void setup()
{
    Serial.begin(9600);
    while (!Serial) {
        delay(10);
    }

    // Set up the pins
    pinMode(channelA_directionPin, OUTPUT);
    pinMode(channelA_pwmPin, OUTPUT);
    pinMode(channelA_brakePin, OUTPUT);
    pinMode(encoderPin, INPUT_PULLUP);

    // Attach the motor
    motor.attach(channelA_directionPin, channelA_pwmPin, channelA_brakePin);

    // Attach the encoder interrupt handler
    attachInterrupt(digitalPinToInterrupt(encoderPin), handleEncoderInterrupt, FALLING);

    Serial.println("Ready");
}

void handleEncoderInterrupt()
{
    motor.incrementEncoderCount();
}

void loop()
{
    if (Serial.available() > 0) {
        String input = Serial.readString();
        input.trim();
        if (!running && input == "on") {
            Serial.println("ON");
            running = true;
            motor.setEncoderCount(0);
            motor.setDirection(Weavly::Robot::Direction::forward);
            motor.run(96);
        } else {
            Serial.println("OFF");
            motor.brake();
            running = false;
            printEncoderCount();
        }
    }
}

void printEncoderCount()
{
    Serial.print("Encoder: ");
    Serial.println(motor.getEncoderCount());
}
