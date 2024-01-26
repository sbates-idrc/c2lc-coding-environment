// @flow

export default class SceneDimensions {
    #width: number;
    #height: number;
    #minX: number;
    #minY: number;
    #maxX: number;
    #maxY: number;

    constructor(minX: number, maxX:number, minY:number, maxY: number) {
        this.#minX = minX;
        this.#maxX = maxX;
        this.#maxY = maxY;
        this.#minY = minY;

        this.#width = (maxX - minX) + 1;
        this.#height = (maxY - minY) + 1;
    }

    getWidth(): number {
        return this.#width;
    }

    getHeight(): number {
        return this.#height;
    }

    getMinX(): number {
        return this.#minX;
    }

    getMinY(): number {
        return this.#minY;
    }

    getMaxX(): number {
        return this.#maxX;
    }

    getMaxY(): number {
        return this.#maxY;
    }

    moveLeft(x: number): number {
        return Math.max(x - 1, this.#minX);
    }

    moveRight(x: number): number {
        return Math.min(x + 1, this.#maxX);
    }

    moveUp(y: number): number {
        return Math.max(y - 1, this.#minY);
    }

    moveDown(y: number): number {
        return Math.min(y + 1, this.#maxY);
    }

    // Returns the X coordinate value for a column label.
    // Columns are labelled from 'A' at minX and may be uppercase or lowercase.
    // Returns null if the argument is not a valid column label.
    getXFromColumnLabel(columnLabel: string): ?number {
        if (columnLabel.length !== 1) {
            return null;
        }
        const columnCharCode = columnLabel.toUpperCase().charCodeAt(0);
        const x = columnCharCode - 'A'.charCodeAt(0) + this.#minX;
        if (x >= this.#minX && x <= this.#maxX) {
            return x;
        }
        return null;
    }

    // Returns the Y coordinate value for a row label.
    // Rows labels are numbered directly as the Y coordinate value.
    // Returns null if the argument is not a valid row label.
    getYFromRowLabel(rowLabel: string): ?number {
        const y = parseInt(rowLabel, 10);
        if (!Number.isNaN(y) && y >= this.#minY && y <= this.#maxY) {
            return y;
        }
        return null;
    }

    // Returns the column label for an X coordinate value.
    // Returns null if the argument is out of range.
    getColumnLabel(x: number): ?string {
        if (x >= this.#minX && x <= this.#maxX) {
            return String.fromCharCode('A'.charCodeAt(0) + x - this.#minX);
        } else {
            return null;
        }
    }

    // Returns the row label for a Y coordinate value.
    // Returns null if the argument is out of range.
    getRowLabel(y: number): ?string {
        if (y >= this.#minY && y <= this.#maxY) {
            return y.toString();
        } else {
            return null;
        }
    }
};
