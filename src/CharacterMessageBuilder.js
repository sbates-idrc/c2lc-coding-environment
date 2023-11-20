// @flow

import type { CharacterEvent } from './CharacterState';
import Message from './Message';
import type { IntlShape } from 'react-intl';
import SceneDimensions from './SceneDimensions';

export default class CharacterMessageBuilder {
    dimensions: SceneDimensions;
    intl: IntlShape;

    constructor(dimensions: SceneDimensions, intl: IntlShape) {
        this.dimensions = dimensions;
        this.intl = intl;
    }

    buildMessage(event: CharacterEvent): ?Message {
        switch(event.type) {
            case 'hitWall':
                return new Message(this.buildHitWallMessage(event.x, event.y));
            default:
                return null;
        }
    }

    buildHitWallMessage(x: number, y: number): string {
        const columnLabel = this.dimensions.getColumnLabel(x);
        const rowLabel = this.dimensions.getRowLabel(y);
        return this.intl.formatMessage(
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
