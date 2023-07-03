// @flow

import { CustomBackground, isTile } from './CustomBackground';
import type { Tile } from './CustomBackground';
import SceneDimensions from './SceneDimensions';

export default class CustomBackgroundSerializer {
    sceneDimensions: SceneDimensions;

    constructor(sceneDimensions: SceneDimensions) {
        this.sceneDimensions = sceneDimensions;
    }

    deserialize(text: ?string): CustomBackground {
        const customBackground = new CustomBackground(this.sceneDimensions, '0');

        if (text) {
            const numTiles = this.sceneDimensions.getWidth() * this.sceneDimensions.getHeight();
            for (let i = 0; (i < text.length) && (i < numTiles); i++) {
                const tile = text.charAt(i);
                if (isTile(tile)) {
                    customBackground.setTileByIndex(i, ((tile: any): Tile));
                }
            }
        }

        return customBackground;
    }
}
