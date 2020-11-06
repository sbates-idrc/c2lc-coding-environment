// @flow

import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { Col, Container, Row } from 'react-bootstrap';
import AudioManager from './AudioManager';
import CharacterState from './CharacterState';
import CommandPaletteCommand from './CommandPaletteCommand';
import C2lcURLParams from './C2lcURLParams';
import DashConnectionErrorModal from './DashConnectionErrorModal';
import DashDriver from './DashDriver';
import * as FeatureDetection from './FeatureDetection';
import FocusTrapManager from './FocusTrapManager';
import Interpreter from './Interpreter';
import type { InterpreterRunningState } from './Interpreter';
import PlayButton from './PlayButton';
import ProgramBlockEditor from './ProgramBlockEditor';
import RefreshButton from './RefreshButton';
import Scene from './Scene';
import AudioFeedbackToggleSwitch from './AudioFeedbackToggleSwitch';
import PenDownToggleSwitch from './PenDownToggleSwitch';
import ProgramSpeedController from './ProgramSpeedController';
import { programIsEmpty } from './ProgramUtils';
import ProgramSerializer from './ProgramSerializer';
import type { DeviceConnectionStatus, Program, RobotDriver } from './types';
import * as Utils from './Utils';
import messages from './messages.json';
import './App.scss';
import './vendor/dragdroptouch/DragDropTouch.js';
/* Dash connection removed for version 0.5
import BluetoothApiWarning from './BluetoothApiWarning';
import DeviceConnectControl from './DeviceConnectControl';
*/

// Uncomment to use the FakeRobotDriver (see driver construction below also)
//import FakeRobotDriver from './FakeRobotDriver';

type AppContext = {
    bluetoothApiIsAvailable: boolean
};

type AppSettings = {
    language: string,
    addNodeExpandedMode: boolean
};

type AppState = {
    program: Program,
    characterState: CharacterState,
    settings: AppSettings,
    dashConnectionStatus: DeviceConnectionStatus,
    activeProgramStepNum: ?number,
    interpreterIsRunning: boolean,
    showDashConnectionError: boolean,
    selectedAction: ?string,
    isDraggingCommand: boolean,
    audioEnabled: boolean,
    actionPanelStepIndex: ?number,
    sceneNumRows: number,
    sceneNumColumns: number,
    sceneGridCellWidth: number,
    drawingEnabled: boolean
};

export default class App extends React.Component<{}, AppState> {
    appContext: AppContext;
    dashDriver: RobotDriver;
    interpreter: Interpreter;
    audioManager: AudioManager;
    focusTrapManager: FocusTrapManager;
    startingCharacterState: CharacterState;
    programSerializer: ProgramSerializer;

    constructor(props: any) {
        super(props);

        this.appContext = {
            bluetoothApiIsAvailable: FeatureDetection.bluetoothApiIsAvailable()
        };

        // Begin facing East
        this.startingCharacterState = new CharacterState(0, 0, 2, []);

        this.state = {
            program: [],
            characterState: this.startingCharacterState,
            settings: {
                language: 'en',
                addNodeExpandedMode: true
            },
            dashConnectionStatus: 'notConnected',
            activeProgramStepNum: null,
            interpreterIsRunning: false,
            showDashConnectionError: false,
            selectedAction: null,
            isDraggingCommand: false,
            audioEnabled: true,
            actionPanelStepIndex: null,
            sceneNumRows: 9,
            sceneNumColumns: 17,
            sceneGridCellWidth: 1,
            drawingEnabled: true
        };

        this.interpreter = new Interpreter(this.handleRunningStateChange);

        this.programSerializer = new ProgramSerializer();

        this.interpreter.addCommandHandler(
            'forward1',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward1');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(1, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", timeDelayMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward2',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward2');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(2, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", timeDelayMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'forward3',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('forward3');
                this.setState((state) => {
                    const newCharacterState = state.characterState.forward(3, state.drawingEnabled);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("movement", timeDelayMs, newCharacterState);
                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left45',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree to take 1/4 of that.
                const soundTime = timeDelayMs / 4;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left45');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left90',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree turn to take 1/2 of that.
                const soundTime = timeDelayMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left90');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'left180',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('left180');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnLeft(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("left", timeDelayMs,  newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right45',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 45 degree turn to take 1/4 of that.
                const soundTime = timeDelayMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right45');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(1);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right90',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // We want for a 180 degree turn to take the whole movement delay, and for a 90 degree to take 1/2 of that.
                const soundTime = timeDelayMs / 2;

                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right90');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(2);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", soundTime, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        this.interpreter.addCommandHandler(
            'right180',
            'moveCharacter',
            (interpreter, timeDelayMs) => {
                // TODO: Enable announcements again.
                // this.audioManager.playAnnouncement('right180');
                this.setState((state) => {
                    const newCharacterState = state.characterState.turnRight(4);

                    // We have to start the sound here because this is where we know the new character state.
                    this.audioManager.playSoundForCharacterState("right", timeDelayMs, newCharacterState);

                    return {
                        characterState: newCharacterState
                    };
                });
                return Utils.makeDelayedPromise(timeDelayMs);
            }
        );

        // For FakeRobotDriver, replace with:
        // this.dashDriver = new FakeRobotDriver();
        this.dashDriver = new DashDriver();

        this.audioManager = new AudioManager(this.state.audioEnabled);

        this.focusTrapManager = new FocusTrapManager();
    }

    setStateSettings(settings: $Shape<AppSettings>) {
        this.setState((state) => {
            return {
                settings: Object.assign({}, state.settings, settings)
            }
        });
    }

    getSelectedCommandName() {
        if (this.state.selectedAction !== null) {
            return this.state.selectedAction;
        } else {
            return null;
        }
    }

    handleChangeProgram = (program: Program) => {
        this.setState({
            program: program
        });
    };

    handleClickPlay = () => {
        this.interpreter.run(this.state.program).then(
            () => {}, // Do nothing on successful resolution
            (error: Error) => {
                console.log(error.name);
                console.log(error.message);
            }
        );
    };

    handleClickConnectDash = () => {
        this.setState({
            dashConnectionStatus: 'connecting',
            showDashConnectionError: false
        });
        this.dashDriver.connect(this.handleDashDisconnect).then(() => {
            this.setState({
                dashConnectionStatus: 'connected'
            });
        }, (error: Error) => {
            console.log('ERROR');
            console.log(error.name);
            console.log(error.message);
            this.setState({
                dashConnectionStatus: 'notConnected',
                showDashConnectionError: true
            });
        });
    };

    handleCancelDashConnection = () => {
        this.setState({
            showDashConnectionError: false
        });
    };

    handleDashDisconnect = () => {
        this.setState({
            dashConnectionStatus : 'notConnected'
        });
    };

    handleCommandFromCommandPalette = (command: ?string) => {
        if (command) {
            this.setState({
                selectedAction: command
            });
        } else {
            this.setState({
                selectedAction: null
            });
        }
    };

    handleDragStartCommand = (command: string) => {
        this.setState({
            isDraggingCommand: true,
            selectedAction: command,
            actionPanelStepIndex: null
        });
    };

    handleDragEndCommand = () => {
        this.setState({ isDraggingCommand: false });
    };

    handleRunningStateChange = ( interpreterRunningState : InterpreterRunningState) => {
        this.setState({
            activeProgramStepNum: interpreterRunningState.activeStep,
            interpreterIsRunning: interpreterRunningState.isRunning
        });
    };

    handleChangeActionPanelStepIndex = (index: ?number) => {
        this.setState({
            actionPanelStepIndex: index
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

    handleRootKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.focusTrapManager.handleKeyDown(e);
    };

    handleToggleAudioFeedback = (audioEnabled: boolean) => {
        this.setState({
            audioEnabled: audioEnabled
        });
    }

    handleTogglePenDown = (drawingEnabled: boolean) => {
        this.setState({
            drawingEnabled: drawingEnabled
        });
    }

    handleChangeProgramSpeed = (e: SyntheticInputEvent<HTMLInputElement>) => {
        const newMovementDelay = 4000 / Math.pow(2, parseInt(e.target.value) - 1);
        this.interpreter.timeDelayMs = newMovementDelay;
    }

    renderCommandBlocks = () => {
        const commandNames = [
            'forward1', 'forward2', 'forward3',
            'left45', 'left90', 'left180',
            'right45', 'right90', 'right180'
        ];
        const commandBlocks = [];

        for (const [index, value] of commandNames.entries()) {
            commandBlocks.push(
                <CommandPaletteCommand
                    key={`CommandBlock-${index}`}
                    commandName={value}
                    selectedCommandName={this.getSelectedCommandName()}
                    audioManager={this.audioManager}
                    onChange={this.handleCommandFromCommandPalette}
                    onDragStart={this.handleDragStartCommand}
                    onDragEnd={this.handleDragEndCommand}/>
            )
        }

        return commandBlocks;
    }

    handleRefresh = () => {
        this.setState({
            characterState: this.startingCharacterState
        });
    }

    render() {
        return (
            <IntlProvider
                    locale={this.state.settings.language}
                    messages={messages[this.state.settings.language]}>
                <div
                    onClick={this.handleRootClick}
                    onKeyDown={this.handleRootKeyDown}>
                    <header className='App__header'>
                        <Container>
                            <Row className='App__header-row'>
                                <h1 className='App__app-heading'>
                                    <FormattedMessage id='App.appHeading'/>
                                </h1>
                                <div className='App__header-right'>
                                    <div className='App__audio-toggle-switch'>
                                        <AudioFeedbackToggleSwitch
                                            value={this.state.audioEnabled}
                                            onChange={this.handleToggleAudioFeedback} />
                                    </div>
                                    {/* Dash connection removed for version 0.5
                                    <DeviceConnectControl
                                        disabled={
                                            !this.appContext.bluetoothApiIsAvailable ||
                                            this.state.dashConnectionStatus === 'connected' }
                                        connectionStatus={this.state.dashConnectionStatus}
                                        onClickConnect={this.handleClickConnectDash}>
                                        <FormattedMessage id='App.connectToDash' />
                                    </DeviceConnectControl>
                                    */}
                                </div>
                            </Row>
                        </Container>
                    </header>
                    <Container role='main' className='mb-5'>
                        {/* Dash connection removed for version 0.5
                        {!this.appContext.bluetoothApiIsAvailable &&
                            <Row className='App__bluetooth-api-warning-section'>
                                <Col>
                                    <BluetoothApiWarning/>
                                </Col>
                            </Row>
                        }
                        */}
                        <div className='App__scene-container'>
                            <Scene
                                numRows={this.state.sceneNumRows}
                                numColumns={this.state.sceneNumColumns}
                                gridCellWidth={this.state.sceneGridCellWidth}
                                characterState={this.state.characterState}
                            />
                            <div className='App__scene-controls'>
                                <div className='App__scene-controls-group'>
                                    <div className='App__penDown-toggle-switch-container'>
                                        <PenDownToggleSwitch
                                            className='App__penDown-toggle-switch'
                                            value={this.state.drawingEnabled}
                                            onChange={this.handleTogglePenDown}/>
                                    </div>
                                    <div className='App__refreshButton-container'>
                                        <RefreshButton
                                            disabled={this.state.interpreterIsRunning}
                                            onClick={this.handleRefresh}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Row className='App__program-section' noGutters={true}>
                            <Col md={5} lg={4} className='pr-md-4 mb-4 mb-md-0'>
                                <div className='App__command-palette'>
                                    <h2 className='App__command-palette-heading'>
                                        <FormattedMessage id='CommandPalette.movementsTitle' />
                                    </h2>
                                    <div className='App__command-palette-commands'>
                                        {this.renderCommandBlocks()}
                                    </div>
                                </div>
                            </Col>
                            <Col md={7} lg={8}>
                                <ProgramBlockEditor
                                    activeProgramStepNum={this.state.activeProgramStepNum}
                                    actionPanelStepIndex={this.state.actionPanelStepIndex}
                                    editingDisabled={this.state.interpreterIsRunning === true}
                                    interpreterIsRunning={this.state.interpreterIsRunning}
                                    program={this.state.program}
                                    selectedAction={this.state.selectedAction}
                                    isDraggingCommand={this.state.isDraggingCommand}
                                    audioManager={this.audioManager}
                                    focusTrapManager={this.focusTrapManager}
                                    addNodeExpandedMode={this.state.settings.addNodeExpandedMode}
                                    onChangeProgram={this.handleChangeProgram}
                                    onChangeActionPanelStepIndex={this.handleChangeActionPanelStepIndex}
                                    onChangeAddNodeExpandedMode={this.handleChangeAddNodeExpandedMode}
                                />
                            </Col>
                        </Row>
                        <div className='App__playControl-container'>
                            <div className='App__playButton-container'>
                                <PlayButton
                                    interpreterIsRunning={this.state.interpreterIsRunning}
                                    disabled={
                                        this.state.interpreterIsRunning ||
                                        programIsEmpty(this.state.program)}
                                    onClick={this.handleClickPlay}
                                />
                            </div>
                            <ProgramSpeedController onChange={this.handleChangeProgramSpeed}/>
                        </div>
                    </Container>
                </div>
                <DashConnectionErrorModal
                    show={this.state.showDashConnectionError}
                    onCancel={this.handleCancelDashConnection}
                    onRetry={this.handleClickConnectDash}/>
            </IntlProvider>
        );
    }

    componentDidMount() {
        if (window.location.search != null) {
            const params = new C2lcURLParams(window.location.search);
            const programQuery = params.getProgram();
            if (programQuery != null) {
                try {
                    this.setState({
                        program: this.programSerializer.deserialize(programQuery)
                    });
                } catch(err) {
                    console.log(`Error parsing program: ${programQuery}`);
                    console.log(err.toString());
                }
            }
        }
    }

    componentDidUpdate(prevProps: {}, prevState: AppState) {
        if (this.state.program !== prevState.program) {
            const serializedProgram = this.programSerializer.serialize(this.state.program);
            window.history.pushState(
                {p: serializedProgram},
                '',
                Utils.generateEncodedProgramURL('0.5', serializedProgram));
        }
        if (this.state.audioEnabled !== prevState.audioEnabled) {
            this.audioManager.setAudioEnabled(this.state.audioEnabled);
        }
        /* Dash connection removed for version 0.5
        if (this.state.dashConnectionStatus !== prevState.dashConnectionStatus) {
            console.log(this.state.dashConnectionStatus);

            if (this.state.dashConnectionStatus === 'connected') {
                this.interpreter.addCommandHandler('forward', 'dash',
                    this.dashDriver.forward.bind(this.dashDriver));
                this.interpreter.addCommandHandler('left', 'dash',
                    this.dashDriver.left.bind(this.dashDriver));
                this.interpreter.addCommandHandler('right', 'dash',
                    this.dashDriver.right.bind(this.dashDriver));
            } else if (this.state.dashConnectionStatus === 'notConnected') {
                // TODO: Remove Dash handlers

                if (this.state.interpreterIsRunning) {
                    this.interpreter.stop();
                }
            }
        }
        */
    }
}
