// @flow

import React from 'react';

type LoopBlockContentProps = {
    commandName: string,
    disabled: boolean,
    loopIterationsLeft: string,
    loopLabel: ?string,
    stepNumber: string,
    onChangeLoopIterations: any
};

type LoopBlockContentState = {
    loopIterations: string
};

export default class LoopBlockContent extends React.Component<LoopBlockContentProps, LoopBlockContentState> {
    constructor(props: LoopBlockContentProps) {
        super(props);
        this.state = {
            loopIterations: this.props.loopIterationsLeft
        }
    }

    handleChangeLoopCounter = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({loopIterations: e.currentTarget.value});
    }

    handleKeyDownLoopIterations = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey) {
            e.preventDefault();
            const loopIterationsValue = e.currentTarget.value;
            if (loopIterationsValue >= '0' && loopIterationsValue <= '99') {
                this.props.onChangeLoopIterations(this.state.loopIterations, this.props.stepNumber, this.props.loopLabel);
            } else {
                this.setState({loopIterations: this.props.loopIterationsLeft});
            }
        }
    }

    handleBlurLoopIterations = (e: SyntheticEvent<HTMLInputElement>) => {
        const loopIterationsValue = e.currentTarget.value;
        if (loopIterationsValue >= '0' && loopIterationsValue <= '99') {
            this.props.onChangeLoopIterations(this.state.loopIterations, this.props.stepNumber, this.props.loopLabel);
        } else {
            this.setState({loopIterations: this.props.loopIterationsLeft});
        }
    }

    render() {
        return (
            <div className='command-block-loop-block-container'>
                <div className='command-block-loop-label-container'>
                    {this.props.loopLabel}
                </div>
                {this.props.commandName === 'startLoop' ?
                    <input
                        className='command-block-loop-counter'
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.loopIterations}
                        onChange={!this.props.disabled ? this.handleChangeLoopCounter : () => {}}
                        onKeyDown={this.handleKeyDownLoopIterations}
                        onBlur={this.handleBlurLoopIterations} />:
                    <></>
                }
            </div>
        );
    }

    componentDidUpdate(prevProps: LoopBlockContentProps) {
        if (prevProps.loopIterationsLeft !== this.props.loopIterationsLeft) {
            this.setState({
                loopIterations: this.props.loopIterationsLeft
            });
        }
    }
}
