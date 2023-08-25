// @flow

import CustomBackground from './CustomBackground';
import SceneDimensions from './SceneDimensions';
import { isTileCode } from './TileData';
import type { TileCode } from './TileData';

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
                const tileCode = text.charAt(i);
                if (isTileCode(tileCode)) {
                    tiles[i] = ((tileCode: any): TileCode);
                }
            }
        }

        return new CustomBackground(this.sceneDimensions, tiles);
    }
}
