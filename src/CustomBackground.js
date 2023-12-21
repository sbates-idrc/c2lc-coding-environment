// @flow

import * as C2lcMath from './C2lcMath';
import SceneDimensions from './SceneDimensions';
import { isWall } from './TileData';
import type { TileCode } from './TileData';

export default class CustomBackground {
    sceneDimensions: SceneDimensions;
    tiles: Array<TileCode>;

    constructor(sceneDimensions: SceneDimensions, tiles: ?Array<TileCode>) {
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

    getTile(x: number, y: number): TileCode {
        return this.tiles[this.calculateIndex(x, y)];
    }

    setTile(x: number, y: number, tileCode: TileCode): CustomBackground {
        const tiles = this.tiles.slice();
        tiles[this.calculateIndex(x, y)] = tileCode;
        return new CustomBackground(this.sceneDimensions, tiles);
    }

    isWall(x: number, y: number): boolean {
        return isWall(this.tiles[this.calculateIndex(x, y)]);
    }

    // Internal

    calculateIndex(x: number, y: number): number {
        x = C2lcMath.clamp(this.sceneDimensions.getMinX(), this.sceneDimensions.getMaxX(), x);
        y = C2lcMath.clamp(this.sceneDimensions.getMinY(), this.sceneDimensions.getMaxY(), y);
        return ((y - this.sceneDimensions.getMinY()) * this.sceneDimensions.getWidth())
            + (x - this.sceneDimensions.getMinX());
    }
}
