// @flow

import * as C2lcMath from './C2lcMath';
import SceneDimensions from './SceneDimensions';

// Character direction is stored as eighths of a turn, as follows:
// N:  0
// NE: 1
// E:  2
// SE: 3
// S:  4
// SW: 5
// W:  6
// NW: 7

type PathSegment = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
};

type MovementResult = {
    x: number,
    y: number,
    pathSegments: Array<PathSegment>
};

export default class CharacterState {
    xPos: number; // Positive x is East
    yPos: number; // Positive y is South
    direction: number; // Eighths of a turn, see note above
    path: Array<PathSegment>;
    sceneDimensions: SceneDimensions;

    constructor(xPos: number, yPos: number, direction: number, path: Array<PathSegment>, sceneDimensions: SceneDimensions) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.direction = direction;
        this.path = path;
        this.sceneDimensions = sceneDimensions;
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

    // eslint-disable-next-line no-use-before-define
    forward(distance: number, drawingEnabled: boolean): CharacterState {
        const movementResult = this.calculateMove(distance, this.direction, drawingEnabled);
        return new CharacterState(
            movementResult.x,
            movementResult.y,
            this.direction,
            this.path.concat(movementResult.pathSegments),
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    backward(distance: number, drawingEnabled: boolean): CharacterState {
        const movementResult = this.calculateMove(distance,
                C2lcMath.wrap(0, 8, this.direction + 4), drawingEnabled);
        return new CharacterState(
            movementResult.x,
            movementResult.y,
            this.direction,
            this.path.concat(movementResult.pathSegments),
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    turnLeft(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction - amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    turnRight(amountEighthsOfTurn: number): CharacterState {
        return new CharacterState(
            this.xPos,
            this.yPos,
            C2lcMath.wrap(0, 8, this.direction + amountEighthsOfTurn),
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    moveUpPosition(): CharacterState {
        let yPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.yPos - 1) === 'outOfBoundsBelow') {
            yPos = 1;
        } else {
            yPos = this.yPos - 1;
        }
        return new CharacterState(
            this.xPos,
            yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    moveRightPosition(): CharacterState {
        let xPos = 0;
        if (this.sceneDimensions.getBoundsStateX(this.xPos + 1) === 'outOfBoundsAbove') {
            xPos = this.sceneDimensions.getWidth();
        } else {
            xPos = this.xPos + 1;
        }
        return new CharacterState(
            xPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    moveDownPosition(): CharacterState {
        let yPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.yPos + 1) === 'outOfBoundsAbove') {
            yPos = this.sceneDimensions.getHeight();
        } else {
            yPos = this.yPos + 1;
        }
        return new CharacterState(
            this.xPos,
            yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    moveLeftPosition(): CharacterState {
        let xPos = 0;
        if (this.sceneDimensions.getBoundsStateY(this.xPos - 1) === 'outOfBoundsBelow') {
            xPos = 1;
        } else {
            xPos = this.xPos - 1;
        }
        return new CharacterState(
            xPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    changeXPosition(columnLabel: string): CharacterState {
        let newXPos = this.xPos;
        if (columnLabel <= String.fromCharCode(64 + this.sceneDimensions.getWidth()) && columnLabel >='A') {
            newXPos = columnLabel.charCodeAt(0) - 64;
        } else if (columnLabel <= String.fromCharCode(96 + this.sceneDimensions.getWidth()) && columnLabel >='a') {
            newXPos = columnLabel.charCodeAt(0) - 96;
        }
        return new CharacterState(
            newXPos,
            this.yPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }

    // eslint-disable-next-line no-use-before-define
    changeYPosition(rowLabel: number): CharacterState {
        let newYPos = this.yPos;
        if (rowLabel <= this.sceneDimensions.getHeight() && rowLabel >= 1) {
            newYPos = rowLabel;
        }
        return new CharacterState(
            this.xPos,
            newYPos,
            this.direction,
            this.path,
            this.sceneDimensions
        );
    }


    getRowLabel(): string {
        return `${this.yPos}`;
    }

    getColumnLabel(): string {
        return String.fromCharCode(64 + this.xPos);
    }

    // Internal implementation method.
    // Calculates the movement for the specified distance in the specified direction.
    // Returns the final position and any generated path segments.
    calculateMove(distance: number, direction: number, drawingEnabled: boolean): MovementResult {
        const pathSegments = [];
        let x = this.xPos;
        let y = this.yPos;

        for (let i = 0; i < distance; i++) {
            const movementResult = this.calculateMoveOneGridUnit(x, y, direction);
            x = movementResult.x;
            y = movementResult.y;
            if (drawingEnabled) {
                Array.prototype.push.apply(pathSegments, movementResult.pathSegments);
            }
        }

        return {
            x,
            y,
            pathSegments
        };
    }

    // Internal implementation method.
    // Calculates the movement for one grid unit in the specified direction.
    // Returns the new position and, if movement was possible, a path segment.
    calculateMoveOneGridUnit(x: number, y: number, direction: number): MovementResult {
        let newX;
        let newY;

        switch(direction) {
            case 0:
                newX = x;
                newY = y - 1;
                break;
            case 1:
                newX = x + 1;
                newY = y - 1;
                break;
            case 2:
                newX = x + 1;
                newY = y;
                break;
            case 3:
                newX = x + 1;
                newY = y + 1;
                break;
            case 4:
                newX = x;
                newY = y + 1;
                break;
            case 5:
                newX = x - 1;
                newY = y + 1;
                break;
            case 6:
                newX = x - 1;
                newY = y;
                break;
            case 7:
                newX = x - 1;
                newY = y - 1;
                break;
            default:
                throw new Error('CharacterState direction must be an integer in range 0-7 inclusive');
        }

        newX = C2lcMath.clamp(1, this.sceneDimensions.getWidth(), newX);
        newY = C2lcMath.clamp(1, this.sceneDimensions.getHeight(), newY);

        if (newX === x && newY === y) {
            // We didn't move, don't return a path segment
            return {
                x: newX,
                y: newY,
                pathSegments: []
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
                pathSegments: [pathSegment]
            };
        }
    }
}
