// @flow

import type { RunningState } from './types';
import React from 'react';

type LoopIterationsInputProps = {
    loopIterationsStr: string,
    loopLabel: string,
    stepNumber: number,
    runningState: RunningState,
    onChangeLoopIterations: (stepNumber: number, loopLabel: string, loopIterations: number) => void
};

type LoopIterationsInputState = {
    loopIterationsStr: string
};

export default class LoopIterationsInput extends React.Component<LoopIterationsInputProps, LoopIterationsInputState> {
    inputRef: { current: null | HTMLInputElement };

    constructor(props: LoopIterationsInputProps) {
        super(props);
        this.state = {
            loopIterationsStr: this.props.loopIterationsStr
        }
        this.inputRef = React.createRef();
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
        if (e.key === enterKey) {
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

    componentDidUpdate(prevProps: LoopIterationsInputProps) {
        if (this.props.runningState !== prevProps.runningState && this.props.runningState === 'stopped') {
            this.setState({loopIterationsStr: this.props.loopIterationsStr});
        }
    }

    // We use the 'componentWillUnmount' lifecycle method to ensure that
    // changes made to the loop iterations are not lost when the component is
    // unmounted. This could happen if the keyboard shortcut is used to play
    // the program with focus on a loop iteration text input: in this case,
    // this component will be unmounted and replaced with a read-only version,
    // but the value hasn't be propagated yet as focus has not been moved from
    // the input and Enter has not been pressed.
    //
    // If the component is unmounted with focus on the input control,
    // and the current value is valid, then propagate the value to the client.
    componentWillUnmount() {
        if (this.inputRef.current && this.inputRef.current === document.activeElement) {
            const loopIterationsValue = parseInt(this.inputRef.current.value, 10);
            if (this.isValidLoopIterations(loopIterationsValue)) {
                this.props.onChangeLoopIterations(this.props.stepNumber, this.props.loopLabel, loopIterationsValue);
            }
        }
    }

    render() {
        return (
            <input
                // TODO: ARIA label
                ref={this.inputRef}
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
