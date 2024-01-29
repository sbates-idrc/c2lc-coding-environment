// @flow

import SceneDimensions from './SceneDimensions';

export default class PositionState {
    x: number; // Positive x is East
    y: number; // Positive y is South
    sceneDimensions: SceneDimensions;

    constructor(x: number, y: number, sceneDimensions: SceneDimensions) {
        this.x = x;
        this.y = y;
        this.sceneDimensions = sceneDimensions;
    }

    setPosition(x: number, y: number): PositionState {
        return new PositionState(x, y, this.sceneDimensions);
    }

    setX(x: number): PositionState {
        if (x >= this.sceneDimensions.getMinX()
                && x <= this.sceneDimensions.getMaxX()) {
            return new PositionState(x, this.y, this.sceneDimensions);
        } else {
            return this;
        }
    }

    setY(y: number): PositionState {
        if (y >= this.sceneDimensions.getMinY()
                && y <= this.sceneDimensions.getMaxY()) {
            return new PositionState(this.x, y, this.sceneDimensions);
        } else {
            return this;
        }
    }

    moveLeft(): PositionState {
        return new PositionState(
            this.sceneDimensions.moveLeft(this.x),
            this.y,
            this.sceneDimensions
        );
    }

    moveRight(): PositionState {
        return new PositionState(
            this.sceneDimensions.moveRight(this.x),
            this.y,
            this.sceneDimensions
        );
    }

    moveUp(): PositionState {
        return new PositionState(
            this.x,
            this.sceneDimensions.moveUp(this.y),
            this.sceneDimensions
        );
    }

    moveDown(): PositionState {
        return new PositionState(
            this.x,
            this.sceneDimensions.moveDown(this.y),
            this.sceneDimensions
        );
    }

    getColumnLabel(): string {
        const label = this.sceneDimensions.getColumnLabel(this.x);
        return (label == null ? '' : label);
    }

    getRowLabel(): string {
        const label = this.sceneDimensions.getRowLabel(this.y);
        return (label == null ? '' : label);
    }
}
