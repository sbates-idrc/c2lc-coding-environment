// @flow

import React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import './Modal.scss';

type ModalProps = {
    show: boolean,
    focusElementSelector: string,
    focusOnCloseSelector: string,
    ariaLabel: ?string,
    ariaLabelledById: ?string,
    ariaDescribedById: ?string,
    children: any,
    onClose: () => void
};

class Modal extends React.Component<ModalProps, {}> {
    constructor(props: ModalProps) {
        super(props);
        this.modalRef = React.createRef();
        this.lastFocus = document.querySelector(this.props.focusElementSelector);
        this.ignoreFocusChanges = false;
    }

    focusFirstDescendant = (element) => {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusFirstDescendant(child)
            ) {
                return true;
            }
        }
        return false;
    };

    focusLastDescendant = (element) => {
        for (let i = element.childNodes.length - 1; i >= 0; i--) {
            const child = element.childNodes[i];
            if (this.attemptFocus(child) ||
                this.focusLastDescendant(child)
            ) {
                return true;
            }
        }
        return false;
    };

    attemptFocus = (element) => {
        this.ignoreFocusChanges = true;
        try {
            element.focus();
        }
        catch (e) {
            return false;
        }
        this.ignoreFocusChanges = false;
        return (document.activeElement === element);
    };

    handleFocusTrap = (event: Event) => {
        if (this.ignoreFocusChanges) {
            return;
        }
        if (this.modalRef.current.contains(event.target)) {
            this.lastFocus = event.target;
        } else {
            this.focusFirstDescendant(this.modalRef.current);
            if (this.lastFocus === document.activeElement) {
                this.focusLastDescendant(this.modalRef.current);
            }
            this.lastFocus = document.activeElement;
        }
    }

    handleOnClose = () => {
        document.body.classList.remove('modal-opened');
        const focusElementOnClose = document.querySelector(this.props.focusOnCloseSelector);
        this.props.onClose();
        if (focusElementOnClose) {
            focusElementOnClose.focus();
        }
    }

    handleOnPressEscapeKey = (event: Event) => {
        if (event.key === 'Escape') {
            this.handleOnClose();
        }
    }

    handleOnClickBackdrop = (event: Event) => {
        if (!this.modalRef.current.contains(event.target)) {
            this.handleOnClose();
        }
    }

    render() {
        const backdropClass = classNames(
            'Modal__backdrop',
            this.props.show && 'active'
        );
        return (
            <div
                className={backdropClass}
                onFocus={this.handleFocusTrap}
                onKeyDown={this.handleOnPressEscapeKey}
                onClick={this.handleOnClickBackdrop}>
                <div tabIndex='0' />
                <div
                    ref={this.modalRef}
                    className="Modal"
                    role='dialog'
                    aria-label={this.props.ariaLabel ? this.props.ariaLabel : undefined}
                    aria-labelledby={this.props.ariaLabelledById ? this.props.ariaLabelledById : undefined}
                    aria-describedby={this.props.ariaDescribedById ? this.props.ariaDescribedById : undefined}
                    aria-modal='true'>
                    {this.props.children}
                </div>
                <div tabIndex='0' />
            </div>
        );
    }

    componentDidUpdate(prevProps: ModalProps) {
        if (this.props.show !== prevProps.show && this.props.show) {
            document.body.classList.add('modal-opened');
            const focusElement = document.querySelector(this.props.focusElementSelector);
            if (focusElement) {
                try {
                    focusElement.focus();
                } catch (e) {
                }
                this.lastFocus = focusElement;
            } else {
                this.focusFirstDescendant(this.modalRef.current);
            }
        }
    }
}

export default injectIntl(Modal);
