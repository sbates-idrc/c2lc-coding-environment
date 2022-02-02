// @flow

import ProgramSequence from './ProgramSequence';
import type { Program } from './types';

test('ProgramSequence constructor should take program and programCounter parameters', () => {
    expect.assertions(2);
    const program = [{block: 'forward'}];
    const programCounter = 0;
    const programSequence = new ProgramSequence(program, programCounter, 0);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
});

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(2);
    const program = [{block: 'forward'}];
    let programSequence = new ProgramSequence(program, 0, 0);
    const newProgramCounter = 1;
    programSequence = programSequence.updateProgramCounter(newProgramCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(newProgramCounter);
});

test('incrementProgramCounter should increment programCounter by 1', () => {
    expect.assertions(1);
    let programSequence = new ProgramSequence([], 0, 0);
    programSequence = programSequence.incrementProgramCounter();
    expect(programSequence.getProgramCounter()).toBe(1);
});

test('usesAction should return false for any action when the sequence is empty.', () => {
    expect.assertions(3);
    const program = [];
    const programSequence = new ProgramSequence(program, 0, 0);
    expect(programSequence.usesAction('forward')).toBe(false);
    expect(programSequence.usesAction('backward3')).toBe(false);
    expect(programSequence.usesAction('left90')).toBe(false);
});

test('usesAction should return true when an action is part of the sequence.', () => {
    expect.assertions(3);
    const program = [{block: 'forward'}, {block: 'backward3'}, {block: 'left90'}];
    const programSequence = new ProgramSequence(program, 0, 0);
    expect(programSequence.usesAction('forward')).toBe(true);
    expect(programSequence.usesAction('backward3')).toBe(true);
    expect(programSequence.usesAction('left90')).toBe(true);
});

test('usesAction should return false when an action is not part of the sequence.', () => {
    expect.assertions(1);
    const program = [{block: 'backward3'}];
    const programSequence = new ProgramSequence(program, 0, 0);
    expect(programSequence.usesAction('forward')).toBe(false);
});

test.each([
    [[], 0, 0, [], 0],
    [[{block: 'forward'}], 0, 0, [], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 0, 0, [{block: 'forward2'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 0, 1, [{block: 'forward'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 1, 0, [{block: 'forward2'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 1, 1, [{block: 'forward'}], 1],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, [{block: 'forward2'}, {block: 'forward3'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 1, [{block: 'forward'}, {block: 'forward3'}], 1],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 2, [{block: 'forward'}, {block: 'forward2'}], 1]
])('deleteStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter, 0);
        const result = programSequence.deleteStep(index);
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [[], 0, 0, [{block: 'left45'}], 1, 'left45'],
    [[{block: 'forward'}], 0, 0, [{block: 'left45'}, {block: 'forward'}], 1, 'left45'],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, [{block: 'left45'}, {block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 2, 'left45'],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 1, [{block: 'forward'}, {block: 'left45'}, {block: 'forward2'}, {block: 'forward3'}], 2, 'left45'],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 2, [{block: 'forward'}, {block: 'forward2'}, {block: 'left45'}, {block: 'forward3'}], 1, 'left45'],
    [[], 0, 0, [{block: 'startLoop', iterations: 1, label: 'A'}, {block: 'endLoop', label: 'A'}], 1, 'loop']
])('insertStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number, commandName: string) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter, 0);
        const result = programSequence.insertStep(index, commandName);
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [[{block: 'forward'}, {block: 'forward2'}], 0, 0, [{block: 'left45'}, {block: 'forward2'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 0, 1, [{block: 'forward'}, {block: 'left45'}], 0],
    [[{block: 'forward'}, {block: 'forward2'}], 1, 0, [{block: 'left45'}, {block: 'forward2'}], 1],
    [[{block: 'forward'}, {block: 'forward2'}], 1, 1, [{block: 'forward'}, {block: 'left45'}], 1]
])('overwriteStep',
    (program: Program, programCounter: number, index: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter, 0);
        const result = programSequence.overwriteStep(index, 'left45');
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);

test.each([
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 0, [{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 1, [{block: 'forward2'}, {block: 'forward'}, {block: 'forward3'}], 1],
    [[{block: 'forward'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 2, [{block: 'forward3'}, {block: 'forward2'}, {block: 'forward'}], 1]
])('swapStep',
    (program: Program, programCounter: number,
        indexFrom: number, indexTo: number,
        expectedProgram: Program, expectedProgramCounter: number) => {
        expect.assertions(3);
        const programBefore = program.slice();
        const programSequence = new ProgramSequence(program, programCounter, 0);
        const result = programSequence.swapStep(indexFrom, indexTo);
        expect(result.getProgram()).toStrictEqual(expectedProgram);
        expect(result.getProgramCounter()).toBe(expectedProgramCounter);
        expect(programSequence.getProgram()).toStrictEqual(programBefore);
    }
);
