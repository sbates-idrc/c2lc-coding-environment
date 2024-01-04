// @flow

import { App } from './App';
import type { AppState } from './App';
import CharacterMessageBuilder from './CharacterMessageBuilder';
import type { CharacterUpdate } from './CharacterState';
import type { IntlShape } from 'react-intl';
import SceneDimensions from './SceneDimensions';
import type { AudioManager, BlockName } from './types';

// The ActionsHandler is called by the Interpreter for each program
// step action as the program is running, and is responsible for
// implementing the action behaviours

export type ActionResult = 'success' | 'movementBlocked';

export default class ActionsHandler {
    app: App;
    audioManager: AudioManager;
    sceneDimensions: SceneDimensions;
    characterMessageBuilder: CharacterMessageBuilder;

    constructor(app: App, audioManager: AudioManager, sceneDimensions: SceneDimensions, intl: IntlShape) {
        this.app = app;
        this.audioManager = audioManager;
        this.sceneDimensions = sceneDimensions;
        this.characterMessageBuilder = new CharacterMessageBuilder(sceneDimensions, intl);
    }

    doAction(action: BlockName, stepTimeMs: number): Promise<ActionResult> {
        switch(action) {
            case 'forward1':
                return this.forward(1, action, stepTimeMs);
            case 'forward2':
                return this.forward(2, action, stepTimeMs);
            case 'forward3':
                return this.forward(3, action, stepTimeMs);
            case 'backward1':
                return this.backward(1, action, stepTimeMs);
            case 'backward2':
                return this.backward(2, action, stepTimeMs);
            case 'backward3':
                return this.backward(3, action, stepTimeMs);
            case 'left45':
                return this.turnLeft(1, action, stepTimeMs);
            case 'left90':
                return this.turnLeft(2, action, stepTimeMs);
            case 'left180':
                return this.turnLeft(4, action, stepTimeMs);
            case 'right45':
                return this.turnRight(1, action, stepTimeMs);
            case 'right90':
                return this.turnRight(2, action, stepTimeMs);
            case 'right180':
                return this.turnRight(4, action, stepTimeMs);
            default:
                return Promise.reject(new Error(`Unknown action: ${action}`));
        }
    }

    forward(distance: number, action: string, stepTimeMs: number): Promise<ActionResult> {
        return new Promise((resolve) => {
            this.app.setState((state) => {
                const characterUpdate = state.characterState.forward(distance,
                    state.drawingEnabled, state.customBackground);
                this.audioManager.playSoundForCharacterState(action,
                    stepTimeMs, characterUpdate.characterState,
                    this.sceneDimensions);
                setTimeout(() => {
                    resolve(this.getActionResultForCharacterUpdate(characterUpdate));
                }, stepTimeMs);
                return this.buildStateUpdate(characterUpdate);
            });
        });
    }

    backward(distance: number, action: string, stepTimeMs: number): Promise<ActionResult> {
        return new Promise((resolve) => {
            this.app.setState((state) => {
                const characterUpdate = state.characterState.backward(distance,
                    state.drawingEnabled, state.customBackground);
                this.audioManager.playSoundForCharacterState(action,
                    stepTimeMs, characterUpdate.characterState,
                    this.sceneDimensions);
                setTimeout(() => {
                    resolve(this.getActionResultForCharacterUpdate(characterUpdate));
                }, stepTimeMs);
                return this.buildStateUpdate(characterUpdate);
            });
        });
    }

    turnLeft(amountEighthsOfTurn: number, action: string, stepTimeMs: number): Promise<ActionResult> {
        return new Promise((resolve) => {
            this.app.setState((state) => {
                const newCharacterState = state.characterState.turnLeft(amountEighthsOfTurn);
                this.audioManager.playSoundForCharacterState(action,
                    stepTimeMs, newCharacterState, this.sceneDimensions);
                setTimeout(() => { resolve('success'); }, stepTimeMs);
                return {
                    characterState: newCharacterState
                };
            });
        });
    }

    turnRight(amountEighthsOfTurn: number, action: string, stepTimeMs: number): Promise<ActionResult> {
        return new Promise((resolve) => {
            this.app.setState((state) => {
                const newCharacterState = state.characterState.turnRight(amountEighthsOfTurn);
                this.audioManager.playSoundForCharacterState(action,
                    stepTimeMs, newCharacterState, this.sceneDimensions);
                setTimeout(() => { resolve('success'); }, stepTimeMs);
                return {
                    characterState: newCharacterState
                };
            });
        });
    }

    getActionResultForCharacterUpdate(characterUpdate: CharacterUpdate): ActionResult {
        if (characterUpdate.event != null) {
            switch(characterUpdate.event.type) {
                case 'endOfScene':
                    return 'movementBlocked';
                case 'hitWall':
                    return 'movementBlocked';
                default:
                    return 'success';
            }
        }
        return 'success';
    }

    buildStateUpdate(characterUpdate: CharacterUpdate): $Shape<AppState> {
        const stateUpdate: $Shape<AppState> = {
            characterState: characterUpdate.characterState
        };

        if (characterUpdate.event != null) {
            const message = this.characterMessageBuilder.buildMessage(characterUpdate.event);
            if (message != null) {
                stateUpdate.message = message;
            }
        }

        return stateUpdate;
    }
};
