// @flow

import { generateLoopLabel } from './Utils';
import type { ProgramParserResult } from './ProgramParser';
import type { CommandName, Program, ProgramBlock, ProgramBlockCache } from './types';

// When a new loop is added to the program, initialize the number of
// iterations to this value:
const newLoopNumberOfIterations = 1;

export default class ProgramSequence {
    program: Program;
    programCounter: number;
    loopCounter: number;
    loopIterationsLeft: Map<string, number>;

    constructor(program: Program, programCounter: number, loopCounter: number, loopIterationsLeft: Map<string, number>) {
        this.program = program;
        this.programCounter = programCounter;
        this.loopCounter = loopCounter;
        this.loopIterationsLeft = loopIterationsLeft;
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

    getLoopIterationsLeft(): Map<string, number> {
        return this.loopIterationsLeft;
    }

    getCurrentProgramStep(): ProgramBlock {
        return this.program[this.programCounter];
    }

    getProgramStepAt(index: number): ProgramBlock {
        return this.program[index];
    }

    hasLoopBlock(): boolean {
        for (const programBlock of this.program) {
            if (programBlock.block === 'startLoop') {
                return true;
            }
        }
        return false;
    }

    stepIsEndLoopBlock(index: number): boolean {
        const block = this.program[index];
        return block != null && block.block === 'endLoop';
    }

    getMatchingLoopBlockIndex(index: number): ?number {
        const block = this.program[index];
        let matchingBlockIndex = undefined;
        if (block) {
            if (block.block === 'startLoop') {
                for (let i = index + 1; i < this.program.length; i++) {
                    if (this.program[i].block === 'endLoop'
                            && this.program[i].label === block.label) {
                        matchingBlockIndex = i;
                        break;
                    }
                }
            } else if (block.block === 'endLoop') {
                for (let i = index - 1; i > -1; i--) {
                    if (this.program[i].block === 'startLoop'
                            && this.program[i].label === block.label) {
                        matchingBlockIndex = i;
                        break;
                    }
                }
            }
        }
        return matchingBlockIndex;
    }

    areMatchingLoopBlocks(index1: number, index2: number) {
        const block1 = this.program[index1];
        if (block1 != null) {
            if (block1.block === 'startLoop') {
                const block2 = this.program[index2];
                return block2 != null && block2.block === 'endLoop'
                    && block1.label === block2.label;
            } else if (block1.block === 'endLoop') {
                const block2 = this.program[index2];
                return block2 != null && block2.block === 'startLoop'
                    && block1.label === block2.label;
            }
        }
        return false;
    }

    static makeProgramSequenceFromParserResult(parserResult: ProgramParserResult) {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(parserResult.program),
            0,
            parserResult.highestLoopNumber,
            new Map()
        );
    }

    static calculateCachedLoopData(program: Program): Program {
        const resultProgram: Program = [];

        // loopStack is a stack that stores loop labels from startLoop blocks
        // while iterating through the program to keep track of direct parent loop
        const loopStack = [];
        // loopPositionStack is a stack that stores position of a program step within a direct parent loop
        const loopPositionStack = [];
        let containingLoopPosition = 0;

        for (const block of program) {
            if (block.block === 'endLoop') {
                loopStack.pop();
                if (loopPositionStack.length > 0) {
                    containingLoopPosition += loopPositionStack.pop();
                }
            }
            if (loopStack.length > 0) {
                containingLoopPosition++;
                const cache: ProgramBlockCache = new Map();
                cache.set('containingLoopLabel', ((loopStack[loopStack.length - 1]: any): string));
                cache.set('containingLoopPosition', containingLoopPosition);
                resultProgram.push(Object.assign(
                    {},
                    block,
                    {
                        cache
                    }
                ));
            } else {
                resultProgram.push(Object.assign({}, block));
                delete resultProgram[resultProgram.length - 1]['cache'];
            }
            if (block.block === 'startLoop') {
                loopStack.push(block.label);
                if (containingLoopPosition > 0) {
                    loopPositionStack.push(containingLoopPosition);
                }
                containingLoopPosition = 0;
            }
        }

        return resultProgram;
    }

    updateProgram(program: Program): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            this.programCounter,
            this.loopCounter,
            this.loopIterationsLeft
        );
    }

    updateProgramCounter(programCounter: number): ProgramSequence {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, this.loopIterationsLeft);
    }

    updateProgramAndProgramCounter(program: Program, programCounter: number): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            programCounter,
            this.loopCounter,
            this.loopIterationsLeft
        );
    }

    updateProgramCounterAndLoopIterationsLeft(programCounter: number, loopIterationsLeft: Map<string, number>) {
        return new ProgramSequence(this.program, programCounter, this.loopCounter, loopIterationsLeft);
    }

    updateProgramAndLoopIterationsLeft(program: Program, loopIterationsLeft: Map<string, number>) {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            this.programCounter,
            this.loopCounter,
            loopIterationsLeft
        );
    }

    updateProgramSequence(program: Program,
        programCounter: number,
        loopCounter: number,
        loopIterationsLeft: Map<string, number>): ProgramSequence {
        return new ProgramSequence(
            ProgramSequence.calculateCachedLoopData(program),
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    advanceProgramCounter(advancePastEmptyLoopEntirely: boolean): ProgramSequence {
        let newProgramCounter = this.programCounter;
        const newLoopIterationsLeft = new Map(this.loopIterationsLeft);

        // We don't intend for the programCounter to ever be on an 'endLoop'
        // block, but we might have a bug that would cause that case to happen
        // and we want to handle it gracefully
        if (this.program[newProgramCounter].block !== 'endLoop') {
            newProgramCounter += 1;
        }

        while (newProgramCounter < this.getProgramLength()
                && this.program[newProgramCounter].block === 'endLoop') {
            const label = this.program[newProgramCounter].label;
            if (label != null) {
                const currentIterationsLeft = newLoopIterationsLeft.get(label);
                if (currentIterationsLeft != null) {
                    // If the number of iterations left for the loop is > 0,
                    // decrement it
                    let newIterationsLeft = currentIterationsLeft;
                    if (currentIterationsLeft > 0) {
                        newIterationsLeft = currentIterationsLeft - 1
                        newLoopIterationsLeft.set(label, newIterationsLeft);
                    }
                    if (newIterationsLeft > 0) {
                        // Look for startLoop blocks
                        for (let i = newProgramCounter; i > -1; i--) {
                            const block = this.program[i];
                            if (block.block === 'startLoop') {
                                // Check if the startLoop has same label as the endLoop
                                if (block.label != null && block.label === label) {
                                    // The startLoop block has the same label
                                    // as the endLoop block: we have found the
                                    // corresponding startLoop block
                                    if (advancePastEmptyLoopEntirely && i === newProgramCounter - 1) {
                                        newIterationsLeft = 0
                                        newLoopIterationsLeft.set(label, newIterationsLeft);
                                        newProgramCounter += 1;
                                        break;
                                    } else {
                                        // Set the newProgramCounter to the start of the loop
                                        newProgramCounter = i;
                                        break;
                                    }
                                } else {
                                    // When the startLoop block has a different
                                    // label than the endLoop block, we have
                                    // found a nested loop:
                                    // reset its iterationsLeft
                                    const nestedLoopLabel = this.program[i].label;
                                    const nestLoopIterations = this.program[i].iterations;
                                    if (nestedLoopLabel != null && nestLoopIterations != null) {
                                        newLoopIterationsLeft.set(nestedLoopLabel, nestLoopIterations);
                                    }
                                }
                            }
                        }
                    } else {
                        // When there's no more iterations left,
                        // increment the newProgramCounter
                        newProgramCounter += 1;
                    }
                } else {
                    // Iterations left is missing for the loop, we can't
                    // process it
                    break;
                }
            }
        }
        return this.updateProgramCounterAndLoopIterationsLeft(
            newProgramCounter,
            newLoopIterationsLeft
        );
    }

    overwriteStep(index: number, command: CommandName): ProgramSequence {
        const program = this.program.slice();
        let programCounter = this.programCounter;
        let loopCounter = this.loopCounter;
        const loopIterationsLeft = new Map(this.loopIterationsLeft);
        if (command === 'loop') {
            if (this.hasLoopBlock()) {
                loopCounter++;
            } else {
                loopCounter = 1;
            }
            const loopLabel = generateLoopLabel(loopCounter);
            const startLoopObject = {
                block: 'startLoop',
                iterations: newLoopNumberOfIterations,
                label: loopLabel
            };
            const endLoopObject = {
                block: 'endLoop',
                label: loopLabel
            };
            program.splice(index, 1, startLoopObject, endLoopObject);
            loopIterationsLeft.set(loopLabel, newLoopNumberOfIterations);
            if (index < programCounter) {
                programCounter++;
            }
        } else {
            const commandObject = {
                block: command
            };
            program.splice(index, 1, commandObject);
        }
        return this.updateProgramSequence(
            program,
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    insertStep(index: number, command: CommandName): ProgramSequence {
        const program = this.program.slice();
        let programCounter = this.programCounter;
        let loopCounter = this.loopCounter;
        const loopIterationsLeft = new Map(this.loopIterationsLeft);
        if (command === 'loop') {
            if (this.hasLoopBlock()) {
                loopCounter++;
            } else {
                loopCounter = 1;
            }
            const loopLabel = generateLoopLabel(loopCounter);
            const startLoopObject = {
                block: 'startLoop',
                iterations: newLoopNumberOfIterations,
                label: loopLabel
            };
            const endLoopObject = {
                block: 'endLoop',
                label: loopLabel
            };
            program.splice(index, 0, startLoopObject, endLoopObject);
            loopIterationsLeft.set(loopLabel, newLoopNumberOfIterations);
            if (index <= programCounter) {
                programCounter += 2;
            }
        } else {
            const commandObject = {
                block: command
            };
            program.splice(index, 0, commandObject);
            if (index <= programCounter) {
                programCounter++;
            }
        }
        return this.updateProgramSequence(
            program,
            programCounter,
            loopCounter,
            loopIterationsLeft
        );
    }

    deleteStep(index: number): ProgramSequence {
        if (index >= this.getProgramLength()) {
            return this;
        }

        const newProgram = this.program.slice();
        let newProgramCounter = this.programCounter;
        let newLoopIterationsLeft = this.loopIterationsLeft;

        // If we are deleting the block that the programCounter is on,
        // or the corresponding loop block for the block that the
        // programCounter is on, we first advance the programCounter to what
        // would have happened after the block we are deleting

        if (index === this.programCounter
                || this.areMatchingLoopBlocks(index, this.programCounter)) {
            const advancedProgramSequence = this.advanceProgramCounter(true);
            newProgramCounter = advancedProgramSequence.programCounter;
            newLoopIterationsLeft = advancedProgramSequence.loopIterationsLeft;
        }

        let numDeletedBeforePC = 0;

        if (index < newProgramCounter) {
            numDeletedBeforePC = 1;
        }

        const block = newProgram[index];
        if (block != null && block.block === 'startLoop') {
            const matchingBlockIndex = this.getMatchingLoopBlockIndex(index);
            if (matchingBlockIndex != null) {
                if (matchingBlockIndex < newProgramCounter) {
                    numDeletedBeforePC += 1;
                }
                newProgram.splice(matchingBlockIndex, 1);
                newProgram.splice(index, 1);
            }
        } else if (block != null && block.block === 'endLoop') {
            const matchingBlockIndex = this.getMatchingLoopBlockIndex(index);
            if (matchingBlockIndex != null) {
                if (matchingBlockIndex < newProgramCounter) {
                    numDeletedBeforePC += 1;
                }
                newProgram.splice(index, 1);
                newProgram.splice(matchingBlockIndex, 1);
            }
        } else {
            newProgram.splice(index, 1);
        }

        return this.updateProgramSequence(
            newProgram,
            newProgramCounter - numDeletedBeforePC,
            this.loopCounter,
            newLoopIterationsLeft
        );
    }

    moveToNextStepDisabled(indexFrom: number): boolean {
        if (this.program.length === 0) {
            return true;
        }
        const programLastIndex = this.program.length - 1;
        if (indexFrom < 0 || indexFrom >= programLastIndex) {
            return true;
        }
        const { block, label } = this.program[indexFrom];
        if (block === 'startLoop') {
            const lastProgramStep = this.program[programLastIndex];
            if (lastProgramStep.block === 'endLoop' && lastProgramStep.label === label) {
                return true;
            }
        }
        return false;
    }

    moveToPreviousStepDisabled(indexFrom: number): boolean {
        if (this.program.length === 0) {
            return true;
        }
        if (indexFrom <= 0 || indexFrom >= this.program.length) {
            return true;
        }
        const { block, label } = this.program[indexFrom];
        if (block === 'endLoop') {
            const firstProgramStep = this.program[0];
            if (firstProgramStep.block === 'startLoop' && firstProgramStep.label === label) {
                return true;
            }
        }
        return false;
    }

    moveStepNext(indexFrom: number): ProgramSequence {
        if (this.moveToNextStepDisabled(indexFrom)) {
            return this;
        }

        const newProgram = this.program.slice();

        if (this.program[indexFrom] != null && this.program[indexFrom].block === 'startLoop') {
            const endLoopIndex = this.getMatchingLoopBlockIndex(indexFrom);
            if (endLoopIndex != null) {
                newProgram.splice(indexFrom, 0, this.program[endLoopIndex + 1]);
                newProgram.splice(endLoopIndex + 2, 1);
            }
        } else if (this.program[indexFrom] != null && this.program[indexFrom].block === 'endLoop') {
            const startLoopIndex = this.getMatchingLoopBlockIndex(indexFrom);
            if (startLoopIndex != null) {
                newProgram.splice(startLoopIndex, 0, this.program[indexFrom + 1]);
                newProgram.splice(indexFrom + 2, 1);
            }
        } else {
            newProgram[indexFrom] = this.program[indexFrom + 1];
            newProgram[indexFrom + 1] = this.program[indexFrom];
        }

        return this.updateProgram(newProgram);
    }

    moveStepPrevious(indexFrom: number): ProgramSequence {
        if (this.moveToPreviousStepDisabled(indexFrom)) {
            return this;
        }

        const newProgram = this.program.slice();

        if (this.program[indexFrom] != null && this.program[indexFrom].block === 'startLoop') {
            const endLoopIndex = this.getMatchingLoopBlockIndex(indexFrom);
            if (endLoopIndex != null) {
                newProgram.splice(endLoopIndex + 1, 0, this.program[indexFrom - 1]);
                newProgram.splice(indexFrom - 1, 1);
            }
        } else if (this.program[indexFrom] != null && this.program[indexFrom].block === 'endLoop') {
            const startLoopIndex = this.getMatchingLoopBlockIndex(indexFrom);
            if (startLoopIndex != null) {
                newProgram.splice(indexFrom + 1, 0, this.program[startLoopIndex - 1]);
                newProgram.splice(startLoopIndex - 1, 1);
            }
        } else {
            newProgram[indexFrom] = this.program[indexFrom - 1];
            newProgram[indexFrom - 1] = this.program[indexFrom];
        }

        return this.updateProgram(newProgram);
    }

    usesAction(action: CommandName): boolean {
        for (let index = 0; index < this.program.length; index++) {
            const stepAction = this.program[index].block;
            if (stepAction === action || (action === "loop" && (stepAction === "startLoop" || stepAction === "endLoop")) ) {
                return true;
            }
        }

        return false;
    }

    initiateProgramRun(): ProgramSequence {
        const loopIterationsLeft = new Map();
        for (let i = 0; i < this.program.length; i++) {
            const { block, label, iterations } = this.program[i];
            if (block === 'startLoop' && label != null && iterations != null) {
                loopIterationsLeft.set(label, iterations);
            }
        }
        return new ProgramSequence(this.program, 0, this.loopCounter, loopIterationsLeft);
    }
}
