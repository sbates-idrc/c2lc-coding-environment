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

    forward(distance: number, drawingEnabled: boolean): CharacterState {
        let xOffset = 0;
        let yOffset = 0;

        switch(this.direction) {
            case 0:
                xOffset = 0;
                yOffset = -distance;
                break;
            case 1:
                xOffset = distance;
                yOffset = -distance;
                break;
            case 2:
                xOffset = distance;
                yOffset = 0;
                break;
            case 3:
                xOffset = distance;
                yOffset = distance;
                break;
            case 4:
                xOffset = 0;
                yOffset = distance;
                break;
            case 5:
                xOffset = -distance;
                yOffset = distance;
                break;
            case 6:
                xOffset = -distance;
                yOffset = 0;
                break;
            case 7:
                xOffset = -distance;
                yOffset = -distance;
                break;
            default:
                throw new Error('CharacterState direction must be an integer in range 0-7 inclusive');
        }

        let newYPos = 0;
        let newXPos = 0;
        let turnSegment = [];
        const boundsStateX = this.sceneDimensions.getBoundsStateX(this.xPos + xOffset);
        const boundsStateY = this.sceneDimensions.getBoundsStateY(this.yPos + yOffset);

        if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = 1;
            newYPos = 1;
            const drawIteration = Math.max(this.xPos - 1, this.yPos - 1);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, this.direction);
        } else if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = 1;
            newYPos = this.sceneDimensions.getHeight();
            const drawIteration = Math.max(this.xPos - 1, newYPos - this.yPos);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, this.direction);
        } else if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'inBounds') {
            newXPos = 1;
            newYPos = this.yPos + yOffset;
            turnSegment = this.drawEdgeDiagonalPath([], this.xPos - 1, this.direction);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'inBounds') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = this.yPos + yOffset;
            turnSegment = this.drawEdgeDiagonalPath([], newXPos - this.xPos, this.direction);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = 1;
            const drawIteration = Math.max(newXPos - this.xPos, this.yPos - 1);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, this.direction);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = this.sceneDimensions.getHeight();
            const drawIteration = Math.max(newXPos - this.xPos, newYPos - this.yPos);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, this.direction);
        } else if (boundsStateX === 'inBounds' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = this.xPos + xOffset;
            newYPos = 1;
            turnSegment = this.drawEdgeDiagonalPath([], this.yPos - 1, this.direction);
        } else if (boundsStateX === 'inBounds' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = this.xPos + xOffset;
            newYPos = this.sceneDimensions.getHeight();
            turnSegment = this.drawEdgeDiagonalPath([], newYPos - this.yPos, this.direction);
        } else {
            newXPos = this.xPos + xOffset;
            newYPos = this.yPos + yOffset;
        }

        let startingX1 = this.xPos;
        let startingY1 = this.yPos;

        if (turnSegment.length > 0) {
            startingX1 = turnSegment[turnSegment.length - 1].x2;
            startingY1 = turnSegment[turnSegment.length - 1].y2;
        }

        const newPathSegment = {
            x1: startingX1,
            y1: startingY1,
            x2: newXPos,
            y2: newYPos
        };

        if (newPathSegment.x2 === this.xPos &&
            newPathSegment.y2 === this.yPos) {
            return new CharacterState(
                newXPos,
                newYPos,
                this.direction,
                this.path,
                this.sceneDimensions
            )
        }

        return new CharacterState(
            newXPos,
            newYPos,
            this.direction,
            drawingEnabled ?
                turnSegment.length > 0 ?
                    this.path.concat(turnSegment, [newPathSegment]) :
                    this.path.concat([newPathSegment]) :
                this.path,
            this.sceneDimensions
        );
    }

    backward(distance: number, drawingEnabled: boolean): CharacterState {
        let xOffset = 0;
        let yOffset = 0;

        switch(this.direction) {
            case 0:
                xOffset = 0;
                yOffset = distance;
                break;
            case 1:
                xOffset = -distance;
                yOffset = +distance;
                break;
            case 2:
                xOffset = -distance;
                yOffset = 0;
                break;
            case 3:
                xOffset = -distance;
                yOffset = -distance;
                break;
            case 4:
                xOffset = 0;
                yOffset = -distance;
                break;
            case 5:
                xOffset = distance;
                yOffset = -distance;
                break;
            case 6:
                xOffset = distance;
                yOffset = 0;
                break;
            case 7:
                xOffset = distance;
                yOffset = distance;
                break;
            default:
                throw new Error('CharacterState direction must be an integer in range 0-7 inclusive');
        }

        let newYPos, newXPos = 0;
        let turnSegment = [];
        const boundsStateX = this.sceneDimensions.getBoundsStateX(this.xPos + xOffset);
        const boundsStateY = this.sceneDimensions.getBoundsStateY(this.yPos + yOffset);

        if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = 1;
            newYPos = 1;
            const drawIteration = Math.max(this.xPos - 1, this.yPos - 1);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, (this.direction + 4) % 8);
        } else if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = 1;
            newYPos = this.sceneDimensions.getHeight();
            const drawIteration = Math.max(this.xPos - 1, newYPos - this.yPos);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, (this.direction + 4) % 8);
        } else if (boundsStateX === 'outOfBoundsBelow' && boundsStateY === 'inBounds') {
            newXPos = 1;
            newYPos = this.yPos + yOffset;
            turnSegment = this.drawEdgeDiagonalPath([], this.xPos - 1, (this.direction + 4) % 8);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'inBounds') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = this.yPos + yOffset;
            turnSegment = this.drawEdgeDiagonalPath([], newXPos - this.xPos, (this.direction + 4) % 8);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = 1;
            const drawIteration = Math.max(newXPos - this.xPos, this.yPos - 1);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, (this.direction + 4) % 8);
        } else if (boundsStateX === 'outOfBoundsAbove' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = this.sceneDimensions.getWidth();
            newYPos = this.sceneDimensions.getHeight();
            const drawIteration = Math.max(newXPos - this.xPos, newYPos - this.yPos);
            turnSegment = this.drawEdgeDiagonalPath([], drawIteration, (this.direction + 4) % 8);
        } else if (boundsStateX === 'inBounds' && boundsStateY === 'outOfBoundsBelow') {
            newXPos = this.xPos + xOffset;
            newYPos = 1;
            turnSegment = this.drawEdgeDiagonalPath([], this.yPos - 1, (this.direction + 4) % 8);
        } else if (boundsStateX === 'inBounds' && boundsStateY === 'outOfBoundsAbove') {
            newXPos = this.xPos + xOffset;
            newYPos = this.sceneDimensions.getHeight();
            turnSegment = this.drawEdgeDiagonalPath([], newYPos - this.yPos, (this.direction + 4) % 8);
        } else {
            newXPos = this.xPos + xOffset;
            newYPos = this.yPos + yOffset;
        }

        let startingX1 = this.xPos;
        let startingY1 = this.yPos;

        if (turnSegment.length > 0) {
            startingX1 = turnSegment[turnSegment.length - 1].x2;
            startingY1 = turnSegment[turnSegment.length - 1].y2;
        }

        const newPathSegment = {
            x1: startingX1,
            y1: startingY1,
            x2: newXPos,
            y2: newYPos
        };

        if (newPathSegment.x2 === this.xPos &&
            newPathSegment.y2 === this.yPos) {
            return new CharacterState(
                newXPos,
                newYPos,
                this.direction,
                this.path,
                this.sceneDimensions
            )
        }

        return new CharacterState(
            newXPos,
            newYPos,
            this.direction,
            drawingEnabled ?
                turnSegment.length > 0 ?
                    this.path.concat(turnSegment, [newPathSegment]) :
                    this.path.concat([newPathSegment]) :
                this.path,
            this.sceneDimensions
        );
    }

    drawEdgeDiagonalPath(path: Array<PathSegment>, iterations: number, direction:number): Array<PathSegment> {
        if (iterations === 0) {
            return path;
        } else {
            let x2 = this.xPos;
            let y2 = this.yPos;
            if (path.length !== 0) {
                x2 = path[path.length - 1].x2;
                y2 = path[path.length - 1].y2;
            }
            let newX2 = 0;
            let newY2 = 0;
            switch (direction) {
                case 1:
                    if (x2 !== this.sceneDimensions.getWidth() && y2 === 1) {
                        newX2 = x2 + 1;
                        newY2 = y2;
                    } else if (x2 === this.sceneDimensions.getWidth() && y2 !== 1) {
                        newX2 = x2;
                        newY2 = y2 - 1;
                    }  else {
                        newX2 = x2 + 1;
                        newY2 = y2 - 1;
                    }
                    break;
                case 3:
                    if (x2 !== this.sceneDimensions.getWidth() && y2 === this.sceneDimensions.getHeight()) {
                        newX2 = x2 + 1;
                        newY2 = y2;
                    } else if (x2 === this.sceneDimensions.getWidth() && y2 !== this.sceneDimensions.getHeight()) {
                        newX2 = x2;
                        newY2 = y2 + 1;
                    } else {
                        newX2 = x2 + 1;
                        newY2 = y2 + 1;
                    }
                    break;
                case 5:
                    if (x2 !== 1 && y2 === this.sceneDimensions.getHeight()) {
                        newX2 = x2 - 1;
                        newY2 = y2;
                    } else if (x2 === 1 && y2 !== this.sceneDimensions.getHeight()) {
                        newX2 = x2;
                        newY2 = y2 + 1;
                    } else {
                        newX2 = x2 - 1;
                        newY2 = y2 + 1;
                    }
                    break;
                case 7:
                    if (x2 !== 1 && y2 === 1) {
                        newX2 = x2 - 1;
                        newY2 = y2;
                    } else if (x2 === 1 && y2 !== 1) {
                        newX2 = x2;
                        newY2 = y2 - 1;
                    } else {
                        newX2 = x2 - 1;
                        newY2 = y2 - 1;
                    }
                    break;
                default:
                    return [];
            }
            if (x2 !== newX2 && y2 !== newY2) {
                path.push({
                    x1: x2,
                    y1: y2,
                    x2: newX2,
                    y2: newY2
                });
            }
            return this.drawEdgeDiagonalPath(path, iterations - 1, direction);
        }
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
}
