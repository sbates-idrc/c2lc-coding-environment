// @flow

import { injectIntl, FormattedMessage } from 'react-intl';
import type {IntlShape} from 'react-intl';
import type {KeyboardInputSchemeName} from './KeyboardInputSchemes';
import type {AudioManager, RunningState, ThemeName, ProgramBlock} from './types';
import type { WorldName } from './Worlds';
import * as React from 'react';
import CharacterState from './CharacterState';
import ConfirmDeleteAllModal from './ConfirmDeleteAllModal';
import AddNode from './AddNode';
import ActionPanel from './ActionPanel';
import FocusTrapManager from './FocusTrapManager';
import CommandBlock from './CommandBlock';
import classNames from 'classnames';
import IconButton from './IconButton';
import ProgramSequence from './ProgramSequence';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as AddIcon } from './svg/Add.svg';
import { ReactComponent as DeleteAllIcon } from './svg/DeleteAll.svg';
import { getWorldCharacter } from './Worlds';
import './ProgramBlockEditor.scss';

// TODO: Send focus to Delete toggle button on close of Delete All confirmation
//       dialog

type ProgramBlockEditorProps = {
    intl: IntlShape,
    actionPanelStepIndex: ?number,
    actionPanelFocusedOptionName: ?string,
    characterState: CharacterState,
    editingDisabled: boolean,
    programSequence: ProgramSequence,
    runningState: RunningState,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioManager: AudioManager,
    focusTrapManager: FocusTrapManager,
    addNodeExpandedMode: boolean,
    theme: ThemeName,
    world: WorldName,
    // TODO: Remove onChangeProgramSequence once we have callbacks
    //       for each specific change
    onChangeProgramSequence: (programSequence: ProgramSequence) => void,
    onInsertSelectedActionIntoProgram: (index: number, selectedAction: ?string) => void,
    onDeleteProgramStep: (index: number, command: string) => void,
    onReplaceProgramStep: (index: number, selectedAction: ?string) => void,
    onMoveProgramStepNext: (indexFrom: number, commandAtIndexFrom: string) => void,
    onMoveProgramStepPrevious: (indexFrom: number, commandAtIndexFrom: string) => void,
    onChangeActionPanelStepIndexAndOption: (index: ?number, focusedOptionName: ?string) => void,
    onChangeAddNodeExpandedMode: (boolean) => void
};

type ProgramBlockEditorState = {
    showConfirmDeleteAll: boolean,
    closestAddNodeIndex: number,
    loopLabelOfFocusedLoopBlock: ?string
};

class ProgramIterator {
    constructor(program) {
        this.program = program;
        this.done = program.length === 0;
        this.stepNumber = 0;
        this.programBlock = program[0];
    }

    next() {
        if (this.stepNumber < this.program.length - 1) {
            this.stepNumber += 1;
            this.programBlock = this.program[this.stepNumber];
        } else {
            this.done = true;
        }
    }
}

export class ProgramBlockEditor extends React.Component<ProgramBlockEditorProps, ProgramBlockEditorState> {
    commandBlockRefs: Map<number, HTMLElement>;
    addNodeRefs: Map<number, HTMLElement>;
    focusCommandBlockIndex: ?number;
    focusAddNodeIndex: ?number;
    scrollToAddNodeIndex: ?number;
    updatedCommandBlockIndex: ?number;
    programSequenceContainerRef: { current: null | HTMLDivElement };
    lastCalculatedClosestAddNode: number;

    constructor(props: ProgramBlockEditorProps) {
        super(props);
        this.commandBlockRefs = new Map();
        this.addNodeRefs = new Map();
        this.focusCommandBlockIndex = null;
        this.focusAddNodeIndex = null;
        this.scrollToAddNodeIndex = null;
        this.updatedCommandBlockIndex = null;
        this.programSequenceContainerRef = React.createRef();
        this.lastCalculatedClosestAddNode = Date.now();
        this.state = {
            showConfirmDeleteAll : false,
            focusedActionPanelOptionName: null,
            closestAddNodeIndex: -1,
            loopLabelOfFocusedLoopBlock: null
        }
    }

    scrollProgramSequenceContainer(toElement: HTMLElement) {
        if (this.programSequenceContainerRef.current) {
            const containerElem = this.programSequenceContainerRef.current;
            if (toElement != null && toElement.dataset.stepnumber === '0') {
                containerElem.scrollTo(0, 0);
            } else if (toElement != null){
                const containerLeft = containerElem.getBoundingClientRect().left;
                const containerWidth = containerElem.clientWidth;
                const toElementLeft = toElement.getBoundingClientRect().left;
                const toElementRight = toElement.getBoundingClientRect().right;

                if (toElementRight > containerLeft + containerWidth) {
                    // toElement is outside of the container, on the right
                    containerElem.scrollLeft += toElementRight - containerLeft - containerWidth;
                } else if (toElementLeft < containerLeft) {
                    // toElement is outside of the container, on the left
                    containerElem.scrollLeft -= containerLeft - toElementLeft;
                }
            }
        }
    }

    commandIsSelected() {
        return this.props.selectedAction != null;
    }

    setUpdatedCommandBlock(index: number) {
        this.updatedCommandBlockIndex = index;
        // Remove the animation class, if it exists, from the current
        // block at the index, to ensure that the animation (re)starts from
        // the beginning.
        const element = this.commandBlockRefs.get(index);
        if (element) {
            element.classList.remove('ProgramBlockEditor__program-block--updated');
        }
    }

    focusCommandBlockAfterUpdate(index: number) {
        this.focusCommandBlockIndex = index;
    }

    focusAddNodeAfterUpdate(index: number) {
        this.focusAddNodeIndex = index;
    }

    scrollToAddNodeAfterUpdate(index: number) {
        this.scrollToAddNodeIndex = index;
    }

    programStepIsActive(programStepNumber: number) {
        if (this.props.runningState === 'running'
            || this.props.runningState === 'stopRequested'
            || this.props.runningState === 'pauseRequested') {
            return (this.props.programSequence.getProgramCounter()) === programStepNumber;
        } else {
            return false;
        }
    }

    closeActionPanel() {
        this.props.onChangeActionPanelStepIndexAndOption(null, null);
    }

    setCommandBlockRef(programStepNumber: number, element: ?HTMLElement) {
        if (element) {
            this.commandBlockRefs.set(programStepNumber, element);
        } else {
            this.commandBlockRefs.delete(programStepNumber);
        }
    }

    setAddNodeRef(programStepNumber: number, element: ?HTMLElement) {
        if (element) {
            this.addNodeRefs.set(programStepNumber, element);
        }
    }

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    findAddNodeClosestToEvent = (event: DragEvent): number => {
        // Find the nearest add node.
        let closestDistance = 100000;
        let closestAddNodeIndex = 0;

        this.addNodeRefs.forEach((addNode, index) => {
            const addNodeBounds = addNode.getBoundingClientRect();
            const nodeCenterX = addNodeBounds.left + (addNodeBounds.width / 2);
            const nodeCenterY = addNodeBounds.top + (addNodeBounds.height / 2);

            // TODO: Figure out how to make flow aware of this.
            const xDistanceSquared = Math.pow((event.clientX - nodeCenterX), 2);
            const yDistanceSquared = Math.pow((event.clientY - nodeCenterY), 2);;
            const distance = Math.sqrt(xDistanceSquared + yDistanceSquared);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestAddNodeIndex = index;
            }
        });
        return closestAddNodeIndex;
    };

    // Handlers

    handleClickDeleteAll = () => {
        this.props.audioManager.playAnnouncement('deleteAll', this.props.intl);
        this.setState({
            showConfirmDeleteAll : true
        });
    };

    handleCancelDeleteAll = () => {
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleConfirmDeleteAll = () => {
        this.props.onChangeProgramSequence(
            this.props.programSequence.updateProgram([])
        );
        this.setState({
            showConfirmDeleteAll : false
        });
    };

    handleActionPanelDeleteStep = (index: number) => {
        this.props.onDeleteProgramStep(index,
            this.props.programSequence.getProgramStepAt(index).block);
        this.closeActionPanel();
    };

    handleActionPanelReplaceStep = (index: number) => {
        this.props.onReplaceProgramStep(index, this.props.selectedAction);
    };

    handleActionPanelMoveToPreviousStep = (index: number) => {
        this.props.onMoveProgramStepPrevious(
            index,
            this.props.programSequence.getProgramStepAt(index).block
        );
    };

    handleActionPanelMoveToNextStep = (index: number) => {
        this.props.onMoveProgramStepNext(
            index,
            this.props.programSequence.getProgramStepAt(index).block
        );
    };

    handleClickStep = (e: SyntheticEvent<HTMLButtonElement>) => {
        const index = parseInt(e.currentTarget.dataset.stepnumber, 10);
        // Open or close the ActionPanel
        if (this.props.actionPanelStepIndex === index) {
            // The ActionPanel is already open for this program step, close it
            this.closeActionPanel();
        } else {
            // Otherwise, open it
            this.props.onChangeActionPanelStepIndexAndOption(index, null);
        }
    };

    handleChangeLoopIterations = (stepNumber: number, loopLabel: string, loopIterations: number) => {
        const programSequence = this.props.programSequence;
        if (programSequence.getProgram()[stepNumber].label === loopLabel) {
            const program = programSequence.getProgram().slice();
            const loopIterationsLeft = new Map(programSequence.getLoopIterationsLeft());
            program[stepNumber] = Object.assign(
                {},
                program[stepNumber],
                { iterations: loopIterations }
            );
            if (this.props.runningState !== 'stopped') {
                loopIterationsLeft.set(loopLabel, loopIterations);
            }
            this.props.onChangeProgramSequence(programSequence.updateProgramAndLoopIterationsLeft(program, loopIterationsLeft));
        }
    };

    handleFocusProgramBlock = (e: Event) => {
        // $FlowFixMe: property 'dataset' is missing in 'EventTarget'
        if (e.currentTarget.dataset.command === 'startLoop' || e.currentTarget.dataset.command === 'endLoop') {
            const loopLabel = this.props.programSequence.getProgramStepAt(
                parseInt(e.currentTarget.dataset.stepnumber, 10)
            ).label;
            if (loopLabel != null) {
                this.setState({
                    loopLabelOfFocusedLoopBlock: loopLabel
                });
            }
        }
    };

    handleBlurProgramBlock = (e: Event) => {
        // $FlowFixMe: property 'dataset' is missing in 'EventTarget'
        if (e.currentTarget.dataset.command === 'startLoop' || e.currentTarget.dataset.command === 'endLoop') {
            this.setState({
                loopLabelOfFocusedLoopBlock: null
            });
        }
    };

    handleProgramCommandBlockAnimationEnd = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.currentTarget.classList.remove('ProgramBlockEditor__program-block--updated');
    };

    handleClickAddNode = (stepNumber: number) => {
        this.props.onInsertSelectedActionIntoProgram(stepNumber,
            this.props.selectedAction);
    };

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDragCommandOverProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            event.preventDefault();

            // Only attempt to recalculate the closest node every 100ms.
            const timeStamp = Date.now();
            if (timeStamp - this.lastCalculatedClosestAddNode > 100) {
                const closestAddNodeIndex = this.findAddNodeClosestToEvent(event);
                this.lastCalculatedClosestAddNode = timeStamp;

                this.setState({
                    closestAddNodeIndex: closestAddNodeIndex
                });
            }
        }
    };

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDragLeaveOnProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            // Ignore drag leave events triggered by entering anything that we "contain".
            // We have to use two strategies depending on the browser (see below).

            // If the related target is null or undefined (hi, Safari!),
            // use the element bounds instead.
            // See: https://bugs.webkit.org/show_bug.cgi?id=66547
            if (event.relatedTarget == null) {
                // $FlowFixMe: Flow doesn't understand how we access the client bounds.
                const myBounds = this.programSequenceContainerRef.current.getBoundingClientRect();
                if (event.clientX <= myBounds.left ||
                    event.clientX >= (myBounds.left + myBounds.width) ||
                    event.clientY <= myBounds.top ||
                    event.clientY >= (myBounds.top + myBounds.height)) {
                    this.setState({
                        closestAddNodeIndex: -1
                    });
                }
            }
            // For everything else, we can just check to see if the element triggering the dragLeave event is one of
            // our descendents.
            // $FlowFixMe: Flow doesn't recognise the relatedTarget property.
            else if (!this.programSequenceContainerRef.current.contains(event.relatedTarget)) {
                this.setState({
                    closestAddNodeIndex: -1
                });
            }
        }
    };

    // TODO: Discuss removing this once we have a good way to test drag and drop.
    /* istanbul ignore next */
    handleDropCommandOnProgramArea = (event: DragEvent) => {
        if (!this.props.editingDisabled) {
            event.preventDefault();

            // Nothing should be highlighted once the drop completes.
            this.setState({
                closestAddNodeIndex: -1
            });

            const closestAddNodeIndex = this.findAddNodeClosestToEvent(event);
            this.props.onInsertSelectedActionIntoProgram(closestAddNodeIndex,
                this.props.selectedAction);
        }
    };

    /* istanbul ignore next */
    handleCloseActionPanelFocusTrap = () => {
        this.closeActionPanel();
    };

    // Rendering

    makeProgramBlock(programStepNumber: number, programBlock: ProgramBlock) {
        const active = this.programStepIsActive(programStepNumber);
        // When the runningState is 'paused', show the pause indicator on
        // programSequence.getProgramCounter(). And when the runningState is
        // 'pauseRequested', show the pause indicator on
        // programSequence.getProgramCounter() + 1, to indicate where the
        // program will pause when the running state transitions to 'paused'.
        // Showing the pause indicator on
        // programSequence.getProgramCounter() + 1 when in 'pauseRequested'
        // works because the next step after programSequence.getProgramCounter()
        // is the one with index programCounter + 1. This is currently true but
        // we will need to revisit this logic when we introduce control flow or
        // blocks into the language.
        const paused = (this.props.runningState === 'paused'
            && programStepNumber === this.props.programSequence.getProgramCounter())
            || (this.props.runningState === 'pauseRequested'
            && programStepNumber === this.props.programSequence.getProgramCounter() + 1
            && !this.props.programSequence.currentStepIsControlBlock());
        const hasActionPanelControl = this.props.actionPanelStepIndex === programStepNumber;
        const classes = classNames(
            'ProgramBlockEditor__program-block',
            active && 'ProgramBlockEditor__program-block--active',
            hasActionPanelControl && 'focus-trap-action-panel__program-block',
            paused && 'ProgramBlockEditor__program-block--paused'
        );
        const command = programBlock.block;
        const loopLabel = programBlock.label;
        const cachedLoopData = programBlock.cache;
        let ariaLabel = this.props.intl.formatMessage(
            { id: 'ProgramBlockEditor.command' },
            {
                index: programStepNumber + 1,
                command: this.props.intl.formatMessage(
                    {id: `Command.${command}`},
                    {loopLabel}
                )
            }
        );
        if (cachedLoopData != null &&
            cachedLoopData.get('containingLoopPosition') != null &&
            cachedLoopData.get('containingLoopLabel')) {
            ariaLabel = this.props.intl.formatMessage(
                { id: 'ProgramBlockEditor.nestedCommand' },
                {
                    index: cachedLoopData.get('containingLoopPosition'),
                    parentLoopLabel: cachedLoopData.get('containingLoopLabel'),
                    command: this.props.intl.formatMessage(
                        {id: `Command.${command}`},
                        {loopLabel}
                    )
                },
            );
        }

        let loopIterations = programBlock.iterations;

        // Show loopItertionsLeft when program is not stopped, or else, show iterations
        if (this.props.runningState !== 'stopped') {
            if (loopLabel != null && this.props.programSequence.getLoopIterationsLeft().get(loopLabel) != null) {
                loopIterations = this.props.programSequence.getLoopIterationsLeft().get(loopLabel);
            }
        }

        let key = `${programStepNumber}-${command}`;
        if ((command === 'startLoop' || command === 'endLoop') && loopLabel != null) {
            key=`${programStepNumber}-${command}-${loopLabel}`;
        }

        return (
            <CommandBlock
                commandName={command}
                // $FlowFixMe: Limit to specific types of ref.
                ref={ (element) => { this.setCommandBlockRef(programStepNumber, element) } }
                key={key}
                data-stepnumber={programStepNumber}
                data-controltype='programStep'
                data-command={command}
                data-actionpanelgroup={true}
                className={classes}
                loopLabel={programBlock.label}
                loopIterations={loopIterations}
                stepNumber={programStepNumber}
                aria-label={ariaLabel}
                aria-controls={hasActionPanelControl ? 'ActionPanel' : undefined}
                aria-expanded={hasActionPanelControl}
                disabled={this.props.editingDisabled}
                runningState={this.props.runningState}
                keyboardInputSchemeName={this.props.keyboardInputSchemeName}
                onClick={this.handleClickStep}
                onFocus={this.handleFocusProgramBlock}
                onBlur={this.handleBlurProgramBlock}
                onChangeLoopIterations={this.handleChangeLoopIterations}
                onAnimationEnd={this.handleProgramCommandBlockAnimationEnd}
            />
        );
    }

    makeProgramBlockWithPanel(programStepNumber: number, programBlock: ProgramBlock) {
        const showActionPanel = (this.props.actionPanelStepIndex === programStepNumber);
        return (
            <div className='ProgramBlockEditor__program-block-with-panel'>
                <div className='ProgramBlockEditor__action-panel-container-outer'>
                    {showActionPanel &&
                        <div className='ProgramBlockEditor__action-panel-container-inner'>
                            <ActionPanel
                                focusedOptionName={this.props.actionPanelFocusedOptionName}
                                selectedCommandName={this.props.selectedAction}
                                programSequence={this.props.programSequence}
                                pressedStepIndex={programStepNumber}
                                onDelete={this.handleActionPanelDeleteStep}
                                onReplace={this.handleActionPanelReplaceStep}
                                onMoveToPreviousStep={this.handleActionPanelMoveToPreviousStep}
                                onMoveToNextStep={this.handleActionPanelMoveToNextStep}/>
                        </div>
                    }
                </div>
                {this.makeProgramBlock(programStepNumber, programBlock)}
            </div>
        );
    }

    makeAddNodeAriaLabel(programStepNumber: number, isEndOfProgramAddNode: boolean) {
        const selectedAction = this.props.selectedAction;
        if (selectedAction != null) {
            if (isEndOfProgramAddNode) {
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.lastBlock' },
                    { command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}) }
                );
            } else if (programStepNumber === 0) {
                // The add node before the start of the program
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.beginningBlock' },
                    { command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}) }
                );
            } else {
                const prevCommand = this.props.programSequence.getProgramStepAt(programStepNumber - 1);
                const postCommand = this.props.programSequence.getProgramStepAt(programStepNumber);
                const prevCommandLabel = prevCommand.label ? prevCommand.label : null;
                const postCommandLabel = postCommand.label ? postCommand.label : null;
                return this.props.intl.formatMessage(
                    { id: 'ProgramBlockEditor.betweenBlocks' },
                    {
                        command: this.props.intl.formatMessage({id: `Command.${selectedAction}`}),
                        prevCommand: `${programStepNumber}, ${this.props.intl.formatMessage({id: `Command.${prevCommand.block}`}, {loopLabel: prevCommandLabel})}`,
                        postCommand: `${programStepNumber+1}, ${this.props.intl.formatMessage({id: `Command.${postCommand.block}`}, {loopLabel: postCommandLabel})}`
                    }
                );
            }
        } else {
            return this.props.intl.formatMessage(
                { id: 'ProgramBlockEditor.blocks.noCommandSelected'}
            );
        }
    }

    makeAddNode(programStepNumber: number) {
        return (
            <AddNode
                aria-label={this.makeAddNodeAriaLabel(programStepNumber, false)}
                ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                expandedMode={this.props.addNodeExpandedMode}
                isDraggingCommand={this.props.isDraggingCommand}
                programStepNumber={programStepNumber}
                closestAddNodeIndex={this.state.closestAddNodeIndex}
                disabled={
                    this.props.editingDisabled ||
                    (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                onClick={this.handleClickAddNode}
            />
        );
    }

    makeLoopContainer(startLoopIndex: number, endLoopIndex: number, loopLabel: string, content: any) {
        // Show the loop focused styling if:
        // - the start loop block or the end loop block has focus
        // - or, the ActionPanel is open for the start loop block or the end
        //   loop block
        const showLoopFocused =
            this.state.loopLabelOfFocusedLoopBlock === loopLabel
            || this.props.actionPanelStepIndex === startLoopIndex
            || this.props.actionPanelStepIndex === endLoopIndex;

        const classes = classNames(
            'ProgramBlockEditor__loopContainer',
            showLoopFocused && 'ProgramBlockEditor__loopContainer--focused'
        );

        return (
            <div className={classes}>
                <div className='ProgramBlockEditor__program-block-connector-loop' />
                {content}
                <div className='ProgramBlockEditor__program-block-connector-loop' />
            </div>
        );
    }

    renderLoop(programIterator) {
        const startLoopBlock = programIterator.programBlock;
        const startLoopIndex = programIterator.stepNumber;
        const loopLabel = startLoopBlock.label;

        // Consume the startLoop block
        programIterator.next();

        const loopContent = [
            this.makeProgramBlockWithPanel(startLoopIndex, startLoopBlock)
        ];

        while (!programIterator.done && programIterator.programBlock.block !== 'endLoop') {
            loopContent.push(this.renderNextSection(programIterator));
        }

        if (programIterator.programBlock.block === 'endLoop') {
            const endLoopBlock = programIterator.programBlock;
            const endLoopIndex = programIterator.stepNumber;

            // Consume the endLoop block
            programIterator.next();

            loopContent.push(<div className='ProgramBlockEditor__program-block-connector'/>);
            loopContent.push(this.makeAddNode(endLoopIndex));
            loopContent.push(<div className='ProgramBlockEditor__program-block-connector'/>);
            loopContent.push(this.makeProgramBlockWithPanel(endLoopIndex, endLoopBlock));

            return this.makeLoopContainer(
                startLoopIndex,
                endLoopIndex,
                loopLabel,
                loopContent
            );
        }
    }

    renderNextSection(programIterator) {
        if (programIterator.programBlock.block === 'startLoop') {
            const loopLabel = programIterator.programBlock.label;
            const startLoopIndex = programIterator.stepNumber;
            return (
                <React.Fragment key={`loopSection-${loopLabel}`}>
                    <div className='ProgramBlockEditor__program-block-connector'/>
                    {this.makeAddNode(startLoopIndex)}
                    <div className='ProgramBlockEditor__program-block-connector'/>
                    {this.renderLoop(programIterator)}
                </React.Fragment>
            );
        } else {
            const section = (
                <React.Fragment key={`programBlockSection-${programIterator.stepNumber}-${programIterator.programBlock}`}>
                    <div className='ProgramBlockEditor__program-block-connector'/>
                    {this.makeAddNode(programIterator.stepNumber)}
                    <div className='ProgramBlockEditor__program-block-connector' />
                    {this.makeProgramBlockWithPanel(programIterator.stepNumber, programIterator.programBlock)}
                </React.Fragment>
            );
            // Consume the block
            programIterator.next();
            return section;
        }
    }

    renderProgramSections() {
        const sections = [];
        const iterator = new ProgramIterator(this.props.programSequence.getProgram());

        while (!iterator.done) {
            sections.push(this.renderNextSection(iterator));
        }

        return sections;
    }

    makeEndOfProgramAddNodeSection(programStepNumber: number) {
        const isEmptyProgram = this.props.programSequence.getProgramLength() === 0;
        return (
            <React.Fragment key={'endOfProgramAddNodeSection'}>
                <div className='ProgramBlockEditor__program-block-connector'/>
                <AddNode
                    aria-label={this.makeAddNodeAriaLabel(programStepNumber, !isEmptyProgram)}
                    ref={ (element) => this.setAddNodeRef(programStepNumber, element) }
                    expandedMode={true}
                    isDraggingCommand={this.props.isDraggingCommand}
                    programStepNumber={programStepNumber}
                    closestAddNodeIndex={this.state.closestAddNodeIndex}
                    disabled={
                        this.props.editingDisabled ||
                        (!this.commandIsSelected() && !this.props.isDraggingCommand)}
                    onClick={this.handleClickAddNode}
                />
            </React.Fragment>
        )
    }

    render() {
        const contents = this.renderProgramSections();
        contents.push(this.makeEndOfProgramAddNodeSection(this.props.programSequence.getProgramLength()));

        const character = getWorldCharacter(this.props.theme, this.props.world);

        return (
            <div className='ProgramBlockEditor__container'>
                <div className='ProgramBlockEditor__header'>
                    <h2 className='ProgramBlockEditor__heading'>
                        <FormattedMessage id='ProgramBlockEditor.programHeading' />
                    </h2>
                    <div className='ProgramBlockEditor__options'>
                        <ToggleSwitch
                            ariaLabel={this.props.intl.formatMessage({id:'ProgramBlockEditor.toggleAddNodeExpandMode'})}
                            value={this.props.addNodeExpandedMode}
                            onChange={this.props.onChangeAddNodeExpandedMode}
                            contentsTrue={<AddIcon />}
                            contentsFalse={<AddIcon />}
                            className='ProgramBlockEditor__add-node-toggle-switch'
                        />
                        <span className='ProgramBlockEditor__program-deleteAll'>
                            <IconButton
                                ariaLabel={this.props.intl.formatMessage({id:'ProgramBlockEditor.program.deleteAll'})}
                                className='ProgramBlockEditor__program-deleteAll-button'
                                disabledClassName='ProgramBlockEditor__program-deleteAll-button--disabled'
                                disabled={this.props.editingDisabled}
                                onClick={this.handleClickDeleteAll}
                                key='deleteButton'
                            >
                                <DeleteAllIcon className='ProgramBlockEditor__program-deleteAll-button-svg'/>
                            </IconButton>
                        </span>
                    </div>
                </div>
                <div className='ProgramBlockEditor__character-column'>
                    <div
                        aria-hidden='true'
                        className={`ProgramBlockEditor__character-column-character-container
                            ProgramBlockEditor__character-column-character-container--${this.props.world}`}
                        role='img'>
                        {React.createElement(
                            character,
                            { className: 'ProgramBlockEditor__character-column-character' }
                        )}
                    </div>
                </div>
                <div
                    className={'ProgramBlockEditor__program-sequence-scroll-container' + (!this.props.editingDisabled && this.props.isDraggingCommand ? ' ProgramBlockEditor__program-sequence-scroll-container--isDragging': '') }
                    ref={this.programSequenceContainerRef}
                    onDragOver={this.handleDragCommandOverProgramArea}
                    onDragLeave={this.handleDragLeaveOnProgramArea}
                    onDrop={this.handleDropCommandOnProgramArea}
                >
                    <div className='ProgramBlockEditor__program-sequence'>
                        <h3 className='sr-only' >
                            <FormattedMessage id='ProgramSequence.heading' />
                        </h3>
                        <div className='ProgramBlockEditor__start-indicator'></div>
                        {contents}
                    </div>
                </div>
                <ConfirmDeleteAllModal
                    show={this.state.showConfirmDeleteAll}
                    onCancel={this.handleCancelDeleteAll}
                    onConfirm={this.handleConfirmDeleteAll}/>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.scrollToAddNodeIndex != null) {
            const element = this.addNodeRefs.get(this.scrollToAddNodeIndex);
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
            }
            this.scrollToAddNodeIndex = null;
        }
        if (this.focusCommandBlockIndex != null) {
            const element = this.commandBlockRefs.get(this.focusCommandBlockIndex);
            if (element) {
                element.focus();
            }
            this.focusCommandBlockIndex = null;
        }
        if (this.focusAddNodeIndex != null) {
            const addNode = this.addNodeRefs.get(this.focusAddNodeIndex);
            if (addNode) {
                addNode.focus();
            }
            this.focusAddNodeIndex = null;
        }
        if (this.updatedCommandBlockIndex != null) {
            const element = this.commandBlockRefs.get(this.updatedCommandBlockIndex);
            if (element) {
                element.classList.add('ProgramBlockEditor__program-block--updated');
            }
            this.updatedCommandBlockIndex = null;
        }
        if (this.props.runningState === 'running') {
            const activeProgramStepNum = this.props.programSequence.getProgramCounter();

            const activeProgramStep = this.commandBlockRefs.get(activeProgramStepNum);
            const nextProgramStep = this.commandBlockRefs.get(activeProgramStepNum + 1);
            const lastAddNode = this.addNodeRefs.get(this.props.programSequence.getProgramLength());
            if (activeProgramStep && activeProgramStepNum === 0) {
                this.scrollProgramSequenceContainer(activeProgramStep);
            } else if (nextProgramStep) {
                this.scrollProgramSequenceContainer(nextProgramStep);
            } else if (lastAddNode){
                this.scrollProgramSequenceContainer(lastAddNode);
            }
        }
        if (this.props.actionPanelStepIndex != null) {
            this.props.focusTrapManager.setFocusTrap(
                this.handleCloseActionPanelFocusTrap,
                [
                    '.focus-trap-action-panel__program-block',
                    '.focus-trap-action-panel__action-panel-button'
                ],
                '.focus-trap-action-panel__program-block'
            );
        } else {
            this.props.focusTrapManager.unsetFocusTrap();
        }
    }
}

export default injectIntl(ProgramBlockEditor, { forwardRef: true });
