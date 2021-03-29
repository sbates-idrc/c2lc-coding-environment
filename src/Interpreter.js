// @flow

import {App} from './App';
import ProgramSequence from './ProgramSequence';

/* eslint-disable no-use-before-define */
export type CommandHandler = { (Interpreter, stepTimeMs: number): Promise<void> };
/* eslint-enable no-use-before-define */

export default class Interpreter {
    commands: { [command: string]: { [namespace: string]: CommandHandler } };
    stepTimeMs: number;
    app: App;
    continueRunActive: boolean;

    constructor(stepTimeMs: number, app: App) {
        this.commands = {};
        this.stepTimeMs = stepTimeMs;
        this.app = app;
        this.continueRunActive = false;
    }

    addCommandHandler(command: string, namespace: string, handler: CommandHandler) {
        let commandNamespaces = this.commands[command];
        if (!commandNamespaces) {
            commandNamespaces = {};
            this.commands[command] = commandNamespaces;
        }
        commandNamespaces[namespace] = handler;
    }

    setStepTime(stepTimeMs: number) {
        this.stepTimeMs = stepTimeMs;
    }

    startRun(): Promise<void> {
        if (!this.continueRunActive) {
            return new Promise((resolve, reject) => {
                this.continueRun(resolve, reject);
            });
        } else {
            return Promise.resolve();
        }
    }

    continueRun(resolve: (result:any) => void, reject: (error: any) => void): void {
        this.continueRunActive = true;
        const runningState = this.app.getRunningState();
        if (runningState === 'running') {
            const programSequence = this.app.getProgramSequence();
            if (this.atEnd(programSequence)) {
                this.app.setRunningState('stopped');
                this.continueRunActive = false;
                resolve();
            } else {
                this.step(programSequence).then(() => {
                    this.continueRun(resolve, reject);
                }, (error: Error) => {
                    // Reject the run Promise when the step Promise is rejected
                    this.app.setRunningState('stopped');
                    this.continueRunActive = false;
                    reject(error);
                });
            }
        } else {
            // The interpreter has reached the end of execution.
            // If the running state is 'stopRequested' or 'pauseRequested',
            // then transition to the 'stopped' or 'paused' runningState,
            // as appropriate.
            if (runningState === 'stopRequested') {
                this.app.setRunningState('stopped');
            } else if (runningState === 'pauseRequested') {
                this.app.setRunningState('paused');
            }
            this.continueRunActive = false;
            resolve();
        }
    }

    atEnd(programSequence: ProgramSequence): boolean {
        return programSequence.getProgramCounter() >= programSequence.getProgramLength();
    }

    step(programSequence: ProgramSequence): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.atEnd(programSequence)) {
                // We're at the end, nothing to do
                resolve();
            } else {
                this.doCommand(programSequence.getCurrentProgramStep()).then(() => {
                    // When the command has completed, increment
                    // the programCounter and resolve the step Promise
                    this.app.incrementProgramCounter(() => {
                        resolve();
                    });
                }, (error: Error) => {
                    reject(error);
                });
            }
        });
    }

    doCommand(command: string): Promise<any> {
        const handlers = this.lookUpCommandHandlers(command);
        if (handlers.length === 0) {
            return Promise.reject(new Error(`Unknown command: ${command}`));
        } else {
            return this.callCommandHandlers(handlers);
        }
    }

    callCommandHandlers(handlers: Array<CommandHandler>): Promise<any> {
        const promises = [];
        const stepTimeMs = this.stepTimeMs;
        for (const handler of handlers) {
            promises.push(handler(this, stepTimeMs));
        }
        return Promise.all(promises);
    }

    lookUpCommandHandlers(command: string): Array<CommandHandler> {
        const commandNamespaces = this.commands[command];
        if (commandNamespaces) {
            const handlers = [];
            for (const namespace in commandNamespaces) {
                handlers.push(commandNamespaces[namespace]);
            }
            return handlers;
        } else {
            return [];
        }
    }
}
