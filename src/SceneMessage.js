// @flow

import Message from './Message';
import React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as CloseSceneMessageIcon } from './svg/CloseSceneMessage.svg';
import './SceneMessage.scss';

type SceneMessageProps = {
    intl: IntlShape,
    message: Message,
    onDismiss: () => void
};

class SceneMessage extends React.PureComponent<SceneMessageProps, {}> {
    render() {
        return (
            <div className='SceneMessage'>
                <div className='SceneMessage__text'>{this.props.message.text}</div>
                <div>
                    <button
                        className='SceneMessage__closeButton'
                        aria-label={this.props.intl.formatMessage({id:'SceneMessage.close'})}
                        onClick={this.props.onDismiss}
                    >
                        <CloseSceneMessageIcon/>
                    </button>
                </div>
            </div>
        );
    }
};

export default injectIntl(SceneMessage);
