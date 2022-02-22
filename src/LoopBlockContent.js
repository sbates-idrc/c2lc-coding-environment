// @flow

import React from 'react';

type LoopBlockContentProps = {
    commandName: string,
    disabled: boolean,
    loopIterations: string,
    loopLabel: ?string,
    stepNumber: number,
    onChangeLoopIterations: any
};

type LoopBlockContentState = {
    prevPropsLoopIterations: string,
    loopIterations: string
};

export default class LoopBlockContent extends React.Component<LoopBlockContentProps, LoopBlockContentState> {
    constructor(props: LoopBlockContentProps) {
        super(props);
        this.state = {
            prevPropsLoopIterations: this.props.loopIterations,
            loopIterations: this.props.loopIterations
        }
    }

    static getDerivedStateFromProps(props: LoopBlockContentProps, state: LoopBlockContentState) {
        if (props.loopIterations !== state.prevPropsLoopIterations) {
            const currentLoopIterations = props.loopIterations;
            return {
                prevPropsLoopIterationsLeft: currentLoopIterations,
                loopIterations: currentLoopIterations
            };
        } else {
            return null;
        }
    }

    handleChangeLoopIterations = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({loopIterations: e.currentTarget.value});
    }

    handleKeyDownLoopIterations = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey) {
            e.preventDefault();
            const loopIterationsValue = parseInt(e.currentTarget.value, 10);
            if (loopIterationsValue >= 0 && loopIterationsValue <= 99) {
                this.props.onChangeLoopIterations(this.state.loopIterations, this.props.stepNumber, this.props.loopLabel);
            } else {
                this.setState({loopIterations: this.props.loopIterations});
            }
        }
    }

    handleBlurLoopIterations = (e: SyntheticEvent<HTMLInputElement>) => {
        const loopIterationsValue = parseInt(e.currentTarget.value, 10);
        if (loopIterationsValue >= 0 && loopIterationsValue <= 99) {
            this.props.onChangeLoopIterations(this.state.loopIterations, this.props.stepNumber, this.props.loopLabel);
        } else {
            this.setState({loopIterations: this.state.prevPropsLoopIterations});
        }
    }

    render() {
        return (
            <div className='LoopBlockContent-container'>
                <div className='LoopBlockContent-loopLabelContainer'>
                    {this.props.loopLabel}
                </div>
                {this.props.commandName === 'startLoop' ?
                    <input
                        className='LoopBlockContent__loopIterations'
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.loopIterations}
                        onChange={!this.props.disabled ? this.handleChangeLoopIterations : () => {}}
                        onKeyDown={this.handleKeyDownLoopIterations}
                        onBlur={this.handleBlurLoopIterations} />:
                    <></>
                }
            </div>
        );
    }
}
