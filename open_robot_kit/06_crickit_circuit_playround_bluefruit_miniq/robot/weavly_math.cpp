#include "weavly_math.h"

namespace Weavly::Robot {

float clamp(float val, float lower, float upper)
{
    float result = val;

    if (val < lower) {
        result = lower;
    } else if (val > upper) {
        result = upper;
    }

    return result;
}

}
