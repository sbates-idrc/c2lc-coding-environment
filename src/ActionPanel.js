// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import ProgramSequence from './ProgramSequence';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import {ReactComponent as ActionPanelBackground} from './svg/ActionPanel.svg';
import { ReactComponent as MovePreviousIcon } from './svg/MovePrevious.svg';
import { ReactComponent as MoveNextIcon } from './svg/MoveNext.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import { focusByQuerySelector } from './Utils';
import './ActionPanel.scss';

type ActionPanelProps = {
    focusedOptionName: ?string,
    selectedCommandName: ?string,
    programSequence: ProgramSequence,
    pressedStepIndex: number,
    intl: IntlShape,
    onDelete: (index: number) => void,
    onReplace: (index: number) => void,
    onMoveToPreviousStep: (index: number) => void,
    onMoveToNextStep: (index: number) => void
};

class ActionPanel extends React.Component<ActionPanelProps, {}> {
    actionPanelRef: { current: null | HTMLDivElement };

    constructor(props: ActionPanelProps) {
        super(props);
        this.actionPanelRef = React.createRef();
    }

    makeStepInfoMessage() {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);
        let stepName = '';
        if (currentStep.block === 'startLoop' || currentStep.block === 'endLoop') {
            stepName = this.props.intl.formatMessage(
                { id: 'Command.loop.label' },
                { loopLabel: currentStep.label }
            );
        } else {
            stepName = this.props.intl.formatMessage(
                { id: `Command.${currentStep.block}` }
            );
        }
        const ariaLabelObj = {
            'stepNumber': currentStep.currentLoopPosition ? currentStep.currentLoopPosition : this.props.pressedStepIndex + 1,
            'stepName': stepName,
            'selectedCommandName': '',
            'previousStepInfo': '',
            'nextStepInfo': ''
        };

        if (this.props.selectedCommandName) {
            ariaLabelObj['selectedCommandName'] =
                this.props.intl.formatMessage(
                    { id: 'ActionPanel.selectedCommandName' },
                    { selectedCommandName:
                        this.props.intl.formatMessage({id: `Command.${this.props.selectedCommandName}`})
                    }
                );
        }

        // Swap with previous step

        if (this.props.pressedStepIndex > 0) {
            const prevStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex - 1)
            const prevStepName = prevStep.block;
            // When previous step is startLoop, aria-label communicates that movePrevious will move out of the current loop
            if (prevStepName === 'startLoop' && currentStep.block !== 'endLoop') {
                ariaLabelObj['previousStepInfo'] =
                    this.props.intl.formatMessage(
                        { id: 'CommandInfo.previousStep.startLoop' },
                        { loopLabel: prevStep.label }
                    );
            // When previous step is endLoop, aria-label communicates that movePrevious will move into a loop
            } else if (prevStepName === 'endLoop') {
                ariaLabelObj['previousStepInfo'] =
                    this.props.intl.formatMessage(
                        { id: 'CommandInfo.previousStep.endLoop'},
                        { loopLabel: prevStep.label }
                    );
            } else {
                // When previous step is not loops and current step is endLoop, calculate the index the loop will move by
                // finding its pair startLoop block
                if (currentStep.block === 'endLoop') {
                    const program = this.props.programSequence.getProgram();
                    let startLoopIndex = 0;
                    for (let i = 0; i < this.props.pressedStepIndex; i++) {
                        if (program[i].block === 'startLoop' && program[i].label === currentStep.label) {
                            startLoopIndex = i;
                            break;
                        }
                    }
                    if (program[startLoopIndex - 1] != null) {
                        ariaLabelObj['previousStepInfo'] =
                            this.props.intl.formatMessage(
                                { id: 'CommandInfo.previousStep.loop' },
                                {
                                    previousStepNumber: startLoopIndex,
                                    command: this.props.intl.formatMessage({id: `Command.${program[startLoopIndex - 1].block}`})
                                }
                            )
                    }
                // When previous step is wrapped in a loop, aria-label communicates position within a loop
                } else if (prevStep.currentLoopPosition != null && prevStep.parentLoop != null) {
                    ariaLabelObj['previousStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'CommandInfo.previousStep.inLoop'},
                            {
                                previousStepNumber: prevStep.currentLoopPosition,
                                command: this.props.intl.formatMessage({id: `Command.${prevStepName}`}),
                                loopLabel: prevStep.parentLoop
                            }
                        )
                // When previous step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    ariaLabelObj['previousStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'CommandInfo.previousStep'},
                            {
                                previousStepNumber: this.props.pressedStepIndex,
                                command: this.props.intl.formatMessage({id: `Command.${prevStepName}`})
                            }
                        );
                }
            }
        }

        // Swap with next step

        if (this.props.pressedStepIndex < (this.props.programSequence.getProgramLength() - 1)) {
            const nextStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex + 1);
            const nextStepName = nextStep.block;
            // When next step is startLoop, aria-label communicates that moveNext will move into a loop
            if (nextStepName === 'startLoop') {
                ariaLabelObj['nextStepInfo'] =
                    this.props.intl.formatMessage(
                        { id: 'CommandInfo.nextStep.startLoop'},
                        { loopLabel: nextStep.label }
                    );
            // When next step is endLoop, aria-label communicates that moveNext will move out of the current loop
            } else if (nextStepName === 'endLoop' && currentStep.block !== 'startLoop') {
                ariaLabelObj['nextStepInfo'] =
                    this.props.intl.formatMessage(
                        { id: 'CommandInfo.nextStep.endLoop'},
                        { loopLabel: nextStep.label }
                    );
            }else {
                // When next step is not loops and current step is startLoop, calculate the index the loop will move by
                // finding its pair endLoop block
                if (currentStep.block === 'startLoop') {
                    const program = this.props.programSequence.getProgram();
                    let endLoopIndex = 0;
                    for (let i = this.props.pressedStepIndex + 1; i < program.length; i++) {
                        if (program[i].block === 'endLoop' && program[i].label === currentStep.label) {
                            endLoopIndex = i;
                            break;
                        }
                    }
                    if (program[endLoopIndex + 1] != null) {
                        ariaLabelObj['nextStepInfo'] =
                            this.props.intl.formatMessage(
                                { id: 'CommandInfo.nextStep.loop' },
                                {
                                    nextStepNumber: endLoopIndex + 2,
                                    command: this.props.intl.formatMessage({id: `Command.${program[endLoopIndex + 1].block}`})
                                }
                            )
                    }
                // When next step is wrapped in a loop, aria-label communicates position within a loop
                } else if (nextStep.currentLoopPosition != null && nextStep.parentLoop != null) {
                    ariaLabelObj['nextStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'CommandInfo.nextStep.inLoop'},
                            {
                                nextStepNumber: nextStep.currentLoopPosition,
                                command: this.props.intl.formatMessage({id: `Command.${nextStepName}`}),
                                loopLabel: nextStep.parentLoop
                            }
                        );
                // When next step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    ariaLabelObj['nextStepInfo'] =
                        this.props.intl.formatMessage(
                            { id: 'CommandInfo.nextStep'},
                            {
                                nextStepNumber: this.props.pressedStepIndex + 2,
                                command: this.props.intl.formatMessage({id: `Command.${nextStep.block}`})
                            }
                        );
                }
            }
        }

        return ariaLabelObj;
    }

    getMoveToNextStepDisabled(): boolean {
        const programSequence = this.props.programSequence;
        const programLastIndex = programSequence.getProgramLength() - 1;
        const { block, label } = programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (block === 'startLoop') {
            const lastProgramStep = programSequence.getProgramStepAt(programLastIndex);
            if (lastProgramStep.block === 'endLoop' && lastProgramStep.label === label) {
                return true;
            }
        }
        return this.props.pressedStepIndex === programLastIndex;
    }

    getMoveToPreviousStepDisabled(): boolean {
        const programSequence = this.props.programSequence;
        const { block, label } = programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (block === 'endLoop') {
            const firstProgramStep = programSequence.getProgramStepAt(0);
            if (firstProgramStep.block === 'startLoop' && firstProgramStep.label === label) {
                return true;
            }
        }
        return this.props.pressedStepIndex === 0;
    }

    // handlers

    handleClickDelete = () => {
        this.props.onDelete(this.props.pressedStepIndex);
    };

    handleClickReplace = () => {
        this.props.onReplace(this.props.pressedStepIndex);
    };

    handleClickMoveToPreviousStep = () => {
        this.props.onMoveToPreviousStep(this.props.pressedStepIndex);
    };

    handleClickMoveToNextStep = () => {
        this.props.onMoveToNextStep(this.props.pressedStepIndex);
    };

    render() {
        const stepInfoMessage = this.makeStepInfoMessage();
        const moveToNextStepIsDisabled = this.getMoveToNextStepDisabled();
        const moveToPreviousStepIsDisabled = this.getMoveToPreviousStepDisabled();
        return (
            <React.Fragment>
                <div className="ActionPanel__background">
                    <ActionPanelBackground/>
                </div>
                <div
                    id='ActionPanel'
                    className={'ActionPanel__panel'}
                    data-actionpanelgroup={true}
                    ref={this.actionPanelRef}>
                    <AriaDisablingButton
                        name='deleteCurrentStep'
                        disabled={false}
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickDelete}>
                        <DeleteIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='replaceCurrentStep'
                        disabled={false}
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.replace'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button focus-trap-action-panel-replace__replace_button'
                        onClick={this.handleClickReplace}>
                        <ReplaceIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToPreviousStep'
                        disabled={moveToPreviousStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToPreviousStep'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToPreviousStep}>
                        <MovePreviousIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToNextStep'
                        disabled={moveToNextStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={this.props.intl.formatMessage({id:'ActionPanel.action.moveToNextStep'}, stepInfoMessage)}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToNextStep}>
                        <MoveNextIcon className='ActionPanel__action-button-svg' />
                    </AriaDisablingButton>
                </div>
            </React.Fragment>

        )
    }

    componentDidMount() {
        const element = this.actionPanelRef.current;
        if (element && element.scrollIntoView) {
            element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            if (this.props.focusedOptionName != null) {
                focusByQuerySelector(`[name="${this.props.focusedOptionName}"]`);
            }
        }
    }
}

export default injectIntl(ActionPanel);
