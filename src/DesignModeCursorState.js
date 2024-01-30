// @flow

import SceneDimensions from './SceneDimensions';

export default class DesignModeCursorState {
    x: number; // Positive x is East
    y: number; // Positive y is South
    sceneDimensions: SceneDimensions;

    constructor(x: number, y: number, sceneDimensions: SceneDimensions) {
        this.x = x;
        this.y = y;
        this.sceneDimensions = sceneDimensions;
    }

    setPosition(x: number, y: number): DesignModeCursorState {
        return new DesignModeCursorState(x, y, this.sceneDimensions);
    }

    setX(x: number): DesignModeCursorState {
        if (x >= this.sceneDimensions.getMinX()
                && x <= this.sceneDimensions.getMaxX()) {
            return new DesignModeCursorState(x, this.y, this.sceneDimensions);
        } else {
            return this;
        }
    }

    setY(y: number): DesignModeCursorState {
        if (y >= this.sceneDimensions.getMinY()
                && y <= this.sceneDimensions.getMaxY()) {
            return new DesignModeCursorState(this.x, y, this.sceneDimensions);
        } else {
            return this;
        }
    }

    moveLeft(): DesignModeCursorState {
        return new DesignModeCursorState(
            this.sceneDimensions.moveLeft(this.x),
            this.y,
            this.sceneDimensions
        );
    }

    moveRight(): DesignModeCursorState {
        return new DesignModeCursorState(
            this.sceneDimensions.moveRight(this.x),
            this.y,
            this.sceneDimensions
        );
    }

    moveUp(): DesignModeCursorState {
        return new DesignModeCursorState(
            this.x,
            this.sceneDimensions.moveUp(this.y),
            this.sceneDimensions
        );
    }

    moveDown(): DesignModeCursorState {
        return new DesignModeCursorState(
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
