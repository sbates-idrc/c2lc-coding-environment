// @flow

import Message from './Message';
import React from 'react';
import './SceneMessage.css';

type SceneMessageProps = {
    message: Message,
    onDismiss: () => void
};

export default class SceneMessage extends React.PureComponent<SceneMessageProps, {}> {
    render() {
        return (
            <div className='SceneMessage'>
                <div>{this.props.message.text}</div>
                <button onClick={this.props.onDismiss}>dismiss</button>
            </div>
        );
    }
};
