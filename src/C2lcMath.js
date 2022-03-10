// @flow

import type { PathSegment } from './types';

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

function pathSegmentDirection(pathSegment: PathSegment): number {
    return Math.atan2(pathSegment.y2 - pathSegment.y1,
        pathSegment.x2 - pathSegment.x1);
}

function isOppositeDirection(dir1: number, dir2: number): boolean {
    if (dir1 === 0) {
        return dir2 === Math.PI;
    } else {
        return wrap(Math.PI * -1, Math.PI, dir1 + Math.PI) === dir2;
    }
}

function wrap(start: number, stop: number, val: number): number {
    return val - (Math.floor((val - start) / (stop - start)) * (stop - start));
}

export {
    approxEqual,
    clamp,
    degrees2radians,
    pathSegmentDirection,
    isOppositeDirection,
    wrap
};
