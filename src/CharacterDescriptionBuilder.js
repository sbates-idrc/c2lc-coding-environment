// @flow

import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import type { IntlShape } from 'react-intl';
import { getBackgroundSquareDescription } from './Utils';
import type { WorldName } from './Worlds';

export default class CharacterDescriptionBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    buildDescription(characterState: CharacterState,
        world: WorldName, customBackground: CustomBackground): string {

        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();

        const itemLabel = getBackgroundSquareDescription(
            characterState.xPos,
            characterState.yPos,
            characterState.sceneDimensions,
            world,
            customBackground,
            this.intl
        );

        const facingDirectionLabel = this.intl.formatMessage({id: `FacingDirection.${characterState.direction}`});

        if (itemLabel) {
            return this.intl.formatMessage(
                {
                    id:'CharacterDescriptionBuilder.positionAndDirectionAndItem'
                },
                {
                    columnLabel: columnLabel,
                    rowLabel: rowLabel,
                    backgroundItem: itemLabel,
                    facingDirection: facingDirectionLabel
                }
            );
        } else {
            return this.intl.formatMessage(
                {
                    id:'CharacterDescriptionBuilder.positionAndDirection'
                },
                {
                    columnLabel: columnLabel,
                    rowLabel: rowLabel,
                    facingDirection: facingDirectionLabel
                }
            );
        }
    }
};
