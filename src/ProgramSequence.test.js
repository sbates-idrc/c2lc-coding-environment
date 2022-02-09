// @flow

import ProgramSequence from './ProgramSequence';
import type { Program } from './types';

test('ProgramSequence constructor should take program and programCounter parameters', () => {
    expect.assertions(2);
    const program = [{block: 'forward1'}];
    const programCounter = 0;
    const programSequence = new ProgramSequence(program, programCounter, 0);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
});

test('initiateProgramRun should set iterationsLeft on startLoop blocks, as well as set programCounter to 0', () => {
    expect.assertions(2);
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const expectedProgram = [
        {block: 'startLoop', iterations: 3, iterationsLeft: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, iterationsLeft: 2, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const programSequence = new ProgramSequence(program, 3, 2);
    const updatedProgramSequence = programSequence.initiateProgramRun();
    expect(updatedProgramSequence.getProgram()).toStrictEqual(expectedProgram);
    expect(updatedProgramSequence.getProgramCounter()).toBe(0);
});

test('updateProgramStructure updates program with additional properties about nested loop', () => {
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'forward3'},
        {block: 'startLoop', iterations: 1, label: 'C'},
        {block: 'forward1'},
        {block: 'forward2'},
        {block: 'endLoop', label: 'C'},
        {block: 'forward3'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const firstStepCacheData = new Map();
    firstStepCacheData.set('containingLoopPosition', 1);
    firstStepCacheData.set('containingLoopLabel', 'A');
    const secondStepCacheData = new Map();
    secondStepCacheData.set('containingLoopPosition', 1);
    secondStepCacheData.set('containingLoopLabel', 'B');
    const thirdStepCacheData = new Map();
    thirdStepCacheData.set('containingLoopPosition', 2);
    thirdStepCacheData.set('containingLoopLabel', 'B');
    const fourthStepCacheData = new Map();
    fourthStepCacheData.set('containingLoopPosition', 1);
    fourthStepCacheData.set('containingLoopLabel', 'C');
    const fifthStepCacheData = new Map();
    fifthStepCacheData.set('containingLoopPosition', 2);
    fifthStepCacheData.set('containingLoopLabel', 'C');
    const sixthStepCacheData = new Map();
    sixthStepCacheData.set('containingLoopPosition', 5);
    sixthStepCacheData.set('containingLoopLabel', 'B');
    const seventhStepCacheData = new Map();
    seventhStepCacheData.set('containingLoopPosition', 6);
    seventhStepCacheData.set('containingLoopLabel', 'B');
    const eighthStepCacheData = new Map();
    eighthStepCacheData.set('containingLoopPosition', 8);
    eighthStepCacheData.set('containingLoopLabel', 'A');

    const expectedProgram = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B', cache: firstStepCacheData},
        {block: 'forward3', cache: secondStepCacheData},
        {block: 'startLoop', iterations: 1, label: 'C', cache: thirdStepCacheData},
        {block: 'forward1', cache: fourthStepCacheData},
        {block: 'forward2', cache: fifthStepCacheData},
        {block: 'endLoop', label: 'C', cache: sixthStepCacheData},
        {block: 'forward3', cache: seventhStepCacheData},
        {block: 'endLoop', label: 'B', cache: eighthStepCacheData},
        {block: 'endLoop', label: 'A'}
    ]
    const programSequence = new ProgramSequence(program, 0, 2);
    const updatedProgram = programSequence.updateCachedLoopData(program, 2);
    expect(updatedProgram).toStrictEqual(expectedProgram);
})

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(2);
    const program = [{block: 'forward1'}];
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
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('backward3')).toBe(false);
    expect(programSequence.usesAction('left90')).toBe(false);
});

test('usesAction should return true when an action is part of the sequence.', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}, {block: 'backward3'}, {block: 'left90'}];
    const programSequence = new ProgramSequence(program, 0, 0);
    expect(programSequence.usesAction('forward1')).toBe(true);
    expect(programSequence.usesAction('backward3')).toBe(true);
    expect(programSequence.usesAction('left90')).toBe(true);
});

test('usesAction should return false when an action is not part of the sequence.', () => {
    expect.assertions(1);
    const program = [{block: 'backward3'}];
    const programSequence = new ProgramSequence(program, 0, 0);
    expect(programSequence.usesAction('forward1')).toBe(false);
});

test.each([
    [[], 0, 0, [], 0],
    [[{block: 'forward1'}], 0, 0, [], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 0, 0, [{block: 'forward2'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 0, 1, [{block: 'forward1'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 1, 0, [{block: 'forward2'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 1, 1, [{block: 'forward1'}], 1],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, [{block: 'forward2'}, {block: 'forward3'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 1, [{block: 'forward1'}, {block: 'forward3'}], 1],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 2, [{block: 'forward1'}, {block: 'forward2'}], 1],
    [[{block: 'forward1'}, {block: 'startLoop', label: 'A', iterations: 1}, {block: 'endLoop', label: 'A'}], 1, 1, [{block: 'forward1'}], 1],
    [[{block: 'startLoop', label: 'A', iterations: 1}, {block: 'endLoop', label: 'A'}, {block: 'forward1'}], 1, 1, [{block: 'forward1'}], 1]
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
    [[{block: 'forward1'}], 0, 0, [{block: 'left45'}, {block: 'forward1'}], 1, 'left45'],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, [{block: 'left45'}, {block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 2, 'left45'],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 1, [{block: 'forward1'}, {block: 'left45'}, {block: 'forward2'}, {block: 'forward3'}], 2, 'left45'],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 2, [{block: 'forward1'}, {block: 'forward2'}, {block: 'left45'}, {block: 'forward3'}], 1, 'left45'],
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
    [[{block: 'forward1'}, {block: 'forward2'}], 0, 0, [{block: 'left45'}, {block: 'forward2'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 0, 1, [{block: 'forward1'}, {block: 'left45'}], 0],
    [[{block: 'forward1'}, {block: 'forward2'}], 1, 0, [{block: 'left45'}, {block: 'forward2'}], 1],
    [[{block: 'forward1'}, {block: 'forward2'}], 1, 1, [{block: 'forward1'}, {block: 'left45'}], 1]
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
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 0, [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 1, [{block: 'forward2'}, {block: 'forward1'}, {block: 'forward3'}], 1],
    [[{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}], 1, 0, 2, [{block: 'forward3'}, {block: 'forward2'}, {block: 'forward1'}], 1],
    [
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1, 1, 0,
        [{block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }, {block: 'forward1'}], 1
    ],
    [
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1, 3, 0,
        [{block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }, {block: 'forward1'}], 1
    ],
    [
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1, 2, 1,
        [{block: 'forward1'}, {block: 'forward2'}, {block: 'startLoop', label: 'A'}, {block: 'endLoop', label: 'A' }], 1
    ],
    [
        [{block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }, {block: 'forward1'}], 1, 0, 3,
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1
    ],
    [
        [{block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }, {block: 'forward1'}], 1, 2, 3,
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1
    ],
    [
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'forward2'}, {block: 'endLoop', label: 'A' }], 1, 2, 3,
        [{block: 'forward1'}, {block: 'startLoop', label: 'A'}, {block: 'endLoop', label: 'A' }, {block: 'forward2'}], 1
    ],
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

test('decrementLoopIteration should decrease iterationsLeft of specified loop and increment programCounter by 1', () => {
    expect.assertions(2);
    const program = [
        {block: 'startLoop', iterations: 3, iterationsLeft: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, iterationsLeft: 2, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const expectedProgram = [
        {block: 'startLoop', iterations: 3, iterationsLeft: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, iterationsLeft: 1, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ]
    const programSequence = new ProgramSequence(program, 1, 2);
    const updatedProgramSequence = programSequence.decrementLoopIterations('B');
    expect(updatedProgramSequence.getProgram()).toStrictEqual(expectedProgram);
    expect(updatedProgramSequence.getProgramCounter()).toBe(2);
})