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

    constructor(sceneDimensions: SceneDimensions, tiles: ?Array<Tile>) {
        this.sceneDimensions = sceneDimensions;
        const numTiles = sceneDimensions.getWidth() * sceneDimensions.getHeight();
        if (tiles != null) {
            if (tiles.length === numTiles) {
                this.tiles = tiles;
            } else {
                this.tiles = tiles.slice(0, numTiles);
                this.tiles.length = numTiles;
                this.tiles.fill('0', tiles.length, numTiles);
            }
        } else {
            this.tiles = new Array(numTiles);
            this.tiles.fill('0');
        }
    }

    calculateIndex(x: number, y: number): number {
        return ((y - this.sceneDimensions.getMinY()) * this.sceneDimensions.getWidth())
            + (x - this.sceneDimensions.getMinX());
    }

    getTile(x: number, y: number): Tile {
        return this.tiles[this.calculateIndex(x, y)];
    }

    setTile(x: number, y: number, tile: Tile): CustomBackground {
        const tiles = this.tiles.slice();
        tiles[this.calculateIndex(x, y)] = tile;
        return new CustomBackground(this.sceneDimensions, tiles);
    }

    canMoveTo(x: number, y: number): boolean {
        // Treat grey tiles as wall
        return this.tiles[this.calculateIndex(x, y)] !== '2';
    }
}
