// @flow

import {App} from './App';
import ProgramSequence from './ProgramSequence';
import type { ProgramBlock } from './types';

export type CommandHandler = { (stepTimeMs: number): Promise<void> };

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
                const currentProgramStep = programSequence.getCurrentProgramStep();
                const command = currentProgramStep.block;
                if (command === 'startLoop') {
                    this.doStartLoop(programSequence).then(() => {
                        this.app.advanceProgramCounter(resolve);
                    });
                } else if (command === 'endLoop') {
                    // We don't intend for the programCounter to ever be on an
                    // 'endLoop' block, but we might have a bug that would
                    // cause that case to happen and we want to handle it
                    // gracefully
                    this.app.advanceProgramCounter(resolve);
                } else {
                    this.doCommand(currentProgramStep).then(() => {
                        this.app.advanceProgramCounter(resolve);
                    }, (error: Error) => {
                        reject(error);
                    });
                }
            }
        });
    }

    doStartLoop(programSequence: ProgramSequence): Promise<any> {
        const programCounter = programSequence.getProgramCounter();
        if (programCounter < programSequence.getProgramLength() - 1
                && programSequence.getProgramStepAt(programCounter + 1).block === 'endLoop') {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.stepTimeMs);
            });
        } else {
            return Promise.resolve();
        }
    }

    doCommand(programStep: ProgramBlock): Promise<any> {
        const command = programStep.block;
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
            promises.push(handler(stepTimeMs));
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
