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

        // This controls which keys are displayed but also determines the order in which they are displayed.
        const keyBindings = [
            "?", "KeyA", "KeyB", "KeyE", "KeyI", "KeyP", "KeyR", "KeyS", "<", ">"
        ];

        const keyBindingElements = [];
        keyBindings.forEach((code, index) => {
            const itemKey = "binding-" + index;
            const labelKey = "binding-label-" + index;
            const iconMessageKey = "KeyboardInputModal.IconText." + code;
            const labelMessageKey = "KeyboardInputModal.Labels." + code;
            keyBindingElements.push(<div className="KeyboardInputModal__binding" key={itemKey}>
                <div className="KeyboardInputModal__binding__icon" aria-labelledby={labelKey}>
                    <FormattedMessage className="KeyboardInputModal__binding__icon" id={iconMessageKey} aria-labelledby={labelKey}/>
                </div>
                <div className="KeyboardInputModal__binding__label" id={labelKey}>
                    <FormattedMessage className="KeyboardInputModal__binding__label" id={labelMessageKey}/>
                </div>
            </div>);
        });
        return keyBindingElements;
    }

    render () {
        return(
            <Modal
                onHide={this.props.onHide}
                show={this.props.show}
                dialogClassName='KeyboardInputModal'
            >
                <Modal.Body className='KeyboardInputModal__content'>
                    <h2>
                        <FormattedMessage id='KeyboardInputModal.Title'/>
                    </h2>
                    <div>
                        {this.renderKeyBindings()}
                    </div>
                </Modal.Body>
            </Modal>);
    }
}

export default injectIntl(KeyboardInputModal);