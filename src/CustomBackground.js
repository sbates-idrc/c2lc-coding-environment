// @flow

import SceneDimensions from './SceneDimensions';

// TODO: Decide what to do if x or y or index is out of range

const tiles = {
    '0': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    'A': true,
    'B': true
};

export type Tile = $Keys<typeof tiles>;

export function isTile(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export class CustomBackground {
    sceneDimensions: SceneDimensions;
    tiles: Array<Tile>;

    constructor(sceneDimensions: SceneDimensions, tile: Tile) {
        this.sceneDimensions = sceneDimensions;
        this.tiles = new Array(sceneDimensions.getWidth() * sceneDimensions.getHeight());
        this.tiles.fill(tile);
    }

    calculateIndex(x: number, y: number): number {
        return ((y - this.sceneDimensions.getMinY()) * this.sceneDimensions.getWidth())
            + (x - this.sceneDimensions.getMinX());
    }

    setTile(x: number, y: number, tile: Tile): void {
        this.tiles[this.calculateIndex(x, y)] = tile;
    }

    getTile(x: number, y: number): Tile {
        return this.tiles[this.calculateIndex(x, y)];
    }

    setTileByIndex(index: number, tile: Tile): void {
        this.tiles[index] = tile;
    }
}
