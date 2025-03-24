// @flow

import React from 'react';
import AriaDisablingButton from './AriaDisablingButton';
import ProgramSequence from './ProgramSequence';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as ActionPanelBackground } from './svg/ActionPanel.svg';
import { ReactComponent as MovePreviousIcon } from './svg/MovePrevious.svg';
import { ReactComponent as MoveNextIcon } from './svg/MoveNext.svg';
import { ReactComponent as DeleteIcon } from './svg/Delete.svg';
import { ReactComponent as ReplaceIcon } from './svg/replace.svg';
import { focusByQuerySelector, isLoopBlock } from './Utils';
import './ActionPanel.scss';

type ActionPanelProps = {
    focusedOptionName: ?string,
    selectedActionName: ?string,
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

    makeAriaLabels() {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);

        let stepNumber = this.props.pressedStepIndex + 1;
        const cachedCurrentStepLoopData = currentStep.cache;
        if (cachedCurrentStepLoopData != null) {
            stepNumber = cachedCurrentStepLoopData.getContainingLoopPosition();
        }

        let stepActionName = '';
        if (currentStep.block === 'startLoop' || currentStep.block === 'endLoop') {
            stepActionName = this.props.intl.formatMessage(
                { id: 'Command.loop.label' },
                { loopLabel: currentStep.label }
            );
        } else {
            stepActionName = this.props.intl.formatMessage(
                { id: `Command.${currentStep.block}` }
            );
        }

        const replaceStepAriaLabel = this.props.selectedActionName != null ?
            this.props.intl.formatMessage(
                {id:'ActionPanel.action.replace.withSelectedAction'},
                { stepNumber, stepActionName, selectedActionName: this.props.intl.formatMessage({id: `Command.${this.props.selectedActionName}`}) }
            ) :
            this.props.intl.formatMessage({id:'ActionPanel.action.replace.noSelectedAction'}, { stepNumber, stepActionName });

        return {
            replaceStepAriaLabel,
            'deleteStepAriaLabel': this.props.intl.formatMessage({id:'ActionPanel.action.delete'}, { stepNumber, stepActionName }),
            'previousStepAriaLabel': this.makePreviousStepAriaLabel(stepNumber, stepActionName),
            'nextStepAriaLabel': this.makeNextStepAriaLabel(stepNumber, stepActionName)
        }
    }

    makePreviousStepAriaLabel(stepNumber: ?number | string, stepActionName: string): string {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (this.props.pressedStepIndex > 0) {
            const prevStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex - 1);
            const cachedPreviousStepLoopData = prevStep.cache;
            // When previous step is startLoop, aria-label communicates that movePrevious will move out of the current loop
            if (prevStep.block === 'startLoop' && currentStep.block !== 'endLoop') {
                return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep.outOfLoop'},
                    {
                        stepNumber,
                        stepActionName,
                        loopLabel: prevStep.label
                    }
                );
            // When previous step is endLoop, aria-label communicates that movePrevious will move into a loop
            } else if (prevStep.block === 'endLoop') {
                return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep.intoLoop'},
                    {
                        stepNumber,
                        stepActionName,
                        loopLabel: prevStep.label
                    }
                );
            } else {
                // When previous step is not loops and current step is endLoop, calculate the index the loop will move by
                // finding its pair startLoop block
                if (currentStep.block === 'endLoop') {
                    const startLoopIndex = this.props.programSequence.getMatchingLoopBlockIndex(this.props.pressedStepIndex);
                    const program = this.props.programSequence.getProgram();
                    if (startLoopIndex != null && program[startLoopIndex - 1] != null) {
                        return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep'},
                            {
                                stepNumber,
                                stepActionName,
                                previousStepNumber: startLoopIndex,
                                previousStepActionName: this.props.intl.formatMessage({id: `Command.${program[startLoopIndex - 1].block}`}),
                            }
                        )
                    }
                // When previous step is wrapped in a loop, aria-label communicates position within a loop
                } else if (cachedPreviousStepLoopData != null) {
                    return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep.withinLoop'},
                        {
                            stepNumber,
                            stepActionName,
                            previousStepNumber: cachedPreviousStepLoopData.getContainingLoopPosition(),
                            previousStepActionName: this.props.intl.formatMessage({id: `Command.${prevStep.block}`}),
                            loopLabel: cachedPreviousStepLoopData.getContainingLoopLabel(),
                        }
                    )
                // When previous step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep'},
                        {
                            stepNumber,
                            stepActionName,
                            previousStepNumber: this.props.pressedStepIndex,
                            previousStepActionName: this.props.intl.formatMessage({id: `Command.${prevStep.block}`})
                        }
                    );
                }
            }
        }
        return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToPreviousStep.disabled'},
            {
                stepNumber,
                stepActionName
            }
        );
    }

    makeNextStepAriaLabel(stepNumber: ?number | string, stepActionName: string): string {
        const currentStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex);
        if (this.props.pressedStepIndex < (this.props.programSequence.getProgramLength() - 1)) {
            const nextStep = this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex + 1);
            const cachedNextStepLoopData = nextStep.cache;
            // When next step is startLoop, aria-label communicates that moveNext will move into a loop
            if (nextStep.block === 'startLoop') {
                return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep.intoLoop'},
                    {
                        stepNumber,
                        stepActionName,
                        loopLabel: nextStep.label
                    }
                );
            // When next step is endLoop, aria-label communicates that moveNext will move out of the current loop
            } else if (nextStep.block === 'endLoop' && currentStep.block !== 'startLoop') {
                return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep.outOfLoop'},
                    {
                        stepNumber,
                        stepActionName,
                        loopLabel: nextStep.label
                    }
                );
            } else {
                // When next step is not loops and current step is startLoop, calculate the index the loop will move by
                // finding its pair endLoop block
                if (currentStep.block === 'startLoop') {
                    const endLoopIndex = this.props.programSequence.getMatchingLoopBlockIndex(this.props.pressedStepIndex);
                    const program = this.props.programSequence.getProgram();
                    if (endLoopIndex != null && program[endLoopIndex + 1] != null) {
                        return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep'},
                            {
                                stepNumber,
                                stepActionName,
                                nextStepNumber: endLoopIndex + 2,
                                nextStepActionName: this.props.intl.formatMessage({id: `Command.${program[endLoopIndex + 1].block}`}),
                            }
                        );
                    }
                // When next step is wrapped in a loop, aria-label communicates position within a loop
                } else if (cachedNextStepLoopData != null) {
                    return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep.withinLoop'},
                        {
                            stepNumber,
                            stepActionName,
                            nextStepNumber: cachedNextStepLoopData.getContainingLoopPosition(),
                            nextStepActionName: this.props.intl.formatMessage({id: `Command.${nextStep.block}`}),
                            loopLabel: cachedNextStepLoopData.getContainingLoopLabel()
                        }
                    );
                // When next step is a movements step and not in a loop, aria-label communicates position within the program
                } else {
                    return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep'},
                        {
                            stepNumber,
                            stepActionName,
                            nextStepNumber: this.props.pressedStepIndex + 2,
                            nextStepActionName: this.props.intl.formatMessage({id: `Command.${nextStep.block}`})
                        }
                    );
                }
            }
        }
        return this.props.intl.formatMessage({id: 'ActionPanel.action.moveToNextStep.disabled'},
            {
                stepNumber,
                stepActionName
            }
        );
    }

    getReplaceIsVisible(): boolean {
        return !isLoopBlock(this.props.programSequence.getProgramStepAt(this.props.pressedStepIndex).block);
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
        const ariaLabels = this.makeAriaLabels();
        const moveToNextStepIsDisabled = this.props.programSequence.moveToNextStepDisabled(this.props.pressedStepIndex);
        const moveToPreviousStepIsDisabled = this.props.programSequence.moveToPreviousStepDisabled(this.props.pressedStepIndex);
        const replaceIsVisible = this.getReplaceIsVisible();
        const replaceIsDisabled = this.props.selectedActionName == null;

        return (
            <React.Fragment>
                <div className="ActionPanel__background">
                    <ActionPanelBackground aria-hidden={true} />
                </div>
                <div
                    id='ActionPanel'
                    className={'ActionPanel__panel'}
                    data-actionpanelgroup={true}
                    ref={this.actionPanelRef}>
                    <AriaDisablingButton
                        name='deleteCurrentStep'
                        disabled={false}
                        aria-label={ariaLabels.deleteStepAriaLabel}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickDelete}>
                        <DeleteIcon
                            className='ActionPanel__action-button-svg'
                            aria-hidden={true}
                        />
                    </AriaDisablingButton>
                    {replaceIsVisible &&
                        <AriaDisablingButton
                            name='replaceCurrentStep'
                            disabled={replaceIsDisabled}
                            disabledClassName='ActionPanel__action-buttons--disabled'
                            aria-label={ariaLabels.replaceStepAriaLabel}
                            className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                            onClick={this.handleClickReplace}>
                            <ReplaceIcon
                                className='ActionPanel__action-button-svg'
                                aria-hidden={true}
                            />
                        </AriaDisablingButton>
                    }
                    <AriaDisablingButton
                        name='moveToPreviousStep'
                        disabled={moveToPreviousStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={ariaLabels.previousStepAriaLabel}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToPreviousStep}>
                        <MovePreviousIcon
                            className='ActionPanel__action-button-svg'
                            aria-hidden={true}
                        />
                    </AriaDisablingButton>
                    <AriaDisablingButton
                        name='moveToNextStep'
                        disabled={moveToNextStepIsDisabled}
                        disabledClassName='ActionPanel__action-buttons--disabled'
                        aria-label={ariaLabels.nextStepAriaLabel}
                        className='ActionPanel__action-buttons focus-trap-action-panel__action-panel-button'
                        onClick={this.handleClickMoveToNextStep}>
                        <MoveNextIcon
                            className='ActionPanel__action-button-svg'
                            aria-hidden={true}
                        />
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
