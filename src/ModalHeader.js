// @flow

import React from 'react';
import { Modal } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import './ModalHeader.scss';

type ModalHeaderProps = {
    title: string,
    children?: any
};

class ModalHeader extends React.Component<ModalHeaderProps, {}> {
    render() {
        return (
            <Modal.Title className='ModalHeader'>
                {this.props.children}
                {this.props.title}
            </Modal.Title>
        );
    }
}

export default injectIntl(ModalHeader);
