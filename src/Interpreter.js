// @flow

import { App } from './App';
import ActionsHandler from './ActionsHandler';
import ProgramSequence from './ProgramSequence';
import type { ProgramBlock } from './types';

export default class Interpreter {
    stepTimeMs: number;
    app: App;
    actionsHandler: ActionsHandler;
    continueRunActive: boolean;

    constructor(stepTimeMs: number, app: App, actionsHandler: ActionsHandler) {
        this.stepTimeMs = stepTimeMs;
        this.app = app;
        this.actionsHandler = actionsHandler;
        this.continueRunActive = false;
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
                const block = currentProgramStep.block;
                if (block === 'startLoop') {
                    this.doStartLoop(programSequence).then(() => {
                        this.app.advanceProgramCounter(resolve);
                    });
                } else if (block === 'endLoop') {
                    // We don't intend for the programCounter to ever be on an
                    // 'endLoop' block, but we might have a bug that would
                    // cause that case to happen and we want to handle it
                    // gracefully
                    this.app.advanceProgramCounter(resolve);
                } else {
                    this.doAction(currentProgramStep).then(() => {
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

    doAction(programStep: ProgramBlock): Promise<any> {
        return this.actionsHandler.doAction(programStep.block, this.stepTimeMs);
    }
}
