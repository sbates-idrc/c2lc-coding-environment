// @flow

import React from 'react';
import './ModalHeader.scss';

type ModalHeaderProps = {
    id: string,
    title: string,
    children?: any
};

export default class ModalHeader extends React.Component<ModalHeaderProps, {}> {
    render() {
        return (
            <div className='ModalHeader modal-title h4' id={this.props.id}>
                {this.props.children}
                {this.props.title}
            </div>
        );
    }
}
