// @flow

import { generateLoopLabel } from './Utils';
import type { CommandName, Program, ProgramBlock } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    loopCounter: number;

    constructor(program: Program, programCounter: number, loopCounter: number) {
        this.program = program;
        this.programCounter = programCounter;
        this.loopCounter = loopCounter;
    }

    initiateProgramRun(): ProgramSequence {
        const program = this.program.slice();
        for (let i = 0; i < program.length; i++) {
            const { block } = program[i];
            if (block === 'startLoop' && program[i].iterations != null) {
                program[i] = Object.assign(program[i], {iterationsLeft: program[i].iterations});
            }
        }
        return new ProgramSequence(program, 0, this.loopCounter);
    }

    getProgram(): Program {
        return this.program;
    }

    getProgramLength(): number {
        return this.program.length;
    }

    getProgramCounter(): number {
        return this.programCounter;
    }

    getCurrentProgramStep(): ProgramBlock {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): ProgramBlock {
        return this.program[index];
    }

    updateProgramSequence(program: Program, programCounter: number, loopCounter: number): ProgramSequence {
        program = this.updateCachedLoopData(program, loopCounter);
        return new ProgramSequence(program, programCounter, loopCounter);
    }

    updateCachedLoopData(program: Program, loopCounter: number): Program {
        if (loopCounter > 0) {
            // loopStack is a stack that stores loop labels from startLoop blocks
            // while iterating through the program to keep track of direct parent loop
            const loopStack = [];
            // loopPositionStack is a stack that stores position of a program step within a direct parent loop
            const loopPositionStack = [];
            let containingLoopPosition = 0;
            for (let i = 0; i < program.length; i++) {
                const currentProgramBlock = program[i];
                if (currentProgramBlock.block === 'endLoop') {
                    loopStack.pop();
                    if (loopPositionStack.length > 0) {
                        containingLoopPosition += loopPositionStack.pop();
                    }
                }
                if (loopStack.length > 0) {
                    const cache = new Map();
                    containingLoopPosition++;
                    cache.set('containingLoopLabel', loopStack[loopStack.length - 1]);
                    cache.set('containingLoopPosition', containingLoopPosition);
                    program[i] = Object.assign(
                        {},
                        program[i],
                        {
                            // $FlowFixMe: type argument 'V' of cache can be undefined
                            cache
                        }
                    );
                } else {
                    const currentCache = program[i].cache;
                    if (currentCache != null) {
                        currentCache.delete('containingLoopLabel');
                        currentCache.delete('containingLoopPosition');
                    }
                }
                if (currentProgramBlock.block === 'startLoop') {
                    loopStack.push(currentProgramBlock.label);
                    if (containingLoopPosition > 0) {
                        loopPositionStack.push(containingLoopPosition);
                    }
                    containingLoopPosition = 0;
                }
            }
        }
        return program;
    }

    updateProgram(program: Program): ProgramSequence {
        program = this.updateCachedLoopData(program, this.loopCounter);
        return new ProgramSequence(program, this.programCounter, this.loopCounter);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.loopCounter);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        program = this.updateCachedLoopData(program, this.loopCounter);
        return new ProgramSequence(program, programCounter, this.loopCounter);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1, this.loopCounter);
    }

    overwriteStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        program[index] = {block: command};
        return this.updateProgram(program);
    }

    insertStep(index: number, command: string): ProgramSequence {
        const program = this.program.slice();
        if (command === 'loop') {
            this.loopCounter++;
            const loopLabel = generateLoopLabel(this.loopCounter);
            const startLoopObject = {
                block: 'startLoop',
                iterations: 1,
                label: loopLabel
            };
            const endLoopObject = {
                block: 'endLoop',
                label: loopLabel
            };
            program.splice(index, 0, startLoopObject, endLoopObject);
        } else {
            const commandObject = {
                block: command
            };
            program.splice(index, 0, commandObject);
        }
        if (index <= this.programCounter) {
            return this.updateProgramAndProgramCounter(program, this.programCounter + 1);
        } else {
            return this.updateProgram(program);
        }
    }

    deleteStep(index: number): ProgramSequence {
        const program = this.program.slice();
        const programBlock = program[index];
        let programCounter = this.programCounter;
        if (programBlock != null && programBlock.block === 'startLoop') {
            const loopLabel = programBlock.label;
            for (let i = index + 1; i < program.length; i++) {
                // Remove corresponding endLoop block
                if (program[i].block === 'endLoop') {
                    if (program[i].label != null && program[i].label === loopLabel) {
                        program.splice(i, 1);
                        break;
                    }
                }
            }
            program.splice(index, 1);
        } else if (programBlock != null && programBlock.block === 'endLoop') {
            const loopLabel = programBlock.label;
            program.splice(index, 1);
            for (let i = 0; i < index; i++) {
                // Remove corresponding startLoop block
                if (program[i].block === 'startLoop') {
                    if (program[i].label != null && program[i].label === loopLabel) {
                        program.splice(i, 1);
                        programCounter = i;
                        break;
                    }
                }
            }
        } else {
            program.splice(index, 1);
            programCounter--;
        }
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(program, programCounter);
        } else {
            return this.updateProgram(program);
        }
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        const program = this.program.slice();
        if (program[indexFrom] != null && program[indexTo] != null) {
            const swappedStep = program[indexTo];
            const currentStep = program[indexFrom];
            if (currentStep.block === 'startLoop') {
                const loopLabel = currentStep.label;
                let loopContent = [];
                for (let i = indexFrom + 1; i < program.length; i++) {
                    if (program[i].block === 'endLoop') {
                        if (program[i].label != null && program[i].label === loopLabel) {
                            loopContent = program.slice(indexFrom, i + 1);
                            break;
                        }
                    }
                }
                // Move to left
                if (indexFrom > indexTo) {
                    program.splice(indexTo, loopContent.length, ...loopContent);
                    program[indexTo + loopContent.length] = swappedStep;
                // Move to right
                } else if (indexFrom < indexTo) {
                    program[indexFrom] = swappedStep;
                    program.splice(indexFrom + 1, loopContent.length, ...loopContent);
                }
            } else if (currentStep.block === 'endLoop') {
                const loopLabel = currentStep.label;
                let loopContent = [];
                for (let i = 0; i < indexFrom; i++) {
                    if (program[i].block === 'startLoop') {
                        if (program[i].label != null && program[i].label === loopLabel) {
                            loopContent = program.slice(i, indexFrom + 1);
                            break;
                        }
                    }
                }
                // Move to left
                if (indexFrom > indexTo) {
                    program.splice(indexTo, loopContent.length, ...loopContent);
                    program[indexFrom] = swappedStep;
                // Move to right
                } else if (indexFrom < indexTo) {
                    program[indexFrom - loopContent.length + 1] = swappedStep;
                    program.splice(indexFrom - loopContent.length + 2, loopContent.length, ...loopContent);
                }
            } else {
                program[indexFrom] = program[indexTo];
                program[indexTo] = currentStep;
            }
        }
        return this.updateProgram(program);
    }

    usesAction(action: CommandName): boolean {
        for (let index = 0; index < this.program.length; index++) {
            if (this.program[index].block === action) { return true; }
        }

        return false;
    }

    decrementLoopIterations(loopLabel: string): ProgramSequence {
        const program = this.program.slice();
        for (let i = 0; i < program.length; i++) {
            const { block, iterations, iterationsLeft, label } = program[i];
            if (block === 'startLoop' && label === loopLabel) {
                if (iterationsLeft != null && iterationsLeft > 0) {
                    program[i] = {
                        block,
                        iterations: iterations,
                        iterationsLeft: iterationsLeft - 1,
                        label
                    };
                }
            }
        }
        return new ProgramSequence(program, this.programCounter + 1, this.loopCounter);
    }
}
