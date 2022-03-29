// @flow

import { findKeyboardEventSequenceMatches } from './KeyboardInputSchemes';
import type { ActionName, KeyboardInputSchemeName } from './KeyboardInputSchemes';
import type { RunningState } from './types';
import React from 'react';

type LoopIterationsInputProps = {
    loopIterationsStr: string,
    loopLabel: string,
    stepNumber: number,
    runningState: RunningState,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    onChangeLoopIterations: (stepNumber: number, loopLabel: string, loopIterations: number) => void
};

type LoopIterationsInputState = {
    loopIterationsStr: string
};

export default class LoopIterationsInput extends React.Component<LoopIterationsInputProps, LoopIterationsInputState> {
    constructor(props: LoopIterationsInputProps) {
        super(props);
        this.state = {
            loopIterationsStr: this.props.loopIterationsStr
        }
    }

    isValidLoopIterations(value: number) {
        return value >= 1 && value <= 99;
    }

    handleChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({loopIterationsStr: e.currentTarget.value});
    }

    handleClick = (e: Event) => {
        e.stopPropagation();
    }

    handleKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey || this.isPlayShortcut(e)) {
            e.preventDefault();
            const loopIterationsValue = parseInt(e.currentTarget.value, 10);
            if (this.isValidLoopIterations(loopIterationsValue)) {
                this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
            } else {
                this.setState({loopIterationsStr: this.props.loopIterationsStr});
            }
        }
    }

    handleBlur = (e: SyntheticEvent<HTMLInputElement>) => {
        const loopIterationsValue = parseInt(e.currentTarget.value, 10);
        if (this.isValidLoopIterations(loopIterationsValue)) {
            this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
        } else {
            this.setState({loopIterationsStr: this.props.loopIterationsStr});
        }
    }

    // We propagate the loop iterations value when the Play keyboard shortcut
    // is pressed to ensure that changes are not lost when the Play shortcut is
    // used to run the program.
    //
    // Without this behaviour, when the Play keyboard shortcut is used with
    // focus on the LoopIterationsInput control changes could be lost because
    // the value hasn't be propagated yet as focus has not been moved from the
    // input and Enter has not been pressed.
    //
    // This implementation could result in the value being propagated in
    // some cases that are not the Play keyboard shortcut. For simplicity we
    // do not reproduce the App's logic to track sequences and test each
    // key event independently. This approach could trigger propagation of
    // the value if the Play shortcut also appears as part of another
    // sequence.
    isPlayShortcut(e: SyntheticKeyboardEvent<HTMLInputElement>) {
        const matchingKeyboardAction: ActionName | "partial" | false =
            findKeyboardEventSequenceMatches(
                [((e: any): KeyboardEvent)],
                this.props.keyboardInputSchemeName);
        return matchingKeyboardAction === 'playPauseProgram';
    }

    componentDidUpdate(prevProps: LoopIterationsInputProps) {
        if (this.props.runningState !== prevProps.runningState && this.props.runningState === 'stopped') {
            this.setState({loopIterationsStr: this.props.loopIterationsStr});
        }
    }

    render() {
        return (
            <input
                // TODO: ARIA label
                className='command-block-loop-iterations'
                maxLength='2'
                size='2'
                type='text'
                inputmode='decimal'
                value={this.state.loopIterationsStr}
                onChange={this.handleChange}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                onBlur={this.handleBlur}
            />
        );
    }
}
