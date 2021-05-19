// @flow
import React from 'react';
import { Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';

import './KeyboardInputModal.scss';

type KeyboardInputModalProps = {
    intl: IntlShape,
    show: boolean,
    onHide: Function
};

class KeyboardInputModal extends React.Component<KeyboardInputModalProps, {}> {

    static defaultProps = {
        show: false,
        onHide: () => {}
    }

    renderKeyBindings = () => {

        // TODO: Make this configurable and store the options in a separate file.
        // This controls which keys are displayed but also determines the order in which they are displayed.
        const keyBindings = [
            "showHide",
            "toggleAnnouncements",
            "addCommandToBeginning",
            "addCommandToEnd",
            "announceScene",
            "playPauseProgram",
            "refreshScene",
            "stopProgram",
            "decreaseProgramSpeed",
            "increaseProgramSpeed"
        ];

        const keyBindingElements = [];
        keyBindings.forEach((messageKeySuffix, index) => {
            const itemKey = "binding-" + index;
            const iconMessageKey = "KeyboardInputModal.IconText." + messageKeySuffix;
            const descriptionMessageKey = "KeyboardInputModal.Description." + messageKeySuffix;
            const keyNameMessageKey = "KeyboardInputModal.KeyName." + messageKeySuffix;
            const keyString = this.props.intl.formatMessage(
                { id: keyNameMessageKey }
            );
            keyBindingElements.push(<li className="KeyboardInputModal__binding" key={itemKey}>
                <div className="KeyboardInputModal__binding__icon" aria-hidden={true}>
                    <FormattedMessage className="KeyboardInputModal__binding__icon" id={iconMessageKey} aria-labelledby={iconMessageKey}/>
                </div>
                <div className="KeyboardInputModal__binding__label">
                    <FormattedMessage
                        className="KeyboardInputModal__binding__label" id={descriptionMessageKey}
                        values={{
                            key: keyString
                        }}
                    />
                </div>
            </li>);
        });
        return keyBindingElements;
    }

    render () {
        return(
            <Modal
                onHide={this.props.onHide}
                show={this.props.show}
                aria-modal={true}
                role="dialog"
                dialogClassName='KeyboardInputModal'
            >
                <Modal.Body className='KeyboardInputModal__content'>
                    <h2 className="KeyboardInputModal__content__title">
                        <FormattedMessage id='KeyboardInputModal.Title'/>
                    </h2>
                    <ul className="KeyboardInputModal__content__list">
                        {this.renderKeyBindings()}
                    </ul>
                </Modal.Body>
            </Modal>);
    }
}

export default injectIntl(KeyboardInputModal);