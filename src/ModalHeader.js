// @flow

import React from 'react';
import { Modal } from 'react-bootstrap';
import './ModalHeader.scss';

type ModalHeaderProps = {
    title: string,
    children?: any
};

export default class ModalHeader extends React.Component<ModalHeaderProps, {}> {
    render() {
        return (
            <Modal.Title className='ModalHeader'>
                {this.props.children}
                {this.props.title}
            </Modal.Title>
        );
    }
}
