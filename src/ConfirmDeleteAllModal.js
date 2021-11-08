// @flow

import React from 'react';
import ModalHeader from './ModalHeader';
import ModalWithFooter from './ModalWithFooter';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import './ConfirmDeleteAllModal.scss';

type ConfirmDeleteAllModalProps = {
    intl: IntlShape,
    show: boolean,
    onCancel: () => void,
    onConfirm: () => void
};

class ConfirmDeleteAllModal extends React.Component<ConfirmDeleteAllModalProps, {}> {
    render() {
        return (
            <ModalWithFooter
                show={this.props.show}
                focusElementSelector={'#DeleteAll-done'}
                focusOnCloseSelector={'.ProgramBlockEditor__program-deleteAll-button'}
                ariaLabel={this.props.intl.formatMessage({id: 'ConfirmDeleteAllModal.confirmButton'})}
                onClose={this.props.onCancel}
                buttonProperties={
                    [
                        {label: this.props.intl.formatMessage({id: 'ConfirmDeleteAllModal.cancelButton'}), onClick: this.props.onCancel, isPrimary: false},
                        {id: 'DeleteAll-done', label: this.props.intl.formatMessage({id: 'ConfirmDeleteAllModal.confirmButton'}), onClick: this.props.onConfirm, isPrimary: true}
                    ]
                }>
                <ModalHeader
                    id='WorldSelector'
                    title={this.props.intl.formatMessage({
                        id: 'ConfirmDeleteAllModal.title'
                    })}>
                    <DeleteIcon aria-hidden='true' />
                </ModalHeader>
                <div className='ConfirmDeleteAllModal__content'>
                    <FormattedMessage id='ConfirmDeleteAllModal.content' />
                </div>
            </ModalWithFooter>
        );
    }
}

export default injectIntl(ConfirmDeleteAllModal);
