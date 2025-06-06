// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import DisallowedActionsSerializer from './DisallowedActionsSerializer';
import ActionsHandler from './ActionsHandler';
import AnnouncementBuilder from './AnnouncementBuilder';
import AudioManagerImpl from './AudioManagerImpl';
import CharacterAriaLive from './CharacterAriaLive';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CharacterStateSerializer from './CharacterStateSerializer';
import CharacterPositionController from './CharacterPositionController';
import classNames from 'classnames';
import CommandPaletteCommand from './CommandPaletteCommand';
import C2lcURLParams from './C2lcURLParams';
import CustomBackground from './CustomBackground';
import CustomBackgroundDesignModeButton from './CustomBackgroundDesignModeButton';
import CustomBackgroundSerializer from './CustomBackgroundSerializer';
import DesignModeCursorDescriptionBuilder from './DesignModeCursorDescriptionBuilder';
import DesignModeCursorState from './DesignModeCursorState';
import * as FeatureDetection from './FeatureDetection';
import FakeAudioManager from './FakeAudioManager';
import FocusTrapManager from './FocusTrapManager';
import IconButton from './IconButton';
import Interpreter from './Interpreter';
import LanguageSelector from "./LanguageSelector";
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import RefreshButton from './RefreshButton';
import Scene from './Scene';
import SceneDimensions from './SceneDimensions';
import SoundOptionsModal from './SoundOptionsModal';
import StopButton from './StopButton';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import ProgramSequence from './ProgramSequence';
import ProgramSpeedController from './ProgramSpeedController';
import ProgramSerializer from './ProgramSerializer';
import ActionsSimplificationModal from './ActionsSimplificationModal';
import type { TileCode } from './TileData';
import type { ActionToggleRegister, AudioManager, CommandName, DisplayedCommandName, LanguageTag, RunningState, ThemeName, UserMessage } from './types';
import type { WorldName } from './Worlds';
import { getWorldProperties } from './Worlds';
import WorldSelector from './WorldSelector';
import * as Utils from './Utils';
import './App.scss';
import './AppCustomBackgroundDesignMode.css';
import './Themes.scss';
import './vendor/dragdroptouch/DragDropTouch.js';
import ThemeSelector from './ThemeSelector';
import TilePanel from './TilePanel';
import { ReactComponent as HiddenBlock } from './svg/Hidden.svg';
import KeyboardInputModal from './KeyboardInputModal';
import ShareModal from './ShareModal';
import { ReactComponent as ShareIcon } from './svg/Share.svg';

import type {ActionName, KeyboardInputSchemeName} from './KeyboardInputSchemes';
import {findKeyboardEventSequenceMatches, isRepeatedEvent, isKeyboardInputSchemeName} from './KeyboardInputSchemes';
import { ReactComponent as AudioIcon } from './svg/Audio.svg';
import { ReactComponent as KeyboardModalToggleIcon } from './svg/Keyboard.svg';
import { ReactComponent as ThemeIcon } from './svg/Theme.svg';
import { ReactComponent as WorldIcon } from './svg/World.svg';
import { ReactComponent as ActionsMenuToggleIcon } from './svg/Simplification.svg'
import ProgramChangeController from './ProgramChangeController';
import PrivacyModal from './PrivacyModal';

import { ReactComponent as LogoContrast } from './svg/LogoContrast.svg';
import { ReactComponent as LogoGrayscale } from './svg/LogoGrayscale.svg';
import { ReactComponent as LogoDark } from './svg/LogoDark.svg';
import { ReactComponent as LogoMixedAndLight } from './svg/LogoMixedAndLight.svg';

function getThemeLogo (theme: ThemeName) {
    if (theme === "contrast") { return LogoContrast; }
    else if (theme === "gray") { return LogoGrayscale; }
    else if (theme === "dark") { return LogoDark; }

    return LogoMixedAndLight;
}

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    addNodeExpandedMode: boolean,
    theme: ThemeName,
    world: WorldName
};

type AppProps = {
    intl: IntlShape,
    language: LanguageTag,
    onChangeLanguage: (value: LanguageTag) => void,
    audioManager?: AudioManager
};

export type AppState = {
    programSequence: ProgramSequence,
    characterState: CharacterState,
    settings: AppSettings,
    selectedAction: ?CommandName,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    sonificationEnabled: boolean,
    actionPanelStepIndex: ?number,
    actionPanelFocusedOptionName: ?string,
    sceneDimensions: SceneDimensions,
    drawingEnabled: boolean,
    runningState: RunningState,
    // programSpeed is a number in the range 1..(speedLookUp.length)
    programSpeed: number,
    disallowedActions: ActionToggleRegister,
    keyBindingsEnabled: boolean,
    keyboardInputSchemeName: KeyboardInputSchemeName,
    showKeyboardModal: boolean,
    showSoundOptionsModal: boolean,
    showThemeSelectorModal: boolean,
    showWorldSelector: boolean,
    showShareModal: boolean,
    showActionsSimplificationMenu: boolean,
    showPrivacyModal: boolean,
    focusOnClosePrivacyModalSelector: string,
    startingX: number,
    startingY: number,
    startingDirection: number,
    customBackground: CustomBackground,
    customBackgroundDesignMode: boolean,
    designModeCursorState: DesignModeCursorState,
    selectedCustomBackgroundTile: ?TileCode,
    message: ?UserMessage
};

export class App extends React.Component<AppProps, AppState> {
    version: string;
    appContext: AppContext;
    sceneDimensions: SceneDimensions;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    programSerializer: ProgramSerializer;
    characterStateSerializer: CharacterStateSerializer;
    disallowedActionsSerializer: DisallowedActionsSerializer;
    customBackgroundSerializer: CustomBackgroundSerializer;
    speedLookUp: Array<number>;
    pushStateTimeoutID: ?TimeoutID;
    languageSelectorRef: { current: any };
    programBlockEditorRef: { current: any };
    sequenceInProgress: Array<KeyboardEvent>;
    announcementBuilder: AnnouncementBuilder;
    characterDescriptionBuilder: CharacterDescriptionBuilder;
    designModeCursorDescriptionBuilder: DesignModeCursorDescriptionBuilder;
    programChangeController: ProgramChangeController;
    defaultWorld: WorldName;
    focusLanguageSelector: boolean;

    constructor(props: any) {
        super(props);

        this.version = '1.13';

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        this.sceneDimensions = new SceneDimensions(1, 12, 1, 8);

        this.speedLookUp = [2000, 1500, 1000, 500, 250];

        this.programSerializer = new ProgramSerializer();

        this.characterStateSerializer = new CharacterStateSerializer(this.sceneDimensions);

        this.disallowedActionsSerializer = new DisallowedActionsSerializer();

        this.customBackgroundSerializer = new CustomBackgroundSerializer(this.sceneDimensions);

        this.pushStateTimeoutID = null;

        this.sequenceInProgress = [];

        this.defaultWorld = 'Sketchpad';

        this.focusLanguageSelector = false;

        // Initialize startingX, startingY, and startingDirection to the world starting position
        const startingX = getWorldProperties(this.defaultWorld).startingX;
        const startingY = getWorldProperties(this.defaultWorld).startingY;
        const startingDirection = getWorldProperties(this.defaultWorld).startingDirection;

        this.state = {
            programSequence: new ProgramSequence([], 0, 0, new Map()),
            characterState: this.makeStartingCharacterState(startingX, startingY, startingDirection),
            settings: {
                addNodeExpandedMode: true,
                theme: 'default',
                world: this.defaultWorld
            },
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            announcementsEnabled: true,
            sonificationEnabled: true,
            actionPanelStepIndex: null,
            actionPanelFocusedOptionName: null,
            sceneDimensions: this.sceneDimensions,
            drawingEnabled: true,
            runningState: 'stopped',
            // Default to the middle speed
            programSpeed: Math.ceil(this.speedLookUp.length / 2),
            disallowedActions: {},
            keyBindingsEnabled: false,
            showKeyboardModal: false,
            showSoundOptionsModal: false,
            showThemeSelectorModal: false,
            showWorldSelector: false,
            showShareModal: false,
            showActionsSimplificationMenu: false,
            showPrivacyModal: false,
            focusOnClosePrivacyModalSelector: '',
            startingX: startingX,
            startingY: startingY,
            startingDirection: startingDirection,
            customBackground: new CustomBackground(this.sceneDimensions),
            customBackgroundDesignMode: false,
            designModeCursorState: new DesignModeCursorState(startingX, startingY, this.sceneDimensions),
            selectedCustomBackgroundTile: null,
            message: null,
            keyboardInputSchemeName: "controlalt"
        };

        if (props.audioManager) {
            this.audioManager = props.audioManager
        }
        else if (FeatureDetection.webAudioApiIsAvailable()) {
            this.audioManager = new AudioManagerImpl(this.state.audioEnabled, this.state.announcementsEnabled, this.state.sonificationEnabled);
        }
        else {
            this.audioManager = new FakeAudioManager();
        }

        this.focusTrapManager = new FocusTrapManager();

        this.announcementBuilder = new AnnouncementBuilder();

        this.characterDescriptionBuilder = new CharacterDescriptionBuilder();

        this.designModeCursorDescriptionBuilder = new DesignModeCursorDescriptionBuilder();

        this.programChangeController = new ProgramChangeController(this,
            this.audioManager);

        this.languageSelectorRef = React.createRef();

        this.programBlockEditorRef = React.createRef();

        const actionsHandler = new ActionsHandler(this, this.audioManager,
            this.sceneDimensions);

        this.interpreter = new Interpreter(
            this.speedLookUp[this.state.programSpeed - 1],
            this,
            actionsHandler
        );
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedActionName() {
        if (this.state.selectedAction !== null) {
            return this.state.selectedAction;
        } else {
            return null;
        }
    }

    isChangeCustomBackgroundDesignModeDisabled(): boolean {
        return !(this.state.runningState === 'stopped'
            || this.state.runningState === 'paused');
    }

    isEditingDisabled(): boolean {
        return !(this.state.runningState === 'stopped'
            || this.state.runningState === 'paused');
    }

    isPlayPauseDisabled(): boolean {
        return this.state.programSequence.getProgramLength() === 0
            || this.state.customBackgroundDesignMode;
    }

    isRefreshDisabled(): boolean {
        return this.state.runningState !== 'stopped'
            || this.state.customBackgroundDesignMode;
    }

    // API for Interpreter

    getRunningState(): RunningState {
        return this.state.runningState;
    }

    setRunningStateForInterpreter(runningState: RunningState): void {
        this.setState((state) => {
            // If the Interpreter has called this method with 'paused', and
            // the user has already clicked the stop button, go straight to
            // 'stopped'
            if (runningState === 'paused'
                    && state.runningState === 'stopRequested') {
                return {
                    runningState: 'stopped'
                };
            } else {
                return {
                    runningState: runningState
                };
            }
        });
    }

    getProgramSequence(): ProgramSequence {
        return this.state.programSequence;
    }

    advanceProgramCounter(callback: () => void): void {
        this.setState((state) => {
            return {
                programSequence: state.programSequence.advanceProgramCounter(false)
            }
        }, callback);
    }

    // Handlers

    handleChangeLanguage = (language: LanguageTag) => {
        // Changing the language will cause the App to update and for focus to
        // be lost. Set this.focusLanguageSelector to true to indicate that we
        // want to set focus back to the language selector after the update.
        this.focusLanguageSelector = true;
        // Call the provided handler
        this.props.onChangeLanguage(language);
    };

    handleProgramSequenceChange = (programSequence: ProgramSequence) => {
        this.setState({
            programSequence: programSequence
        });
    };

    handleProgramBlockEditorInsertSelectedAction = (index: number, selectedAction: ?CommandName) => {
        this.programChangeController.insertSelectedActionIntoProgram(
            this.programBlockEditorRef.current,
            index,
            selectedAction,
            this.props.intl
        );
    };

    handleProgramBlockEditorDeleteStep = (index: number, command: string) => {
        this.programChangeController.deleteProgramStep(
            this.programBlockEditorRef.current,
            index,
            command,
            this.props.intl
        );
    };

    handleProgramBlockEditorReplaceStep = (index: number, selectedAction: ?CommandName) => {
        this.programChangeController.replaceProgramStep(
            this.programBlockEditorRef.current,
            index,
            selectedAction,
            this.props.intl
        );
    };

    handleProgramBlockEditorMoveStepNext = (indexFrom: number, commandAtIndexFrom: string) => {
        this.programChangeController.moveProgramStepNext(
            this.programBlockEditorRef.current,
            indexFrom,
            commandAtIndexFrom,
            'focusActionPanel',
            this.props.intl
        )
    };

    handleProgramBlockEditorMoveStepPrevious = (indexFrom: number, commandAtIndexFrom: string) => {
        this.programChangeController.moveProgramStepPrevious(
            this.programBlockEditorRef.current,
            indexFrom,
            commandAtIndexFrom,
            'focusActionPanel',
            this.props.intl
        )
    };

    handlePlay = () => {
        this.setState((state) => {
            switch (state.runningState) {
                case 'running':
                    return {
                        runningState: 'pauseRequested',
                        actionPanelStepIndex: null
                    };
                case 'pauseRequested': // Fall through
                case 'paused':
                    return {
                        runningState: 'running',
                        actionPanelStepIndex: null
                    };
                case 'stopRequested': // Fall through
                case 'stopped':
                    return {
                        programSequence: state.programSequence.initiateProgramRun(),
                        runningState: 'running',
                        actionPanelStepIndex: null,
                        message: null
                    };
                default:
                    return null;
            }
        });
    };

    handleStop = () => {
        this.setState((state) => {
            if (state.runningState === 'paused') {
                return {
                    // If we are paused, then the interpreter isn't running
                    // and we go straight to stopped
                    runningState: 'stopped'
                };
            } else {
                return {
                    runningState: 'stopRequested'
                };
            }
        });
    };

    handleCommandFromCommandPalette = (command: CommandName) => {
        this.setState({
            selectedAction: command
        });
    };

    handleDragStartCommand = (command: CommandName) => {
        this.setState({
            isDraggingCommand: true,
            selectedAction: command,
            actionPanelStepIndex: null
        });
    };

    handleDragEndCommand = () => {
        this.setState({ isDraggingCommand: false });
    };

    handleChangeActionPanelStepIndexAndOption = (index: ?number, focusedOptionName: ?string) => {
        this.setState({
            actionPanelStepIndex: index,
            actionPanelFocusedOptionName: focusedOptionName
        });
    };

    handleChangeAddNodeExpandedMode = (isAddNodeExpandedMode: boolean) => {
        this.setStateSettings({
            addNodeExpandedMode: isAddNodeExpandedMode
        });
    };

    handleRootClick = (e: SyntheticInputEvent<HTMLInputElement>) => {
        let element = e.target;
        // Walk up the document tree until we hit the top, or we find that
        // we are within an action panel group area
        while (element != null && element.dataset) {
            if (element.dataset.actionpanelgroup) {
                // We are within an action panel group area, stop looking
                return;
            }
            element = element.parentElement;
        }
        // We hit the top, close the action panel
        this.setState({
            actionPanelStepIndex: null
        });
    };

    // Global shortcut handling.
    // TODO: Convert to use keyboardEventMatchesKeyDef for each command in turn.
    handleDocumentKeyDown = (e: KeyboardEvent) => {
        if (this.state.keyBindingsEnabled) {
            if (e.key === 'Escape') {
                this.sequenceInProgress = [];
                return;
            }

            const isOnlyModifier = ["Shift", "Control", "Alt"].indexOf(e.key) !== -1;
            let isRepeat = false;
            if (this.sequenceInProgress.length) {
                isRepeat = isRepeatedEvent(this.sequenceInProgress[this.sequenceInProgress.length - 1], e);
            }

            if (!isOnlyModifier && !isRepeat) {
                this.sequenceInProgress.push(e);

                const matchingKeyboardAction: ActionName | "partial" | false = findKeyboardEventSequenceMatches(this.sequenceInProgress, this.state.keyboardInputSchemeName);
                if (matchingKeyboardAction === false || matchingKeyboardAction !== "partial") {
                    this.sequenceInProgress = [];
                }

                if (matchingKeyboardAction !== false) {
                    e.preventDefault();
                    switch (matchingKeyboardAction) {
                        case("showHide"):
                            this.setState((currentState) => {
                                return { showKeyboardModal: !(currentState.showKeyboardModal) };
                            });
                            break;
                        case("toggleFeedbackAnnouncements"):
                            // We have to use the function form here as our change is based on the current state.
                            this.setState((currentState) => {
                                return { announcementsEnabled: !(currentState.announcementsEnabled) };
                            });
                            break;
                        case("addCommand"): {
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep' ||
                                        currentElement.dataset.controltype === 'addNode') {
                                        const index = currentElement.dataset.controltype === 'programStep' ?
                                            parseInt(currentElement.dataset.stepnumber, 10) + 1:
                                            parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.insertSelectedActionIntoProgram(
                                                this.programBlockEditorRef.current,
                                                index,
                                                this.state.selectedAction,
                                                this.props.intl
                                            );
                                        }
                                    }
                                }
                            }
                            break;
                        }
                        case("addCommandToBeginning"):
                            if (!this.isEditingDisabled()) {
                                this.programChangeController.insertSelectedActionIntoProgram(
                                    this.programBlockEditorRef.current,
                                    0,
                                    this.state.selectedAction,
                                    this.props.intl
                                );
                            }
                            break;
                        case("addCommandToEnd"):
                            if (!this.isEditingDisabled()) {
                                this.programChangeController.addSelectedActionToProgramEnd(
                                    this.programBlockEditorRef.current,
                                    this.state.selectedAction,
                                    this.props.intl
                                );
                            }
                            break;
                        case("deleteCurrentStep"):
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep') {
                                        const index = parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.deleteProgramStep(
                                                this.programBlockEditorRef.current,
                                                index,
                                                currentElement.dataset.command,
                                                this.props.intl
                                            );
                                        }
                                    }
                                }
                            }
                            break;
                        case("replaceCurrentStep"):
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep') {
                                        const index = parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.replaceProgramStep(
                                                this.programBlockEditorRef.current,
                                                index,
                                                this.state.selectedAction,
                                                this.props.intl
                                            );
                                        }
                                    }
                                }
                            }
                            break;
                        case("deleteAll"): {
                            if (!this.isEditingDisabled()) {
                                const newProgramSequence = this.state.programSequence.updateProgram([]);
                                this.handleProgramSequenceChange(newProgramSequence);
                            }
                            break;
                        }
                        case("announceScene"):
                            const ariaLiveRegion = document.getElementById('character-position');
                            if (ariaLiveRegion) {
                                if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
                                    window.speechSynthesis.cancel();
                                }
                                const utterance = new SpeechSynthesisUtterance(ariaLiveRegion.innerText);
                                window.speechSynthesis.speak(utterance);
                            }
                            break;
                        case("playPauseProgram"):
                            if (!this.isPlayPauseDisabled()) {
                                this.handlePlay();
                            }
                            break;
                        case("refreshScene"):
                            if (!this.isRefreshDisabled()) {
                                this.handleRefresh();
                            }
                            break;
                        case("stopProgram"):
                            if (this.state.runningState !== 'stopped' && this.state.runningState !== 'stopRequested') {
                                this.handleStop();
                            }
                            break;
                        case("decreaseProgramSpeed"):
                            this.setState((state) => {
                                return {
                                    programSpeed: Math.max(
                                        1,
                                        state.programSpeed - 1
                                    )
                                };
                            });
                            break;
                        case("increaseProgramSpeed"):
                            this.setState((state) => {
                                return {
                                    programSpeed: Math.min(
                                        this.speedLookUp.length,
                                        state.programSpeed + 1
                                    )
                                };
                            });
                            break;
                        case("selectForward1"):
                            this.setState({ "selectedAction": "forward1" });
                            break;
                        case("selectBackward1"):
                            this.setState({ "selectedAction": "backward1" });
                            break;
                        case("selectLeft45"):
                            this.setState({ "selectedAction": "left45" });
                            break;
                        case("selectLeft90"):
                            this.setState({ "selectedAction": "left90" });
                            break;
                        case("selectRight45"):
                            this.setState({ "selectedAction": "right45" });
                            break;
                        case("selectRight90"):
                            this.setState({ "selectedAction": "right90" });
                            break;
                        case("selectLoop"):
                            this.setState({ "selectedAction": "loop" });
                            break;
                        case("focusActions"):
                            Utils.focusByQuerySelector(".command-block");
                            break;
                        case("focusAppHeader"):
                            Utils.focusByQuerySelector(".keyboard-shortcut-focus__app-header");
                            break;
                        case("focusAddNodeToggle"):
                            Utils.focusByQuerySelector(".ProgramBlockEditor__add-node-toggle-switch");
                            break;
                        case("focusCharacterPositionControls"):
                            Utils.focusByQuerySelector(".CharacterPositionController__character-position-button");
                            break;
                        case("focusCharacterColumnInput"):
                            Utils.focusByQuerySelector(".ProgramBlock__character-position-coordinate-box-column");
                            break;
                        case("focusCharacterRowInput"):
                            Utils.focusByQuerySelector(".ProgramBlock__character-position-coordinate-box-row");
                            break;
                        case("focusPreviousProgramBlock"): {
                            this.focusPreviousProgramBlock();
                            break;
                        }
                        case("focusNextProgramBlock"): {
                            this.focusNextProgramBlock();
                            break;
                        }
                        case("focusLoopIterationsInput"):
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep' && currentElement.dataset.command === 'startLoop') {
                                        const iterationsInput = currentElement.querySelector('input');
                                        if (iterationsInput != null && iterationsInput.focus) {
                                            iterationsInput.focus();
                                        }
                                    }
                                }
                            }
                            break;
                        case("focusPlayShare"):
                            Utils.focusByQuerySelector(".PlayButton--play");
                            break;
                        case("focusProgramSequence"):
                            Utils.focusByQuerySelector(".AddNode__expanded-button");
                            break;
                        case("focusScene"):
                            Utils.focusByQuerySelector(".PenDownToggleSwitch");
                            break;
                        case("focusWorldSelector"):
                            Utils.focusByQuerySelector(".keyboard-shortcut-focus__world-selector");
                            break;
                        case("moveToPreviousStep"):
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep') {
                                        const index = parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.moveProgramStepPrevious(
                                                this.programBlockEditorRef.current,
                                                index,
                                                currentElement.dataset.command,
                                                'focusBlockMoved',
                                                this.props.intl
                                            )
                                        }
                                    }
                                }
                            }
                            break;
                        case("moveToNextStep"):
                            if (!this.isEditingDisabled()) {
                                const currentElement = document.activeElement;
                                if (currentElement) {
                                    if (currentElement.dataset.controltype === 'programStep') {
                                        const index = parseInt(currentElement.dataset.stepnumber, 10);
                                        if (index != null) {
                                            this.programChangeController.moveProgramStepNext(
                                                this.programBlockEditorRef.current,
                                                index,
                                                currentElement.dataset.command,
                                                'focusBlockMoved',
                                                this.props.intl
                                            )
                                        }
                                    }
                                }
                            }
                            break;
                        case("moveCharacterLeft"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionLeft();
                            }
                            break;
                        case("moveCharacterRight"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionRight();
                            }
                            break;
                        case("moveCharacterUp"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionUp();
                            }
                            break;
                        case("moveCharacterDown"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionDown();
                            }
                            break;
                        case("turnCharacterLeft"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionTurnLeft();
                            }
                            break;
                        case("turnCharacterRight"):
                            if (!this.isEditingDisabled()) {
                                this.handleClickCharacterPositionTurnRight();
                            }
                            break;
                        case("setCharacterStartingPosition"):
                            this.setStartingPositionToCurrentPosition();
                            break;
                        case("changeToDefaultTheme"):
                            this.setStateSettings({theme: "default"});
                            break;
                        case("changeToLightTheme"):
                            this.setStateSettings({theme: "light"});
                            break;
                        case("changeToDarkTheme"):
                            this.setStateSettings({theme: "dark"});
                            break;
                        case("changeToGrayscaleTheme"):
                            this.setStateSettings({theme: "gray"});
                            break;
                        case("changeToHighContrastTheme"):
                            this.setStateSettings({theme: "contrast"});
                            break;
                        default:
                            break;
                    }
                }
            }
            else if (isRepeat) {
                e.preventDefault();
            }
        }
    };

    focusPreviousProgramBlock() {
        const programBlocks = document.querySelectorAll('.ProgramBlockEditor__program-block');
        if (programBlocks.length > 0) {
            const currentElement = document.activeElement;
            if (currentElement && currentElement.dataset.controltype === 'programStep') {
                const currentStepNumber = currentElement.dataset.stepnumber;
                if (currentStepNumber != null) {
                    this.focusBlockBefore(parseInt(currentStepNumber, 10), programBlocks);
                }
            } else if (currentElement && currentElement.dataset.controltype === 'addNode') {
                const currentAddNodeNumber = currentElement.dataset.stepnumber;
                if (currentAddNodeNumber != null) {
                    this.focusBlockBefore(parseInt(currentAddNodeNumber, 10), programBlocks);
                }
            } else if (this.state.actionPanelStepIndex != null) {
                this.focusBlockBefore(this.state.actionPanelStepIndex, programBlocks);
            } else {
                // If focus is not set, or set on an element other than a
                // program block or add node, focus the last step of program
                Utils.focusLastInNodeList(programBlocks);
            }
        }
        this.setState({ actionPanelStepIndex: null });
    }

    focusBlockBefore(index: number, programBlocks: NodeList<HTMLElement>) {
        if (index > 0) {
            const previousBlock = programBlocks[index - 1];
            if (previousBlock && previousBlock.focus) {
                previousBlock.focus();
            }
        } else {
            // Wrap around to the last step of the program
            Utils.focusLastInNodeList(programBlocks);
        }
    }

    focusNextProgramBlock() {
        const programBlocks = document.querySelectorAll('.ProgramBlockEditor__program-block');
        if (programBlocks.length > 0) {
            const currentElement = document.activeElement;
            if (currentElement && currentElement.dataset.controltype === 'programStep') {
                const currentStepNumber = currentElement.dataset.stepnumber;
                if (currentStepNumber != null) {
                    this.focusBlockAfter(parseInt(currentStepNumber, 10), programBlocks);
                }
            } else if (currentElement && currentElement.dataset.controltype === 'addNode') {
                const currentAddNodeNumber = currentElement.dataset.stepnumber;
                if (currentAddNodeNumber != null) {
                    // We pass stepmumber - 1 to focusBlockAfter() for the add
                    // node case as the block that we want to focus has the same
                    // stepnumber as the add node
                    this.focusBlockAfter(parseInt(currentAddNodeNumber, 10) - 1, programBlocks);
                }
            } else if (this.state.actionPanelStepIndex != null) {
                this.focusBlockAfter(this.state.actionPanelStepIndex, programBlocks);
            } else {
                // If focus is not set, or set on an element other than a
                // program block or add node, focus the first step of program
                Utils.focusFirstInNodeList(programBlocks);
            }
        }
        this.setState({ actionPanelStepIndex: null });
    }

    focusBlockAfter(index: number, programBlocks: NodeList<HTMLElement>) {
        if (index < programBlocks.length - 1) {
            const nextBlock = programBlocks[index + 1];
            if (nextBlock && nextBlock.focus) {
                nextBlock.focus();
            }
        } else {
            // Wrap around to the first step of the program
            Utils.focusFirstInNodeList(programBlocks);
        }
    }

    handleKeyboardModalClose = () => {
        this.setState({showKeyboardModal: false});
    };

    handleClickKeyboardIcon = () => {
        this.setState({ showKeyboardModal: true});
    };

    handleClickSoundIcon = () => {
        this.setState({ showSoundOptionsModal: true });
    }

    handleSoundOptionsModalClose = () => {
        this.setState({ showSoundOptionsModal: false });
    }

    handleChangeSoundOptions = (audioEnabled: boolean, announcementsEnabled: boolean, sonificationEnabled: boolean) => {
        this.setState({ audioEnabled, announcementsEnabled, sonificationEnabled, showSoundOptionsModal: false });
    }

    handleClickThemeSelectorIcon = () => {
        this.setState({ showThemeSelectorModal: true });
    }

    // Focus trap escape key handling.
    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    }

    handleTogglePenDown = (drawingEnabled: boolean) => {
        this.setState({
            drawingEnabled: drawingEnabled
        });
    }

    setCustomBackgroundDesignMode = (customBackgroundDesignMode: boolean) => {
        this.setState((state) => {
            if (customBackgroundDesignMode) {
                return {
                    customBackgroundDesignMode: customBackgroundDesignMode,
                    // When entering custom background design mode,
                    // set the design mode cursor to the character position
                    designModeCursorState: state.designModeCursorState.setPosition(
                        state.characterState.xPos,
                        state.characterState.yPos
                    )
                };
            } else {
                return {
                    customBackgroundDesignMode: customBackgroundDesignMode
                };
            }
        });
    }

    handleChangeProgramSpeed = (value: number) => {
        if (value >= 1 && value <= this.speedLookUp.length) {
            this.setState({
                programSpeed: value
            });
        }
    }

    renderCommandBlocks = (commands: Array<DisplayedCommandName>) => {
        const commandBlocks = [];

        for (const [index, value] of commands.entries()) {
            const isDisallowed = this.state.disallowedActions[value];
            if (isDisallowed) {
                commandBlocks.push(
                    <div
                        className='command-block--hidden'
                        key={`CommandBlock-${index}`}
                        aria-hidden='true'>
                        <HiddenBlock aria-hidden={true} />
                    </div>
                );
            }
            else {
                commandBlocks.push(
                    <CommandPaletteCommand
                        key={`CommandBlock-${index}`}
                        commandName={value}
                        selectedActionName={this.getSelectedActionName()}
                        audioManager={this.audioManager}
                        isDraggingCommand={this.state.isDraggingCommand}
                        onSelect={this.handleCommandFromCommandPalette}
                        onDragStart={this.handleDragStartCommand}
                        onDragEnd={this.handleDragEndCommand}/>
                );
            }

        }

        return commandBlocks;
    }

    makeStartingCharacterState(startingX: number, startingY: number, startingDirection: number): CharacterState {
        return new CharacterState(
            startingX,
            startingY,
            startingDirection,
            [],
            this.sceneDimensions
        );
    }

    handleRefresh = () => {
        this.setState((state) => {
            return {
                characterState: this.makeStartingCharacterState(
                    state.startingX,
                    state.startingY,
                    state.startingDirection
                ),
                message: null
            };
        });
    }

    handleSelectTheme = (theme: ThemeName) => {
        this.setStateSettings({theme});
    }

    handleChangeTheme = (theme: ThemeName) => {
        this.setState({
            showThemeSelectorModal: false,
            settings: Object.assign({}, this.state.settings, {theme})
        });
    }

    handleClickCharacterPositionTurnLeft = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {};
            } else {
                return {
                    characterState: state.characterState.turnLeft(1)
                };
            }
        });
    }

    handleClickCharacterPositionTurnRight = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {};
            } else {
                return {
                    characterState: state.characterState.turnRight(1)
                };
            }
        });
    }

    handleClickCharacterPositionLeft = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.moveLeft()
                };
            } else {
                return {
                    characterState: state.characterState.moveLeftPosition()
                };
            }
        });
    }

    handleClickCharacterPositionRight = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.moveRight()
                };
            } else {
                return {
                    characterState: state.characterState.moveRightPosition()
                };
            }
        });
    }

    handleClickCharacterPositionUp = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.moveUp()
                };
            } else {
                return {
                    characterState: state.characterState.moveUpPosition()
                };
            }
        });
    }

    handleClickCharacterPositionDown = () => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.moveDown()
                };
            } else {
                return {
                    characterState: state.characterState.moveDownPosition()
                };
            }
        });
    }

    handleChangeCharacterXPosition = (x: number) => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.setX(x)
                };
            } else {
                return {
                    characterState: state.characterState.changeXPosition(x)
                };
            }
        });
    }

    handleChangeCharacterYPosition = (y: number) => {
        this.setState((state) => {
            if (state.customBackgroundDesignMode) {
                return {
                    designModeCursorState: state.designModeCursorState.setY(y)
                };
            } else {
                return {
                    characterState: state.characterState.changeYPosition(y)
                };
            }
        });
    }

    handleChangeKeyboardInputScheme = (keyboardInputSchemeName: KeyboardInputSchemeName) => {
        this.setState({keyboardInputSchemeName});
    }

    handleChangeKeyBindingsEnabled = (keyBindingsEnabled: boolean) => {
        this.setState({keyBindingsEnabled: keyBindingsEnabled});
    }

    handleClickActionsSimplificationIcon = () => {
        if (!this.isEditingDisabled()) {
            this.setState({
                showActionsSimplificationMenu: true
            });
        }
    }

    handleChangeDisallowedActions = (disallowedActions: ActionToggleRegister) => {
        this.setState({
            showActionsSimplificationMenu: false,
            disallowedActions: disallowedActions
        });
    }

    handleCancelActionsSimplificationMenu = () => {
        this.setState({ showActionsSimplificationMenu: false});
    }

    //World handlers

    handleClickWorldIcon = () => {
        this.setState({
            showWorldSelector: true
        });
    }

    handleSelectWorld = (world: WorldName) => {
        this.setStateSettings({world});
    }

    handleChangeWorld = (world: WorldName) => {
        this.setState((state) => {
            return {
                showWorldSelector: false,
                settings: Object.assign({}, state.settings, {world})
            };
        });
    }

    handleShareButtonClick = (event: Event) => {
        event.preventDefault();
        this.setState({ showShareModal: true});

    }

    handleCloseShare = () => {
        this.setState({ showShareModal: false });
    }

    handleClickPrivacyButton = () => {
        this.setState({
            showPrivacyModal: true,
            focusOnClosePrivacyModalSelector: '.App__PrivacyModal__toggle-button'
        });
    }

    handleClosePrivacyModal = () => {
        this.setState({ showPrivacyModal: false });
    }

    handleSelectTile = (tileCode: TileCode) => {
        this.setState({ selectedCustomBackgroundTile: tileCode });
    }

    handleCloseMessage = () => {
        this.setState({
            message: null
        });
    }

    handlePaintScene = (x: number, y: number) => {
        this.setState((state) => {
            const stateUpdate: $Shape<AppState> = {};

            if (state.customBackgroundDesignMode) {
                stateUpdate.designModeCursorState = state.designModeCursorState.setPosition(x, y);

                if (state.selectedCustomBackgroundTile != null) {
                    stateUpdate.customBackground = state.customBackground.setTile(
                        x, y, state.selectedCustomBackgroundTile
                    );
                }
            }

            return stateUpdate;
        });
    }

    setStartingPositionToCurrentPosition = () => {
        this.setState((state) => {
            return {
                startingX: state.characterState.xPos,
                startingY: state.characterState.yPos,
                startingDirection: state.characterState.direction
            };
        });
    }

    handleClickPositionControllerPaintbrushButton = () => {
        this.setState((state) => {
            if (state.selectedCustomBackgroundTile != null) {
                return {
                    customBackground: state.customBackground.setTile(
                        state.designModeCursorState.x,
                        state.designModeCursorState.y,
                        state.selectedCustomBackgroundTile
                    )
                };
            } else {
                return {};
            }
        });
    }

    renderNotificationArea() {
        return (
            <div className='App__notificationArea'>
            </div>
        );
    }

    renderHeaderContents() {
        const Logo = getThemeLogo(this.state.settings.theme);

        return (
            <div className='App__header-row'>
                <h1 className='App__logo-container'>
                    <a
                        className='keyboard-shortcut-focus__app-header'
                        href='https://weavly.org/learn/resources/facilitating-a-weavly-coding-workshop-beginners/'
                        aria-label={this.props.intl.formatMessage({id: 'App.appHeading.link'})}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Logo alt={this.props.intl.formatMessage({id: 'App.appHeading.link'})}/>
                    </a>
                </h1>
                <div className='App__PrivacyButtonLanguageSelectorRow'>
                    <LanguageSelector
                        value={this.props.language}
                        onChange={this.handleChangeLanguage}
                        ref={this.languageSelectorRef}
                    />
                    <button
                        aria-label={this.props.intl.formatMessage({id: 'App.privacyModalToggle.ariaLabel'})}
                        className="App__PrivacyModal__toggle-button"
                        onClick={this.handleClickPrivacyButton}
                    >
                        <FormattedMessage id='UI.App.privacyModalToggle'/>
                    </button>
                </div>
                <div className='App__header-menu'>
                    <IconButton
                        className="App__header-soundOptions"
                        ariaLabel={this.props.intl.formatMessage({ id: 'UI.SoundOptionsModal.title' })}
                        onClick={this.handleClickSoundIcon}
                    >
                        <AudioIcon
                            className='App__header-soundOptions-icon'
                            aria-hidden={true}
                        />
                    </IconButton>
                    <IconButton
                        className="App__header-themeSelectorIcon"
                        ariaLabel={this.props.intl.formatMessage({ id: 'ThemeSelector.iconButton' })}
                        onClick={this.handleClickThemeSelectorIcon}
                    >
                        <ThemeIcon
                            className='App__header-theme-icon'
                            aria-hidden={true}
                        />
                    </IconButton>
                    <IconButton
                        className="App__header-keyboardMenuIcon"
                        ariaLabel={this.props.intl.formatMessage({ id: 'KeyboardInputModal.ShowHide.AriaLabel' })}
                        onClick={this.handleClickKeyboardIcon}
                    >
                        <KeyboardModalToggleIcon
                            className='App__header-keyboard-icon'
                            aria-hidden={true}
                        />
                    </IconButton>
                    <IconButton className="App__ActionsMenu__toggle-button"
                        ariaLabel={this.props.intl.formatMessage({ id: 'ActionsMenu.toggleActionsMenu' })}
                        disabled={this.isEditingDisabled()}
                        onClick={this.handleClickActionsSimplificationIcon}
                    >
                        <ActionsMenuToggleIcon
                            className='App__header-actionsMenu-icon'
                            aria-hidden={true}
                        />
                    </IconButton>
                </div>
            </div>
        );
    }

    renderSceneWithHeading() {
        return (
            <React.Fragment>
                <h2 className='sr-only' >
                    <FormattedMessage id='Scene.heading' />
                </h2>
                <Scene
                    dimensions={this.state.sceneDimensions}
                    characterState={this.state.characterState}
                    designModeCursorState={this.state.designModeCursorState}
                    theme={this.state.settings.theme}
                    world={this.state.settings.world}
                    customBackground={this.state.customBackground}
                    customBackgroundDesignMode={this.state.customBackgroundDesignMode}
                    startingX={this.state.startingX}
                    startingY={this.state.startingY}
                    runningState={this.state.runningState}
                    message={this.state.message}
                    characterDescriptionBuilder={this.characterDescriptionBuilder}
                    onCloseMessage={this.handleCloseMessage}
                    onPaintScene={this.handlePaintScene}
                />
            </React.Fragment>
        );
    }

    renderTilePanel() {
        return (
            <TilePanel
                selectedTile={this.state.selectedCustomBackgroundTile}
                theme={this.state.settings.theme}
                onSelectTile={this.handleSelectTile}
            />
        );
    }

    renderWorldSelectorWithHeading() {
        return (
            <React.Fragment>
                <h2 className='sr-only' >
                    <FormattedMessage id='WorldSelectorButton.heading' />
                </h2>
                <div className="App__world-selector">
                    <IconButton
                        className='keyboard-shortcut-focus__world-selector'
                        ariaLabel={this.props.intl.formatMessage({ id: 'WorldSelectorButton.label' })}
                        onClick={this.handleClickWorldIcon}
                    >
                        <WorldIcon
                            className='App__world-selector-icon'
                            aria-hidden={true}
                        />
                    </IconButton>
                    <CustomBackgroundDesignModeButton
                        customBackgroundDesignMode={this.state.customBackgroundDesignMode}
                        disabled={this.isChangeCustomBackgroundDesignModeDisabled()}
                        onChange={this.setCustomBackgroundDesignMode}
                    />
                </div>
            </React.Fragment>
        );
    }

    renderPenDownToggleSwitch() {
        return (
            <div className='App__PenDownToggleSwitch-container'>
                <PenDownToggleSwitch
                    value={this.state.drawingEnabled}
                    onChange={this.handleTogglePenDown}
                />
            </div>
        );
    }

    renderCharacterPositionController() {
        return (
            <CharacterPositionController
                x={this.state.customBackgroundDesignMode ?
                    this.state.designModeCursorState.x
                    : this.state.characterState.xPos}
                y={this.state.customBackgroundDesignMode ?
                    this.state.designModeCursorState.y
                    : this.state.characterState.yPos}
                sceneDimensions={this.state.sceneDimensions}
                editingDisabled={this.isEditingDisabled()}
                customBackgroundDesignMode={this.state.customBackgroundDesignMode}
                selectedCustomBackgroundTile={this.state.selectedCustomBackgroundTile}
                onClickTurnLeft={this.handleClickCharacterPositionTurnLeft}
                onClickTurnRight={this.handleClickCharacterPositionTurnRight}
                onClickLeft={this.handleClickCharacterPositionLeft}
                onClickRight={this.handleClickCharacterPositionRight}
                onClickUp={this.handleClickCharacterPositionUp}
                onClickDown={this.handleClickCharacterPositionDown}
                onChangeCharacterXPosition={this.handleChangeCharacterXPosition}
                onChangeCharacterYPosition={this.handleChangeCharacterYPosition}
                onClickSetStartButton={this.setStartingPositionToCurrentPosition}
                onClickPaintbrushButton={this.handleClickPositionControllerPaintbrushButton}
            />
        );
    }

    renderCommandPaletteContents() {
        return (
            <React.Fragment>
                <div className='App__ActionsMenu__header'>
                    <h2 className='App__ActionsMenu__header-heading'>
                        <FormattedMessage id='UI.ActionsMenu.title' />
                    </h2>
                </div>
                <div className='App__command-palette-command-container'>
                    <div className='App__command-palette-section'>
                        <div className='App__command-palette-section-heading-container'>
                            <h3 className='App__command-palette-section-heading'>
                                <FormattedMessage id='UI.CommandPalette.movementsTitle'/>
                            </h3>
                        </div>
                        <div className='App__command-palette-section-body'>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks(['forward1'])}
                            </div>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks(['backward1'])}
                            </div>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks([
                                    'left45', 'left90'
                                ])}
                            </div>
                            <div className='App__command-palette-commands'>
                                {this.renderCommandBlocks([
                                    'right45', 'right90'
                                ])}
                            </div>
                        </div>
                    </div>
                    <div className='App__command-palette-section'>
                        <div className='App__command-palette-section-heading-container'>
                            <h3 className='App__command-palette-section-heading'>
                                <FormattedMessage id='UI.CommandPalette.controlsTitle'/>
                            </h3>
                        </div>

                        <div className='App__command-palette-section-body'>
                            <div className='App__command-palette-controls'>
                                {this.renderCommandBlocks([
                                    'loop'
                                ])}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    renderProgramBlockEditor() {
        return (
            <ProgramBlockEditor
                ref={this.programBlockEditorRef}
                actionPanelStepIndex={this.state.actionPanelStepIndex}
                actionPanelFocusedOptionName={this.state.actionPanelFocusedOptionName}
                characterState={this.state.characterState}
                editingDisabled={this.isEditingDisabled()}
                programSequence={this.state.programSequence}
                runningState={this.state.runningState}
                keyboardInputSchemeName={this.state.keyboardInputSchemeName}
                selectedAction={this.state.selectedAction}
                isDraggingCommand={this.state.isDraggingCommand}
                audioManager={this.audioManager}
                focusTrapManager={this.focusTrapManager}
                addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                theme={this.state.settings.theme}
                world={this.state.settings.world}
                scrollRightPaddingPx={256}
                scrollLeftPaddingPx={128}
                scrollTimeThresholdMs={400}
                onChangeProgramSequence={this.handleProgramSequenceChange}
                onInsertSelectedActionIntoProgram={this.handleProgramBlockEditorInsertSelectedAction}
                onDeleteProgramStep={this.handleProgramBlockEditorDeleteStep}
                onReplaceProgramStep={this.handleProgramBlockEditorReplaceStep}
                onMoveProgramStepNext={this.handleProgramBlockEditorMoveStepNext}
                onMoveProgramStepPrevious={this.handleProgramBlockEditorMoveStepPrevious}
                onChangeActionPanelStepIndexAndOption={this.handleChangeActionPanelStepIndexAndOption}
                onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
            />
        );
    }

    renderPlayAndShareContents() {
        return (
            <React.Fragment>
                <h2 className='sr-only' >
                    <FormattedMessage id='PlayControls.heading' />
                </h2>
                <div className='App__playControl-container'>
                    <div className='App__playButton-container'>
                        <RefreshButton
                            className='App__playControlButton'
                            disabled={this.isRefreshDisabled()}
                            onClick={this.handleRefresh}
                        />
                        <PlayButton
                            className='App__playControlButton'
                            interpreterIsRunning={this.state.runningState === 'running'}
                            disabled={this.isPlayPauseDisabled()}
                            onClick={this.handlePlay}
                        />
                        <StopButton
                            className='App__playControlButton'
                            disabled={
                                this.state.runningState === 'stopped'
                                || this.state.runningState === 'stopRequested'}
                            onClick={this.handleStop}
                        />
                        <ProgramSpeedController
                            numValues={this.speedLookUp.length}
                            value={this.state.programSpeed}
                            onChange={this.handleChangeProgramSpeed}
                        />
                    </div>
                </div>
                <div className='App__shareButton-container'>
                    <button
                        className='App__ShareButton'
                        onClick={this.handleShareButtonClick}
                    >
                        <ShareIcon
                            className='App__ShareButton__icon'
                            aria-hidden={true}
                        />
                        <div className='App__ShareButton__label'>
                            {this.props.intl.formatMessage({id:'UI.ShareButton'})}
                        </div>
                    </button>
                </div>
            </React.Fragment>
        );
    }

    renderCharacterAriaLive() {
        return (
            <CharacterAriaLive
                ariaLiveRegionId='character-position'
                ariaHidden={this.state.showWorldSelector}
                characterState={this.state.characterState}
                designModeCursorState={this.state.designModeCursorState}
                runningState={this.state.runningState}
                world={this.state.settings.world}
                customBackground={this.state.customBackground}
                customBackgroundDesignMode={this.state.customBackgroundDesignMode}
                characterDescriptionBuilder={this.characterDescriptionBuilder}
                designModeCursorDescriptionBuilder={this.designModeCursorDescriptionBuilder}
                message={this.state.message}
            />
        );
    }

    renderModals() {
        return (
            <React.Fragment>
                <KeyboardInputModal
                    show={this.state.showKeyboardModal}
                    keyBindingsEnabled={this.state.keyBindingsEnabled}
                    keyboardInputSchemeName={this.state.keyboardInputSchemeName}
                    onChangeKeyboardInputScheme={this.handleChangeKeyboardInputScheme}
                    onChangeKeyBindingsEnabled={this.handleChangeKeyBindingsEnabled}
                    onHide={this.handleKeyboardModalClose}
                />
                <SoundOptionsModal
                    audioEnabled={this.state.audioEnabled}
                    announcementsEnabled={this.state.announcementsEnabled}
                    sonificationEnabled={this.state.sonificationEnabled}
                    show={this.state.showSoundOptionsModal}
                    onCancel={this.handleSoundOptionsModalClose}
                    onChangeSoundOptions={this.handleChangeSoundOptions}
                />
                <ThemeSelector
                    show={this.state.showThemeSelectorModal}
                    currentTheme={this.state.settings.theme}
                    onSelect={this.handleSelectTheme}
                    onChange={this.handleChangeTheme}/>
                <WorldSelector
                    show={this.state.showWorldSelector}
                    currentWorld={this.state.settings.world}
                    theme={this.state.settings.theme}
                    onChange={this.handleChangeWorld}
                    onSelect={this.handleSelectWorld}/>
                <ShareModal
                    show={this.state.showShareModal}
                    onClose={this.handleCloseShare}
                />
                <ActionsSimplificationModal
                    show={this.state.showActionsSimplificationMenu}
                    onCancel={this.handleCancelActionsSimplificationMenu}
                    onConfirm={this.handleChangeDisallowedActions}
                    disallowedActions={this.state.disallowedActions}
                    programSequence={this.state.programSequence}
                />
                <PrivacyModal
                    show={this.state.showPrivacyModal}
                    focusOnCloseSelector={this.state.focusOnClosePrivacyModalSelector}
                    onClose={this.handleClosePrivacyModal}
                />
            </React.Fragment>
        );
    }

    render() {
        return (
            // Use a 'key' to force rerendering of the whole app when the
            // language is changed. Rerendering the app ensures that
            // the correct screen reader voice is used on Firefox after
            // changing languages.
            <div key={this.props.language}>
                <div
                    className={
                        classNames(
                            'App__container',
                            this.state.customBackgroundDesignMode
                                && 'App__container--customBackgroundDesignMode'
                        )
                    }
                    role='main'
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}
                >
                    {this.renderNotificationArea()}
                    <header className='App__header'>
                        {this.renderHeaderContents()}
                    </header>
                    <div className='App__scene-container'>
                        {this.renderSceneWithHeading()}
                        {this.state.customBackgroundDesignMode &&
                            this.renderTilePanel()
                        }
                    </div>
                    <div className="App__world-container">
                        {this.renderWorldSelectorWithHeading()}
                        {!(this.state.customBackgroundDesignMode) &&
                            this.renderPenDownToggleSwitch()
                        }
                        {this.renderCharacterPositionController()}
                    </div>
                    {!(this.state.customBackgroundDesignMode) &&
                        <React.Fragment>
                            <div className='App__command-palette'>
                                {this.renderCommandPaletteContents()}
                            </div>
                            <div className='App__program-block-editor'>
                                {this.renderProgramBlockEditor()}
                            </div>
                            <div className='App__playAndShare-background'/>
                            <div className='App__playAndShare-container'>
                                {this.renderPlayAndShareContents()}
                            </div>
                        </React.Fragment>
                    }
                </div>
                {this.renderCharacterAriaLive()}
                {this.renderModals()}
            </div>
        );
    }

    componentDidMount() {
        // As long as we have no underlying "default" theme styles, we need to always set this to ensure that the default theme is applied on startup.
        if (document.body) {
            document.body.className = `${this.state.settings.theme}-theme`;
        }

        if (window.location.search != null && window.location.search !== '') {
            const params = new C2lcURLParams(window.location.search);
            const programQuery = params.getProgram();
            const characterStateQuery = params.getCharacterState();
            const themeQuery = params.getTheme();
            const disallowedActionsQuery = params.getDisallowedActions();
            const worldQuery = params.getWorld();
            const startingPositionQuery = params.getStartingPosition();
            const customBackgroundQuery = params.getCustomBackground();

            if (programQuery != null) {
                try {
                    const parserResult = this.programSerializer.deserialize(programQuery);
                    this.setState({
                        programSequence: ProgramSequence.makeProgramSequenceFromParserResult(parserResult)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing program: ${programQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (characterStateQuery != null) {
                try {
                    this.setState({
                        characterState: this.characterStateSerializer.deserialize(characterStateQuery)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing characterState: ${characterStateQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (disallowedActionsQuery != null) {
                try {
                    this.setState({
                        disallowedActions: this.disallowedActionsSerializer.deserialize(disallowedActionsQuery)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing disallowed actions: ${disallowedActionsQuery}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            const world = Utils.getWorldFromString(worldQuery, this.defaultWorld);
            const startingPosition = Utils.getStartingPositionFromString(
                startingPositionQuery,
                this.state.sceneDimensions.getMaxX(),
                this.state.sceneDimensions.getMaxY(),
                getWorldProperties(world).startingX,
                getWorldProperties(world).startingY,
                getWorldProperties(world).startingDirection
            );

            this.setState({
                startingX: startingPosition.x,
                startingY: startingPosition.y,
                startingDirection: startingPosition.direction
            });

            this.setState({
                customBackground: this.customBackgroundSerializer.deserialize(customBackgroundQuery)
            });

            this.setStateSettings({
                theme: Utils.getThemeFromString(themeQuery, 'default'),
                world: world
            });
        } else {
            const localProgram = window.localStorage.getItem('c2lc-program');
            const localCharacterState = window.localStorage.getItem('c2lc-characterState');
            const localTheme = window.localStorage.getItem('c2lc-theme');
            const localDisallowedActions = window.localStorage.getItem('c2lc-disallowedActions');
            const localWorld = window.localStorage.getItem('c2lc-world');
            const localStartingPosition = window.localStorage.getItem('c2lc-startingPosition');
            const localCustomBackground = window.localStorage.getItem('c2lc-customBackground');

            if (localProgram != null) {
                try {
                    const parserResult = this.programSerializer.deserialize(localProgram);
                    this.setState({
                        programSequence: ProgramSequence.makeProgramSequenceFromParserResult(parserResult)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing program: ${localProgram}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            if (localCharacterState != null) {
                try {
                    this.setState({
                        characterState: this.characterStateSerializer.deserialize(localCharacterState)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing characterState: ${localCharacterState}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }


            if (localDisallowedActions != null) {
                try {
                    this.setState({
                        disallowedActions: this.disallowedActionsSerializer.deserialize(localDisallowedActions)
                    });
                } catch(err) {
                    /* eslint-disable no-console */
                    console.log(`Error parsing disallowed actions: ${localDisallowedActions}`);
                    console.log(err.toString());
                    /* eslint-enable no-console */
                }
            }

            const world = Utils.getWorldFromString(localWorld, this.defaultWorld);
            const startingPosition = Utils.getStartingPositionFromString(
                localStartingPosition,
                this.state.sceneDimensions.getMaxX(),
                this.state.sceneDimensions.getMaxY(),
                getWorldProperties(world).startingX,
                getWorldProperties(world).startingY,
                getWorldProperties(world).startingDirection
            );

            this.setState({
                startingX: startingPosition.x,
                startingY: startingPosition.y,
                startingDirection: startingPosition.direction
            });

            this.setState({
                customBackground: this.customBackgroundSerializer.deserialize(localCustomBackground)
            });

            this.setStateSettings({
                theme: Utils.getThemeFromString(localTheme, 'default'),
                world: world
            });
        }

        // Keyboard settings are read from local storage whether or not we have URL content.
        const localKeyBindingsEnabled = window.localStorage.getItem('c2lc-keyBindingsEnabled');
        const localKeyboardInputSchemeName = window.localStorage.getItem('c2lc-keyboardInputSchemeName');

        if (localKeyBindingsEnabled != null) {
            try {
                this.setState({
                    keyBindingsEnabled: !!(JSON.parse(localKeyBindingsEnabled))
                });
            }
            catch(err) {
                /* eslint-disable no-console */
                console.log(`Error parsing key bindings toggle: ${localKeyBindingsEnabled}`);
                console.log(err.toString());
                /* eslint-enable no-console */
            }
        }

        if (isKeyboardInputSchemeName(localKeyboardInputSchemeName)) {
            this.setState({
                keyboardInputSchemeName: localKeyboardInputSchemeName
            });
        }

        document.addEventListener('keydown', this.handleDocumentKeyDown);
    }

    componentDidUpdate(prevProps: AppProps, prevState: AppState) {
        if (this.state.programSequence !== prevState.programSequence
            || this.state.characterState !== prevState.characterState
            || this.state.settings.theme !== prevState.settings.theme
            || this.state.disallowedActions !== prevState.disallowedActions
            || this.state.startingX !== prevState.startingX
            || this.state.startingY !== prevState.startingY
            || this.state.startingDirection !== prevState.startingDirection
            || this.state.settings.world !== prevState.settings.world
            || this.state.customBackground !== prevState.customBackground) {
            const serializedProgram = this.programSerializer.serialize(this.state.programSequence.getProgram());
            const serializedCharacterState = this.characterStateSerializer.serialize(this.state.characterState);
            const serializedDisallowedActions = this.disallowedActionsSerializer.serialize(this.state.disallowedActions);
            const serializedStartingPosition = `${Utils.encodeCoordinate(this.state.startingX)}${Utils.encodeCoordinate(this.state.startingY)}${Utils.encodeDirection(this.state.startingDirection)}`;
            const serializedCustomBackground = this.customBackgroundSerializer.serialize(this.state.customBackground);

            // Use setTimeout() to limit how often we call history.pushState().
            // Safari will throw an error if calls to history.pushState() are
            // too frequent: "SecurityError: Attempt to use history.pushState()
            // more than 100 times per 30 seconds".
            const pushStateDelayMs = 350;
            clearTimeout(this.pushStateTimeoutID);
            this.pushStateTimeoutID = setTimeout(() => {
                window.history.pushState(
                    {
                        p: serializedProgram,
                        c: serializedCharacterState,
                        t: this.state.settings.theme,
                        d: serializedDisallowedActions,
                        w: this.state.settings.world,
                        s: serializedStartingPosition,
                        b: serializedCustomBackground
                    },
                    '',
                    Utils.generateEncodedProgramURL(this.version, this.state.settings.theme, this.state.settings.world, serializedProgram, serializedCharacterState, serializedDisallowedActions, serializedStartingPosition, serializedCustomBackground),
                    '',
                );
            }, pushStateDelayMs);

            window.localStorage.setItem('c2lc-version', this.version);
            window.localStorage.setItem('c2lc-program', serializedProgram);
            window.localStorage.setItem('c2lc-characterState', serializedCharacterState);
            window.localStorage.setItem('c2lc-theme', this.state.settings.theme);
            window.localStorage.setItem('c2lc-disallowedActions', serializedDisallowedActions);
            window.localStorage.setItem('c2lc-world', this.state.settings.world);
            window.localStorage.setItem('c2lc-startingPosition', serializedStartingPosition);
            window.localStorage.setItem('c2lc-customBackground', serializedCustomBackground);
        }

        if (this.state.keyBindingsEnabled !== prevState.keyBindingsEnabled
            || this.state.keyboardInputSchemeName !== prevState.keyboardInputSchemeName) {
            window.localStorage.setItem('c2lc-keyBindingsEnabled', this.state.keyBindingsEnabled);
            window.localStorage.setItem('c2lc-keyboardInputSchemeName', this.state.keyboardInputSchemeName);
        }

        if (this.state.announcementsEnabled !== prevState.announcementsEnabled) {
            this.audioManager.setAnnouncementsEnabled(this.state.announcementsEnabled);
        }
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        if (this.state.sonificationEnabled !== prevState.sonificationEnabled) {
            this.audioManager.setSonificationEnabled(this.state.sonificationEnabled);
        }
        if (this.state.runningState !== prevState.runningState
                && this.state.runningState === 'running') {
            this.interpreter.startRun();
        }

        if (this.state.selectedAction !== prevState.selectedAction
                && this.state.selectedAction != null) {
            const announcementData = this.announcementBuilder.buildSelectActionAnnouncement(this.state.selectedAction, this.props.intl);
            this.audioManager.playAnnouncement(announcementData.messageIdSuffix,
                    this.props.intl, announcementData.values);
        }

        if (this.state.programSequence !== prevState.programSequence) {
            if (this.state.programSequence.getProgramLength() === 0) {
                // All steps have been deleted
                this.setState({ runningState: 'stopped' });
            } else if (this.state.programSequence.getProgramCounter()
                    >= this.state.programSequence.getProgramLength()) {
                // All steps from the programCounter onward have been deleted
                this.setState({ runningState: 'stopped' });
            }
        }

        if (this.state.settings.theme !== prevState.settings.theme && document.body) {
            document.body.className = `${this.state.settings.theme}-theme`;
        }

        if (this.state.programSpeed !== prevState.programSpeed) {
            if (this.speedLookUp.length > 0
                    && this.state.programSpeed >= 1
                    && this.state.programSpeed <= this.speedLookUp.length) {
                this.interpreter.setStepTime(
                    this.speedLookUp[this.state.programSpeed - 1]
                );
            }
        }

        // If the language has been changed and this.focusLanguageSelector is
        // set, then set focus to the language selector
        if (this.props.language !== prevProps.language
                && this.focusLanguageSelector) {
            if (this.languageSelectorRef.current) {
                this.languageSelectorRef.current.focus();
            }
            this.focusLanguageSelector = false;
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }
}

export default injectIntl(App);
