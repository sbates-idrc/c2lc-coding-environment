// @flow

import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import type { IntlShape } from 'react-intl';
import { getTileName, isNone } from './TileData';
import { getBackgroundInfo } from './Worlds';
import type { WorldName } from './Worlds';

export default class CharacterDescriptionBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    getItemLabel(characterState: CharacterState,
        columnLabel: string, rowLabel: string,
        world: WorldName, customBackground: CustomBackground): ?string {

        const customBackgroundTile = customBackground.getTile(characterState.xPos, characterState.yPos);

        if (!isNone(customBackgroundTile)) {
            return this.intl.formatMessage({
                id: `TileDescription.${getTileName(customBackgroundTile)}`
            });
        } else {
            const backgroundInfo = getBackgroundInfo(world, columnLabel, rowLabel);
            if (backgroundInfo) {
                return this.intl.formatMessage({
                    id: `${world}.${backgroundInfo}`
                });
            } else {
                return null;
            }
        }
    }

    buildCharacterDescription(characterState: CharacterState,
        world: WorldName, customBackground: CustomBackground,
        customBackgroundEditMode: boolean): string {

        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();

        const itemLabel = this.getItemLabel(characterState, columnLabel,
            rowLabel, world, customBackground);

        if (customBackgroundEditMode) {
            if (itemLabel) {
                return this.intl.formatMessage(
                    {
                        id:'CharacterDescriptionBuilder.customEditModePositionAndItem'
                    },
                    {
                        columnLabel: columnLabel,
                        rowLabel: rowLabel,
                        item: itemLabel
                    }
                );
            } else {
                return this.intl.formatMessage(
                    {
                        id:'CharacterDescriptionBuilder.customEditModePosition'
                    },
                    {
                        columnLabel: columnLabel,
                        rowLabel: rowLabel,
                    }
                );
            }
        } else {
            const characterLabel = this.intl.formatMessage({id: `${world}.character`});
            const directionLabel = this.intl.formatMessage({id: `Direction.${characterState.direction}`});

            if (itemLabel) {
                return this.intl.formatMessage(
                    {
                        id:'CharacterDescriptionBuilder.positionAndDirectionAndItem'
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
                        id:'CharacterDescriptionBuilder.positionAndDirection'
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
