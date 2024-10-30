// @flow

import CustomBackground from './CustomBackground';
import DesignModeCursorState from './DesignModeCursorState';
import type { IntlShape } from 'react-intl';
import { getBackgroundSquareDescription } from './Utils';
import type { WorldName } from './Worlds';

export default class DesignModeCursorDescriptionBuilder {
    buildDescription(designModeCursorState: DesignModeCursorState,
        world: WorldName, customBackground: CustomBackground,
        intl: IntlShape): string {

        const columnLabel = designModeCursorState.getColumnLabel();
        const rowLabel = designModeCursorState.getRowLabel();

        const itemLabel = getBackgroundSquareDescription(
            designModeCursorState.x,
            designModeCursorState.y,
            designModeCursorState.sceneDimensions,
            world,
            customBackground,
            intl
        );

        if (itemLabel) {
            return intl.formatMessage(
                {
                    id:'DesignModeCursorDescriptionBuilder.positionAndItem'
                },
                {
                    columnLabel: columnLabel,
                    rowLabel: rowLabel,
                    item: itemLabel
                }
            );
        } else {
            return intl.formatMessage(
                {
                    id:'DesignModeCursorDescriptionBuilder.position'
                },
                {
                    columnLabel: columnLabel,
                    rowLabel: rowLabel,
                }
            );
        }
    }
};
