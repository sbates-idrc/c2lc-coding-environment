// @flow

import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import type { IntlShape } from 'react-intl';
import { getTileName, isTransparent } from './TileData';
import { getBackgroundInfo } from './Worlds';
import type { WorldName } from './Worlds';

export default class CharacterDescriptionBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    buildCharacterDescription(characterState: CharacterState,
        world: WorldName, customBackground: CustomBackground) {

        const characterLabel = this.intl.formatMessage({id: `${world}.character`});
        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();
        const directionLabel = this.intl.formatMessage({id: `Direction.${characterState.direction}`});

        const customBackgroundTile = customBackground.getTile(characterState.xPos, characterState.yPos);

        if (!isTransparent(customBackgroundTile)) {
            const itemLabel = this.intl.formatMessage({
                id: `TileDescription.${getTileName(customBackgroundTile)}`
            });
            return this.intl.formatMessage(
                {
                    id:'CharacterDescriptionBuilder.positionAriaLabelWithItem'
                },
                {
                    character: characterLabel,
                    columnLabel: columnLabel,
                    rowLabel: rowLabel,
                    direction: directionLabel,
                    item: itemLabel
                }
            );
        } else {
            const backgroundInfo = getBackgroundInfo(world, columnLabel, rowLabel);
            if (backgroundInfo) {
                const itemLabel = this.intl.formatMessage({
                    id: `${world}.${backgroundInfo}`
                });
                return this.intl.formatMessage(
                    {
                        id:'CharacterDescriptionBuilder.positionAriaLabelWithItem'
                    },
                    {
                        character: characterLabel,
                        columnLabel: columnLabel,
                        rowLabel: rowLabel,
                        direction: directionLabel,
                        item: itemLabel
                    }
                );
            } else {
                return this.intl.formatMessage(
                    {
                        id:'CharacterDescriptionBuilder.positionAriaLabel'
                    },
                    {
                        character: characterLabel,
                        columnLabel: columnLabel,
                        rowLabel: rowLabel,
                        direction: directionLabel
                    }
                );
            }
        }
    }
};
