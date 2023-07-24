// @flow

import { CustomBackground } from './CustomBackground';
import SceneDimensions from './SceneDimensions';
import { isTileName } from './TileData';
import type { TileName } from './TileData';

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
                const tileName = text.charAt(i);
                if (isTileName(tileName)) {
                    tiles[i] = ((tileName: any): TileName);
                }
            }
        }

        return new CustomBackground(this.sceneDimensions, tiles);
    }
}
