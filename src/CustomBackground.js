// @flow

import SceneDimensions from './SceneDimensions';
import { isWall } from './TileData';
import type { TileName } from './TileData';

// TODO: Decide what to do if x or y or index is out of range

export class CustomBackground {
    sceneDimensions: SceneDimensions;
    tiles: Array<TileName>;

    constructor(sceneDimensions: SceneDimensions, tiles: ?Array<TileName>) {
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

    getTile(x: number, y: number): TileName {
        return this.tiles[this.calculateIndex(x, y)];
    }

    setTile(x: number, y: number, tileName: TileName): CustomBackground {
        const tiles = this.tiles.slice();
        tiles[this.calculateIndex(x, y)] = tileName;
        return new CustomBackground(this.sceneDimensions, tiles);
    }

    canMoveTo(x: number, y: number): boolean {
        return !(isWall(this.tiles[this.calculateIndex(x, y)]));
    }
}
