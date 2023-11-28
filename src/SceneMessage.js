// @flow

import React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as CloseSceneMessageIcon } from './svg/CloseSceneMessage.svg';
import './SceneMessage.scss';

type SceneMessageProps = {
    intl: IntlShape,
    message: string,
    onClose: () => void
};

class SceneMessage extends React.PureComponent<SceneMessageProps, {}> {
    render() {
        return (
            <div className='SceneMessage'>
                <div className='SceneMessage__text'>{this.props.message}</div>
                <div>
                    <button
                        className='SceneMessage__closeButton'
                        aria-label={this.props.intl.formatMessage({id:'SceneMessage.close'})}
                        onClick={this.props.onClose}
                    >
                        <CloseSceneMessageIcon/>
                    </button>
                </div>
            </div>
        );
    }
};

export default injectIntl(SceneMessage);
