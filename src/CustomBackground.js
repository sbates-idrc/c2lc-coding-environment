// @flow

import SceneDimensions from './SceneDimensions';

// TODO: Decide what to do if x or y is out of range

export type Tile =
    '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B';

export default class CustomBackground {
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
}
