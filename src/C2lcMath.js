// @flow

function approxEqual(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}

function clamp(lower: number, upper: number, val: number): number {
    if (val < lower) {
        return lower;
    }
    else if (val > upper) {
        return upper;
    }
    return val;
}

function degrees2radians(degrees: number): number {
    return degrees * Math.PI / 180;
}

function wrap(start: number, stop: number, val: number): number {
    return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
}

export { approxEqual, clamp, degrees2radians, wrap };
