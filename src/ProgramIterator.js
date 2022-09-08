// @flow

import type {Program, ProgramBlock} from './types';

// ProgramIterator provides an interface for iterating through the blocks
// of a program. It provides one step lookahead by making the next stepNumber
// and block, if there is one, available as properties of the ProgramIterator
// instance. Immediately after construction, the stepNumber property will be 0
// and the block property will contain the first block, if there is one.

export default class ProgramIterator {
    program: Program;
    done: boolean;
    stepNumber: number;
    programBlock: ?ProgramBlock;
    constructor(program: Program) {
        this.program = program;
        this.done = program.length === 0;
        this.stepNumber = 0;
        this.programBlock = program[0];
    }

    next(): void {
        if (this.stepNumber < this.program.length - 1) {
            this.stepNumber += 1;
            this.programBlock = this.program[this.stepNumber];
        } else {
            this.done = true;
            this.programBlock = undefined;
        }
    }
}
