// @flow

import type { IntlShape } from 'react-intl';

// TODO: Change message key, there is no CharacterMessageBuilder now

export default class EndOfSceneMessage {
    getMessage(intl: IntlShape): string {
        return intl.formatMessage(
            {
                id:'CharacterMessageBuilder.endOfScene'
            }
        );
    }
};
