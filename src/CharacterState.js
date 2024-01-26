// @flow

import * as C2lcMath from './C2lcMath';
import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';
import type { PathSegment } from './types';

// Character direction is stored as eighths of a turn, as follows:
// N:  0
// NE: 1
// E:  2
// SE: 3
// S:  4
// SW: 5
// W:  6
// NW: 7

const characterStateMaxPathLength = 600;

type CharacterEventType = 'endOfScene' | 'hitWall';

export type CharacterEvent = {
    type: CharacterEventType,
    x: number,
    y: number
};

export type CharacterUpdate = {
    characterState: CharacterState,
    event: ?CharacterEvent
};

type MovementResult = {
    x: number,
    y: number,
    pathSegments: Array<PathSegment>,
    event: ?CharacterEvent
};

export default class CharacterState {
    xPos: number; // Positive x is East
    yPos: number; // Positive y is South
    direction: number; // Eighths of a turn, see note above
    path: Array<PathSegment>;
    sceneDimensions: SceneDimensions;
    maxPathLength: number;

    constructor(xPos: number, yPos: number, direction: number, path: Array<PathSegment>, sceneDimensions: SceneDimensions) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = direction;
        this.path = path;
        this.sceneDimensions = sceneDimensions;
        this.maxPathLength = characterStateMaxPathLength;
    }

    getDirectionDegrees() {
        return this.direction * 45;
    }

    pathEquals(otherPath: Array<PathSegment>, epsilon: number) {
        if (this.path.length !== otherPath.length) {
            return false;
        }
        for (let i = 0; i < this.path.length; i++) {
            if (!C2lcMath.approxEqual(this.path[i].x1, otherPath[i].x1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y1, otherPath[i].y1, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].x2, otherPath[i].x2, epsilon)
                    || !C2lcMath.approxEqual(this.path[i].y2, otherPath[i].y2, epsilon)) {
                return false;
            }
        }
        return true;
    }

    forward(distance: number, drawingEnabled: boolean, customBackground: CustomBackground): CharacterUpdate {
        const movementResult = this.calculateMove(
            distance,
            this.direction,
            drawingEnabled,
            customBackground
        );
        return {
            characterState: new CharacterState(
                movementResult.x,
                movementResult.y,
                this.direction,
                this.mergePathSegments(this.path, movementResult.pathSegments),
                this.sceneDimensions
            ),
            event: movementResult.event
        };
    }

    backward(distance: number, drawingEnabled: boolean, customBackground: CustomBackground): CharacterUpdate {
        const movementResult = this.calculateMove(
            distance,
            C2lcMath.wrap(0, 8, this.direction + 4),
            drawingEnabled,
            customBackground
        );
        return {
            characterState: new CharacterState(
                movementResult.x,
                movementResult.y,
                this.direction,
                this.mergePathSegments(this.path, movementResult.pathSegments),
                this.sceneDimensions
            ),
            event: movementResult.event
        };
    }

    turnLeft(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction - amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    turnRight(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction + amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    moveUpPosition(): CharacterState {
        return new CharacterState(
            this.xPos,
            this.sceneDimensions.moveUp(this.yPos),
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveRightPosition(): CharacterState {
        return new CharacterState(
            this.sceneDimensions.moveRight(this.xPos),
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveDownPosition(): CharacterState {
        return new CharacterState(
            this.xPos,
            this.sceneDimensions.moveDown(this.yPos),
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    moveLeftPosition(): CharacterState {
        return new CharacterState(
            this.sceneDimensions.moveLeft(this.xPos),
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    changeXPosition(columnLabel: string): CharacterState {
        const xFromLabel = this.sceneDimensions.getXFromColumnLabel(columnLabel);
        if (xFromLabel == null) {
            return this;
        } else {
            return new CharacterState(
                xFromLabel,
                this.yPos,
                this.direction,
                this.path,
                this.sceneDimensions
            );
        }
    }

    changeYPosition(rowLabel: string): CharacterState {
        const yFromLabel = this.sceneDimensions.getYFromRowLabel(rowLabel);
        if (yFromLabel == null) {
            return this;
        } else {
            return new CharacterState(
                this.xPos,
                yFromLabel,
                this.direction,
                this.path,
                this.sceneDimensions
            );
        }
    }

    getRowLabel(): string {
        const label = this.sceneDimensions.getRowLabel(this.yPos);
        return (label == null ? '' : label);
    }

    getColumnLabel(): string {
        const label = this.sceneDimensions.getColumnLabel(this.xPos);
        return (label == null ? '' : label);
    }

    // Internal implementation methods

    // Calculates the movement for the specified distance in the specified direction.
    // Returns the final position and any generated path segments.
    calculateMove(distance: number, direction: number, drawingEnabled: boolean, customBackground: CustomBackground): MovementResult {
        const pathSegments = [];
        let x = this.xPos;
        let y = this.yPos;
        let event = null;

        for (let i = 0; i < distance; i++) {
            const movementResult = this.calculateMoveOneGridUnit(x, y, direction, customBackground);
            x = movementResult.x;
            y = movementResult.y;
            if (drawingEnabled) {
                Array.prototype.push.apply(pathSegments, movementResult.pathSegments);
            }
            // Stop on the first event
            if (movementResult.event != null) {
                event = movementResult.event;
                break;
            }
        }

        return {
            x,
            y,
            pathSegments,
            event
        };
    }

    // Calculates the movement for one grid unit in the specified direction.
    // Returns the new position and, if movement was possible, a path segment.
    calculateMoveOneGridUnit(x: number, y: number, direction: number, customBackground: CustomBackground): MovementResult {

        let event: ?CharacterEvent = null;
        let { newX, newY } = this.calculateNewXAndY(x, y, direction);

        if (newX < this.sceneDimensions.getMinX()
            || newX > this.sceneDimensions.getMaxX()
            || newY < this.sceneDimensions.getMinY()
            || newY > this.sceneDimensions.getMaxY()) {
            event = {
                type: 'endOfScene',
                x: x,
                y: y
            };
            newX = x;
            newY = y;
        } else if (customBackground.isWall(newX, newY)) {
            event = {
                type: 'hitWall',
                x: newX,
                y: newY
            };
            newX = x;
            newY = y;
        }

        if (newX === x && newY === y) {
            // We didn't move, don't return a path segment
            return {
                x: newX,
                y: newY,
                pathSegments: [],
                event: event
            };
        } else {
            // We did move, return a path segment
            const pathSegment = {
                x1: x,
                y1: y,
                x2: newX,
                y2: newY
            };
            return {
                x: newX,
                y: newY,
                pathSegments: [pathSegment],
                event: event
            };
        }
    }

    calculateNewXAndY(x: number, y: number, direction: number): { newX: number, newY: number } {
        switch(direction) {
            case 0:
                return { newX: x,     newY: y - 1 };
            case 1:
                return { newX: x + 1, newY: y - 1 };
            case 2:
                return { newX: x + 1, newY: y     };
            case 3:
                return { newX: x + 1, newY: y + 1 };
            case 4:
                return { newX: x,     newY: y + 1 };
            case 5:
                return { newX: x - 1, newY: y + 1 };
            case 6:
                return { newX: x - 1, newY: y     };
            case 7:
                return { newX: x - 1, newY: y - 1 };
            default:
                throw new Error('CharacterState direction must be an integer in range 0-7 inclusive');
        }
    }

    mergePathSegments(dest: Array<PathSegment>, src: Array<PathSegment>): Array<PathSegment> {
        const pathSegments = dest.slice();

        for (const newPathSegment of src) {
            let addNewPathSegment = true;
            if (pathSegments.length > 0) {
                const lastPathSegment = pathSegments[pathSegments.length - 1];
                const lastDirection = C2lcMath.pathSegmentDirection(lastPathSegment);
                const newDirection = C2lcMath.pathSegmentDirection(newPathSegment);
                if (newDirection === lastDirection
                        && this.isConnected(lastPathSegment, newPathSegment)) {
                    // The new path segment is in the same direction and is
                    // connected to the last one: extend the last path segment
                    pathSegments[pathSegments.length - 1] = {
                        x1: lastPathSegment.x1,
                        y1: lastPathSegment.y1,
                        x2: newPathSegment.x2,
                        y2: newPathSegment.y2
                    };
                    addNewPathSegment = false;
                } else if (((newDirection === lastDirection)
                            || C2lcMath.isOppositeDirection(newDirection, lastDirection))
                        && C2lcMath.pathSegmentLiesWithin(newPathSegment, lastPathSegment)) {
                    // The new path segment is in the same direction, or the
                    // opposite direction, as the last path segment and lies
                    // within it: we can ignore the new path segment as it
                    // is retracing over the last path segment
                    addNewPathSegment = false;
                }
            }
            if (addNewPathSegment) {
                pathSegments.push(newPathSegment);
            }
        }

        if (pathSegments.length > this.maxPathLength) {
            return pathSegments.slice(this.maxPathLength * -1);
        } else {
            return pathSegments;
        }
    }

    isConnected(a: PathSegment, b: PathSegment): boolean {
        return a.x2 === b.x1 && a.y2 === b.y1;
    }
}
