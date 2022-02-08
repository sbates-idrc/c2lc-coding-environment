// @flow

import { generateLoopLabel } from './Utils';
import type { CommandName, Program, ProgramBlock } from './types';

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    loopCounter: number;
    dynamicProgramData: any;

    constructor(program: Program, programCounter: number, loopCounter: number, dynamicProgramData: any) {
        this.program = program;
        this.programCounter = programCounter;
        this.loopCounter = loopCounter;
        this.dynamicProgramData = dynamicProgramData;
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

    getDynamicProgramData(): any {
        return this.dynamicProgramData;
    }

    getCurrentProgramStep(): ProgramBlock {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): ProgramBlock {
        return this.program[index];
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(program, this.programCounter, this.loopCounter, this.dynamicProgramData);
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, this.dynamicProgramData);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(program, programCounter, this.loopCounter, this.dynamicProgramData);
    }

    updateProgramCounterAndDynamicProgramData(programCounter: number, dynamicProgramData: any) {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, dynamicProgramData);
    }

    incrementProgramCounter(): ProgramSequence {
        return new ProgramSequence(this.program, this.programCounter + 1, this.loopCounter, this.dynamicProgramData);
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
        program.splice(index, 1);
        if (index < this.programCounter && this.program.length > 1) {
            return this.updateProgramAndProgramCounter(program, this.programCounter - 1);
        } else {
            return this.updateProgram(program);
        }
    }

    swapStep(indexFrom: number, indexTo: number): ProgramSequence {
        const program = this.program.slice();
        if (program[indexFrom] != null && program[indexTo] != null) {
            const currentStep = program[indexFrom];
            program[indexFrom] = program[indexTo];
            program[indexTo] = currentStep;
        }
        return this.updateProgram(program);
    }

    usesAction(action: CommandName): boolean {
        for (let index = 0; index < this.program.length; index++) {
            if (this.program[index].block === action) { return true; }
        }

        return false;
    }

    initiateProgramRun(): ProgramSequence {
        const program = this.program.slice();
        const dynamicProgramData = {};
        for (let i = 0; i < program.length; i++) {
            const { block, label, iterations } = program[i];
            if (block === 'startLoop' && label != null && iterations != null) {
                dynamicProgramData[label] = {
                    iterationsLeft: iterations
                }
            }
        }
        return new ProgramSequence(this.program, 0, this.loopCounter, dynamicProgramData);
    }

    resetLoopIterationsLeft(index: number): any {
        const currentLoopIterations = this.program[index].iterations;
        const loopLabel = this.program[index].label;
        const dynamicProgramData = this.dynamicProgramData;
        if (currentLoopIterations != null && dynamicProgramData[loopLabel]) {
            dynamicProgramData[loopLabel].iterationsLeft = currentLoopIterations;
        }
        return new ProgramSequence(this.program, this.programCounter, this.loopCounter, dynamicProgramData);
    }

    decrementLoopIterationsLeft(loopLabel: string): any {
        const program = this.program;
        const dynamicProgramData = this.dynamicProgramData;
        for (let i = 0; i < program.length; i++) {
            const { block, label } = program[i];
            if (block === 'startLoop' && label === loopLabel) {
                if (dynamicProgramData[loopLabel] != null && dynamicProgramData[loopLabel].iterationsLeft > 0) {
                    dynamicProgramData[loopLabel].iterationsLeft--;
                }
            }
        }
        return new ProgramSequence(this.program, this.programCounter, this.loopCounter, dynamicProgramData);
    }
}
