// @flow

import React, { useState } from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import classNames from 'classnames';
import './AddNode.scss';

type AddNodeProps = {
    expandedMode: boolean,
    programStepNumber: number,
    disabled: boolean,
    'aria-label': string,
    isDraggingCommand: boolean,
    onClick: (stepNumber: number) => void,
    onDrop: (stepNumber: number) => void
};

const AddNode = React.forwardRef<AddNodeProps, HTMLDivElement>(
    (props, ref) => {
        const [isDragOver, setIsDragOver] = useState(false);

        /* istanbul ignore next */
        const handleDragOver = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            if (props.isDraggingCommand) {
                e.preventDefault();
                setIsDragOver(true);
            }
        };

        const handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
            const stepNumber = parseInt(e.currentTarget.dataset.stepnumber, 10);
            props.onClick(stepNumber);
        };

        /* istanbul ignore next */
        const handleDrop = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (!props.disabled) {
                const stepNumber = parseInt(e.currentTarget.dataset.stepnumber, 10);
                props.onDrop(stepNumber);
            }
            setIsDragOver(false);
        };

        /* istanbul ignore next */
        const handleDragLeave = (e: SyntheticDragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsDragOver(false);
        };

        /* istanbul ignore next */
        const addNodeClasses = classNames(
            props.isDraggingCommand && 'AddNode--is-dragging-command'
        );

        if (props.expandedMode || (isDragOver && !props.disabled)) {
            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__expanded-drop-area'
                            data-stepnumber={props.programStepNumber}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </div>
                    <AriaDisablingButton
                        className='AddNode__expanded-button'
                        data-stepnumber={props.programStepNumber}
                        // $FlowFixMe: Use something less generic here.
                        ref={ref}
                        disabled={props.disabled}
                        aria-label={props['aria-label']}
                        onClick={handleClick}
                    >
                        <AddIcon />
                    </AriaDisablingButton>
                </div>
            );
        } else {
            return (
                <div className={addNodeClasses}>
                    <div className='AddNode__drop-area-container'>
                        <div className='AddNode__collapsed-drop-area'
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        />
                    </div>
                    <div className='AddNode__collapsed-icon'>
                        <AddIcon />
                    </div>
                </div>
            );
        }
    }
);

export default AddNode;
