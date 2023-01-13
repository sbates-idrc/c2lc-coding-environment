// @flow

import React from 'react';
import classNames from 'classnames';
import './ModalBody.css';

type ModalBodyProps = {
    alwaysShowVerticalScrollbar?: boolean,
    children: any
};

class ModalBody extends React.Component<ModalBodyProps,{}> {
    render() {
        const modalBodyClassNames = classNames(
            'ModalBody',
            this.props.alwaysShowVerticalScrollbar && 'ModalBody--alwaysShowVerticalScrollbar'
        );
        return (
            <div className={modalBodyClassNames}>
                {this.props.children}
            </div>
        );
    }
}

export default ModalBody;
