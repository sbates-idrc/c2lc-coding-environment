// @flow

import { App } from './App';
import SceneDimensions from './SceneDimensions';
import type { AudioManager, BlockName } from './types';
import * as Utils from './Utils';

// The ActionsHandler is called by the Interpreter for each program
// step action as the program is running, and is responsible for
// implementing the action behaviours.

export default class ActionsHandler {
    app: App;
    audioManager: AudioManager;
    sceneDimensions: SceneDimensions;

    constructor(app: App, audioManager: AudioManager, sceneDimensions: SceneDimensions) {
        this.app = app;
        this.audioManager = audioManager;
        this.sceneDimensions = sceneDimensions;
    }

    doAction(action: BlockName, stepTimeMs: number): Promise<void> {
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

    forward(distance: number, action: string, stepTimeMs: number): Promise<void> {
        this.app.setState((state) => {
            const newCharacterState = state.characterState.forward(distance,
                state.drawingEnabled, state.customBackground);
            this.audioManager.playSoundForCharacterState(action,
                stepTimeMs, newCharacterState, this.sceneDimensions);
            return {
                characterState: newCharacterState
            };
        });
        return Utils.makeDelayedPromise(stepTimeMs);
    }

    backward(distance: number, action: string, stepTimeMs: number): Promise<void> {
        this.app.setState((state) => {
            const newCharacterState = state.characterState.backward(distance,
                state.drawingEnabled, state.customBackground);
            this.audioManager.playSoundForCharacterState(action,
                stepTimeMs, newCharacterState, this.sceneDimensions);
            return {
                characterState: newCharacterState
            };
        });
        return Utils.makeDelayedPromise(stepTimeMs);
    }

    turnLeft(amountEighthsOfTurn: number, action: string, stepTimeMs: number): Promise<void> {
        this.app.setState((state) => {
            const newCharacterState = state.characterState.turnLeft(amountEighthsOfTurn);
            this.audioManager.playSoundForCharacterState(action,
                stepTimeMs, newCharacterState, this.sceneDimensions);
            return {
                characterState: newCharacterState
            };
        });
        return Utils.makeDelayedPromise(stepTimeMs);
    }

    turnRight(amountEighthsOfTurn: number, action: string, stepTimeMs: number): Promise<void> {
        this.app.setState((state) => {
            const newCharacterState = state.characterState.turnRight(amountEighthsOfTurn);
            this.audioManager.playSoundForCharacterState(action,
                stepTimeMs, newCharacterState, this.sceneDimensions);
            return {
                characterState: newCharacterState
            };
        });
        return Utils.makeDelayedPromise(stepTimeMs);
    }
};
