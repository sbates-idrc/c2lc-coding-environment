// @flow

import { CustomBackground, isTile } from './CustomBackground';
import type { Tile } from './CustomBackground';
import SceneDimensions from './SceneDimensions';

export default class CustomBackgroundSerializer {
    sceneDimensions: SceneDimensions;

    constructor(sceneDimensions: SceneDimensions) {
        this.sceneDimensions = sceneDimensions;
    }

    serialize(customBackground: CustomBackground): string {
        return customBackground.tiles.join('');
    }

    deserialize(text: ?string): CustomBackground {
        const numTiles = this.sceneDimensions.getWidth() * this.sceneDimensions.getHeight();
        const tiles = new Array(numTiles);
        tiles.fill('0');

        if (text) {
            for (let i = 0; (i < text.length) && (i < numTiles); i++) {
                const tile = text.charAt(i);
                if (isTile(tile)) {
                    tiles[i] = ((tile: any): Tile);
                }
            }
        }

        return new CustomBackground(this.sceneDimensions, tiles);
    }
}
