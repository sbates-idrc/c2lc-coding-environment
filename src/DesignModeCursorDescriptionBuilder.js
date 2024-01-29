// @flow

import CustomBackground from './CustomBackground';
import PositionState from './PositionState';
import type { IntlShape } from 'react-intl';
import { getBackgroundSquareDescription } from './Utils';
import type { WorldName } from './Worlds';

export default class DesignModeCursorDescriptionBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    buildDescription(designModeCursorState: PositionState,
        world: WorldName, customBackground: CustomBackground): string {

        const columnLabel = designModeCursorState.getColumnLabel();
        const rowLabel = designModeCursorState.getRowLabel();

        const itemLabel = getBackgroundSquareDescription(
            designModeCursorState.x,
            designModeCursorState.y,
            designModeCursorState.sceneDimensions,
            world,
            customBackground,
            this.intl
        );

        if (itemLabel) {
            return this.intl.formatMessage(
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
            return this.intl.formatMessage(
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
