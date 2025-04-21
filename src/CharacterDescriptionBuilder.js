// @flow

import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import type { IntlShape } from 'react-intl';
import { getBackgroundSquareDescription } from './Utils';
import type { WorldName } from './Worlds';

export default class CharacterDescriptionBuilder {
    buildDescription(characterState: CharacterState,
        world: WorldName, customBackground: CustomBackground,
        intl: IntlShape): string {

        const columnLabel = characterState.getColumnLabel();
        const rowLabel = characterState.getRowLabel();

        const itemLabel = getBackgroundSquareDescription(
            characterState.xPos,
            characterState.yPos,
            characterState.sceneDimensions,
            world,
            customBackground,
            intl
        );

        const facingDirectionLabel = intl.formatMessage({id: `FacingDirection.${characterState.direction}`});

        if (itemLabel) {
            return intl.formatMessage(
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
            return intl.formatMessage(
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
