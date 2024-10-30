// @flow

import type { CharacterEvent } from './CharacterState';
import type { IntlShape } from 'react-intl';
import SceneDimensions from './SceneDimensions';

export default class CharacterMessageBuilder {
    dimensions: SceneDimensions;

    constructor(dimensions: SceneDimensions) {
        this.dimensions = dimensions;
    }

    buildMessage(event: CharacterEvent, intl: IntlShape): ?string {
        switch(event.type) {
            case 'endOfScene':
                return this.buildEndOfSceneMessage(intl);
            case 'hitWall':
                return this.buildHitWallMessage(event.x, event.y, intl);
            default:
                return null;
        }
    }

    buildEndOfSceneMessage(intl: IntlShape): string {
        return intl.formatMessage(
            {
                id:'CharacterMessageBuilder.endOfScene'
            }
        );
    }

    buildHitWallMessage(x: number, y: number, intl: IntlShape): string {
        const columnLabel = this.dimensions.getColumnLabel(x);
        const rowLabel = this.dimensions.getRowLabel(y);
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
