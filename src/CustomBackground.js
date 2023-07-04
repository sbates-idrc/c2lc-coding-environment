// @flow

import SceneDimensions from './SceneDimensions';

// TODO: Decide what to do if x or y or index is out of range

const tiles = {
    '0': null,                       // Transparent
    '1': 'Scene__custom-white',      // White
    '2': 'Scene__custom-grey',       // Grey
    '3': 'Scene__custom-black',      // Black
    '4': 'Scene__custom-green',      // Green
    '5': 'Scene__custom-light-blue', // Light blue
    '6': 'Scene__custom-dark-blue',  // Dark blue
    '7': 'Scene__custom-yellow',     // Yellow
    '8': 'Scene__custom-orange',     // Orange
    '9': 'Scene__custom-red',        // Red
    'A': 'Scene__custom-pink',       // Pink
    'B': 'Scene__custom-purple'      // Purple
};

export type Tile = $Keys<typeof tiles>;

export function isTile(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export function getTileClassName(tile: Tile): ?string {
    return tiles[tile];
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
