// @flow
import React from 'react';
import { Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';

import './ShareCompleteModal.css';

type ShareCompleteModalProps = {
    intl: IntlShape,
    show: boolean,
    onHide: Function
};

class ShareCompleteModal extends React.Component<ShareCompleteModalProps, {}> {
    static defaultProps = {
        show: false,
        onHide: () => {}
    }

    render () {
        return(
            <Modal
                onHide={this.props.onHide}
                show={this.props.show}
                dialogClassName='ShareCompleteModal'
            >
                <Modal.Body className='ShareCompleteModal__content'>
                    <FormattedMessage id='ShareCompleteModal.shareComplete' />
                </Modal.Body>
            </Modal>);
    }
}

export default injectIntl(ShareCompleteModal);