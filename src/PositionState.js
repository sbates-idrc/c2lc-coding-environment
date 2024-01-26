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

    setXFromColumnLabel(columnLabel: string): PositionState {
        const xFromLabel = this.sceneDimensions.getXFromColumnLabel(columnLabel);
        if (xFromLabel == null) {
            return this;
        } else {
            return new PositionState(
                xFromLabel,
                this.y,
                this.sceneDimensions
            );
        }
    }

    setYFromRowLabel(rowLabel: string): PositionState {
        const yFromLabel = this.sceneDimensions.getYFromRowLabel(rowLabel);
        if (yFromLabel == null) {
            return this;
        } else {
            return new PositionState(
                this.x,
                yFromLabel,
                this.sceneDimensions
            );
        }
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
