// @flow

import { findKeyboardEventSequenceMatches } from './KeyboardInputSchemes';
import type { ActionName, KeyboardInputSchemeName } from './KeyboardInputSchemes';
import type { RunningState } from './types';
import React from 'react';

type LoopIterationsInputProps = {
    loopIterations: number,
    loopIterationsLeft: ?number,
    loopLabel: string,
    stepNumber: number,
    runningState: RunningState,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    onChangeLoopIterations: (stepNumber: number, loopLabel: string, loopIterations: number) => void
};

type LoopIterationsInputState = {
    editStr: string,
    userHasChangedLoopIterations: boolean,
    runningState: RunningState
};

export default class LoopIterationsInput extends React.Component<LoopIterationsInputProps, LoopIterationsInputState> {
    inputRef: { current: null | HTMLInputElement };

    constructor(props: LoopIterationsInputProps) {
        super(props);
        this.state = {
            editStr: LoopIterationsInput.getInitialEditValueForRunningState(props),
            userHasChangedLoopIterations: false,
            runningState: props.runningState
        };
        this.inputRef = React.createRef();
    }

    static getInitialEditValueForRunningState(props: LoopIterationsInputProps): string {
        if (props.runningState === 'paused') {
            if (props.loopIterationsLeft != null) {
                return props.loopIterationsLeft.toString();
            } else {
                return '';
            }
        } else {
            return props.loopIterations.toString();
        }
    }

    static getDerivedStateFromProps(props: LoopIterationsInputProps, state: LoopIterationsInputState) {
        if (props.runningState !== state.runningState) {
            if (props.runningState === 'stopped' || props.runningState === 'paused') {
                return {
                    editStr: LoopIterationsInput.getInitialEditValueForRunningState(props),
                    userHasChangedLoopIterations: false,
                    runningState: props.runningState
                };
            } else {
                return {
                    runningState: props.runningState
                };
            }
        } else {
            return null;
        }
    }

    isRunning(): boolean {
        return !(this.props.runningState === 'stopped'
            || this.props.runningState === 'paused');
    }

    isValidLoopIterations(value: number) {
        return value >= 1 && value <= 99;
    }

    handleChange = () => {
        if (this.inputRef.current) {
            this.setState({
                editStr: this.inputRef.current.value,
                userHasChangedLoopIterations: true
            });
        }
    }

    handleClick = (e: Event) => {
        e.stopPropagation();
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter'
                || (this.state.userHasChangedLoopIterations && this.shouldPropagateValueForKeyboardEvent(e))) {
            e.preventDefault();
            if (this.inputRef.current) {
                const loopIterationsValue = parseInt(this.inputRef.current.value, 10);
                if (this.isValidLoopIterations(loopIterationsValue)) {
                    this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
                } else {
                    this.setState({
                        editStr: LoopIterationsInput.getInitialEditValueForRunningState(this.props),
                        userHasChangedLoopIterations: false
                    });
                }
            }
        }
    }

    handleBlur = () => {
        if (this.state.userHasChangedLoopIterations && this.inputRef.current) {
            const loopIterationsValue = parseInt(this.inputRef.current.value, 10);
            if (this.isValidLoopIterations(loopIterationsValue)) {
                this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
            } else {
                this.setState({
                    editStr: LoopIterationsInput.getInitialEditValueForRunningState(this.props),
                    userHasChangedLoopIterations: false
                });
            }
        }
    }

    // In addition to when the Enter key is pressed, we also propagate the loop
    // iterations value when keyboard shortcuts are used that will cause an
    // update (such as the Play shortcut), to ensure that changes are not lost.
    shouldPropagateValueForKeyboardEvent(e: KeyboardEvent) {
        // This implementation could result in the value being propagated in
        // some cases that are not update keyboard shortcuts. For simplicity we
        // do not reproduce the App's logic to track sequences. Rather, we test
        // each keyboard event independently. This approach could trigger
        // propagation of the value if one of the shortcuts that we look for
        // also appears as part of a sequence.

        const matchingKeyboardAction: ActionName | "partial" | false =
            findKeyboardEventSequenceMatches([e],
                this.props.keyboardInputSchemeName);

        return matchingKeyboardAction === ('addCommand': ActionName)
            || matchingKeyboardAction === ('addCommandToBeginning': ActionName)
            || matchingKeyboardAction === ('moveToNextStep': ActionName)
            || matchingKeyboardAction === ('moveToPreviousStep': ActionName)
            || matchingKeyboardAction === ('playPauseProgram': ActionName)
            || matchingKeyboardAction === ('stopProgram': ActionName);
    }

    componentDidMount() {
        if (this.inputRef.current) {
            this.inputRef.current.addEventListener('keydown', this.handleKeyDown);
        }
    }

    componentWillUnmount() {
        if (this.inputRef.current) {
            this.inputRef.current.removeEventListener('keydown', this.handleKeyDown);
        }
    }

    render() {
        return (
            <input
                // TODO: ARIA label
                ref={this.inputRef}
                className='command-block-loop-iterations'
                data-command='startLoop'
                data-controltype='programStep'
                data-stepnumber={this.props.stepNumber}
                maxLength='2'
                size='2'
                type='text'
                inputmode='decimal'
                value={this.isRunning() ? this.props.loopIterationsLeft : this.state.editStr}
                readOnly={this.isRunning()}
                onChange={this.handleChange}
                onClick={this.handleClick}
                onBlur={this.handleBlur}
            />
        );
    }
}
