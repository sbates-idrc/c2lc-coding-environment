// @flow

import type { IntlShape } from 'react-intl';
import SceneDimensions from './SceneDimensions';

// TODO: Change message key, there is no CharacterMessageBuilder now

export default class HitWallMessage {
    x: number;
    y: number;
    dimensions: SceneDimensions;

    constructor(x: number, y: number, dimensions: SceneDimensions) {
        this.x = x;
        this.y = y;
        this.dimensions = dimensions;
    }

    getMessage(intl: IntlShape): string {
        const columnLabel = this.dimensions.getColumnLabel(this.x);
        const rowLabel = this.dimensions.getRowLabel(this.y);
        return intl.formatMessage(
            {
                id:'CharacterMessageBuilder.hitWall'
            },
            {
                columnLabel: columnLabel == null ? '' : columnLabel,
                rowLabel: rowLabel == null ? '' : rowLabel
            }
        );
    }
};
