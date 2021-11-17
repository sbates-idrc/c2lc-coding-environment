// @flow
import React from 'react';
import ModalHeader from './ModalHeader';
import ModalWithFooter from './ModalWithFooter';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import {ReactComponent as ShareIcon} from './svg/Share.svg'

import './ShareModal.scss';

type ShareCompleteModalProps = {
    intl: IntlShape,
    show: boolean,
    onCancel: () => void,
    onConfirm: () => void
};

class ShareCompleteModal extends React.Component<ShareCompleteModalProps, {}> {
    static defaultProps = {
        show: false,
        onCancel: () => {}
    }

    copyURL = () => {
        // Copy the URL to the clipboard, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
        if (navigator.clipboard) {
            navigator.clipboard.writeText(document.location.href);
        }
    }

    componentDidMount() {
        this.copyURL();
    }

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this.copyURL();
        }
    }

    render () {
        const buttonProperties = [{
            label: this.props.intl.formatMessage({id: 'ShareModal.cancel'}),
            onClick: this.props.onCancel,
            isPrimary: false
        }];

        return(
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'#ShareModal-copy'}
                focusOnCloseSelector={'.ProgramBlockEditor__program-deleteAll-button'}
                ariaLabel={this.props.intl.formatMessage({ id: 'ConfirmDeleteAllModal.title' })}
                onClose={this.props.onCancel}
                buttonProperties={buttonProperties}
            >
                <ModalHeader
                    id='ShareModal'
                    title={this.props.intl.formatMessage({
                        id: 'ShareModal.title'
                    })}
                >
                    <ShareIcon aria-hidden="true"/>
                </ModalHeader>

                <div className='ShareModal__content'>
                    <p><FormattedMessage id='ShareModal.description1' /></p>
                    <p><FormattedMessage id='ShareModal.description2' /></p>

                    <div className='ShareModal__form'>
                        <div className='ShareModal__form__URL__container'>
                            <div className='ShareModal__form__URL'>{document.location.href}</div>
                        </div>
                        <button
                            className='ShareModal__form__copyButton'
                            onClick={this.copyURL}
                            onKeyDown={this.handleKeyDown}
                        >
                            <FormattedMessage id='ShareModal.copy'/>
                        </button>
                    </div>

                </div>
            </ModalWithFooter>);
    }
}

export default injectIntl(ShareCompleteModal);