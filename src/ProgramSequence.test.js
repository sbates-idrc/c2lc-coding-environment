// @flow

import ProgramBlockCache from './ProgramBlockCache';
import ProgramSequence from './ProgramSequence';
import type { CommandName, Program } from './types';

test('ProgramSequence constructor', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}, {block: 'startLoop', label: 'A', iterations: 3}];
    const programCounter = 0;
    const loopIterationsLeft = new Map([[ 'A', 3 ]]);
    const programSequence = new ProgramSequence(program, programCounter, 0, loopIterationsLeft);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(programCounter);
    expect(programSequence.getLoopIterationsLeft()).toBe(loopIterationsLeft);
});

describe('Test hasLoopBlock', () => {
    test('When the program has at least one loop block', () => {
        const program = [
            { block: 'startLoop', label: 'A', iterations: 3 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ];
        const programSequence = new ProgramSequence(program, 0, 0, new Map());
        expect(programSequence.hasLoopBlock()).toBe(true);
    });

    test('When the program has no loop blocks', () => {
        const program = [
            { block: 'forward1' },
            { block: 'left45' },
            { block: 'right45' }
        ];
        const programSequence = new ProgramSequence(program, 0, 0, new Map());
        expect(programSequence.hasLoopBlock()).toBe(false);
    });
});

describe('Test stepIsEndLoopBlock', () => {
    test('Empty program', () => {
        const programSequence = new ProgramSequence([], 0, 0, new Map());
        expect(programSequence.stepIsEndLoopBlock(0)).toBe(false);
    });

    test('Non-empty program', () => {
        const programSequence = new ProgramSequence(
            [
                { block: 'startLoop', label: 'A', iterations: 3 },
                { block: 'forward1' },
                { block: 'endLoop', label: 'A' }
            ],
            0, 0, new Map()
        );

        // startLoop
        expect(programSequence.stepIsEndLoopBlock(0)).toBe(false);
        // forward1
        expect(programSequence.stepIsEndLoopBlock(1)).toBe(false);
        // endLoop
        expect(programSequence.stepIsEndLoopBlock(2)).toBe(true);
        // Index past the end
        expect(programSequence.stepIsEndLoopBlock(3)).toBe(false);
    });
});

test('getMatchingLoopBlockIndex returns index of corresponding endLoop or startLoop block', () => {
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
    const programSequence = new ProgramSequence(program, 0, 0, new Map());

    // Finding endLoop
    expect(programSequence.getMatchingLoopBlockIndex(0)).toBe(9);
    expect(programSequence.getMatchingLoopBlockIndex(1)).toBe(8);
    expect(programSequence.getMatchingLoopBlockIndex(3)).toBe(6);

    // Finding startLoop
    expect(programSequence.getMatchingLoopBlockIndex(6)).toBe(3);
    expect(programSequence.getMatchingLoopBlockIndex(8)).toBe(1);
    expect(programSequence.getMatchingLoopBlockIndex(9)).toBe(0);
});

test('Test areMatchingLoopBlocks', () => {
    const program = [
        /* 0 */ {block: 'startLoop', iterations: 10, label: 'A'},
        /* 1 */ {block: 'startLoop', iterations: 20, label: 'B'},
        /* 2 */ {block: 'forward1'},
        /* 3 */ {block: 'forward1'},
        /* 4 */ {block: 'endLoop', label: 'B'},
        /* 5 */ {block: 'endLoop', label: 'A'}
    ];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());

    expect(programSequence.areMatchingLoopBlocks(0, 5)).toBe(true);
    expect(programSequence.areMatchingLoopBlocks(5, 0)).toBe(true);
    expect(programSequence.areMatchingLoopBlocks(1, 4)).toBe(true);
    expect(programSequence.areMatchingLoopBlocks(4, 1)).toBe(true);

    expect(programSequence.areMatchingLoopBlocks(0, 1)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(0, 2)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(0, 4)).toBe(false);

    expect(programSequence.areMatchingLoopBlocks(5, 1)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(5, 2)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(5, 4)).toBe(false);

    expect(programSequence.areMatchingLoopBlocks(2, 0)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(2, 3)).toBe(false);
    expect(programSequence.areMatchingLoopBlocks(2, 5)).toBe(false);
});

test('calculateCachedLoopData returns a program with additional loop data', () => {
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

    const expectedProgram = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'startLoop',
            iterations: 2,
            label: 'B',
            cache: new ProgramBlockCache('A', 1)
        },
        {
            block: 'forward3',
            cache: new ProgramBlockCache('B', 1)
        },
        {
            block: 'startLoop',
            iterations: 1,
            label: 'C',
            cache: new ProgramBlockCache('B', 2)
        },
        {
            block: 'forward1',
            cache: new ProgramBlockCache('C', 1)
        },
        {
            block: 'forward2',
            cache: new ProgramBlockCache('C', 2)
        },
        {
            block: 'endLoop',
            label: 'C',
            cache: new ProgramBlockCache('B', 5)
        },
        {
            block: 'forward3',
            cache: new ProgramBlockCache('B', 6)
        },
        {
            block: 'endLoop',
            label: 'B',
            cache: new ProgramBlockCache('A', 8)
        },
        {
            block: 'endLoop',
            label: 'A'
        }
    ];

    expect(ProgramSequence.calculateCachedLoopData(program))
        .toStrictEqual(expectedProgram);
});

test('calculateCachedLoopData replaces existing cached loop data and removes cached loop data when a block is no longer in a loop', () => {
    const program = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'forward1',
            cache: new ProgramBlockCache('B', 2)
        },
        {
            block: 'endLoop',
            label: 'A'
        },
        {
            block: 'forward2',
            cache: new ProgramBlockCache('B', 2)
        }
    ];

    const expectedProgram = [
        {
            block: 'startLoop',
            iterations: 3,
            label: 'A'
        },
        {
            block: 'forward1',
            cache: new ProgramBlockCache('A', 1)
        },
        {
            block: 'endLoop',
            label: 'A'
        },
        {
            block: 'forward2'
        }
    ];

    expect(ProgramSequence.calculateCachedLoopData(program))
        .toStrictEqual(expectedProgram);
});

test('calculateCachedLoopData works on an empty program', () => {
    expect(ProgramSequence.calculateCachedLoopData([]))
        .toStrictEqual([]);
});

test('updateProgramCounter should only update programCounter', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}];
    const loopIterationsLeft = new Map();
    let programSequence = new ProgramSequence(program, 0, 0, loopIterationsLeft);
    const newProgramCounter = 1;
    programSequence = programSequence.updateProgramCounter(newProgramCounter);
    expect(programSequence.getProgram()).toBe(program);
    expect(programSequence.getProgramCounter()).toBe(newProgramCounter);
    expect(programSequence.getLoopIterationsLeft()).toBe(loopIterationsLeft);
});

type AdvanceProgramCounterTestCase = {
    program: Program,
    programCounter: number,
    loopIterationsLeft: Map<string, number>,
    advancePastEmptyLoopEntirely: boolean,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>
};

test.each(([
    {
        program: [
            { block: 'forward1' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'left45' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map([['A', 2]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map([['A', 1]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 0]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map([['A', 2]]),
        advancePastEmptyLoopEntirely: true,
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 0]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map([['A', 2]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map([['A', 2]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 2]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 2,
        loopIterationsLeft: new Map([['A', 2]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 1]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 3,
        expectedLoopIterationsLeft: new Map([['A', 0]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'startLoop', label: 'B', iterations: 20  },
            { block: 'endLoop', label: 'B'},
            { block: 'startLoop', label: 'C', iterations: 30  },
            { block: 'endLoop', label: 'C' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 3,
        loopIterationsLeft: new Map([['A', 2], ['B', 0], ['C', 1]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1], ['B', 20], ['C', 30]])
    },
    {
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'startLoop', label: 'B', iterations: 20  },
            { block: 'endLoop', label: 'B'},
            { block: 'startLoop', label: 'C', iterations: 30  },
            { block: 'endLoop', label: 'C' },
            { block: 'endLoop', label: 'A' }
        ],
        programCounter: 3,
        loopIterationsLeft: new Map([['A', 1], ['B', 0], ['C', 1]]),
        advancePastEmptyLoopEntirely: false,
        expectedProgramCounter: 6,
        expectedLoopIterationsLeft: new Map([['A', 0], ['B', 0], ['C', 0]])
    }
]: Array<AdvanceProgramCounterTestCase>))('advanceProgramCounter', (testData: AdvanceProgramCounterTestCase) => {
    expect.assertions(2);
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        0,
        testData.loopIterationsLeft
    );
    const result = programSequence.advanceProgramCounter(testData.advancePastEmptyLoopEntirely);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
});

test('usesAction should return false for any action when the sequence is empty.', () => {
    expect.assertions(4);
    const program = [];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('backward3')).toBe(false);
    expect(programSequence.usesAction('left90')).toBe(false);
    expect(programSequence.usesAction('loop')).toBe(false);
});

test('usesAction should return true when an action is part of the sequence.', () => {
    expect.assertions(3);
    const program = [{block: 'forward1'}, {block: 'backward3'}, {block: 'left90'}];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(true);
    expect(programSequence.usesAction('backward3')).toBe(true);
    expect(programSequence.usesAction('left90')).toBe(true);
});

test('usesAction should return true for loops when a loop is used.', () => {
    expect.assertions(1);
    const program = [
        { block: 'startLoop', label: 'A', iterations: 3},
        { block: 'backward3'},
        { block: 'endLoop', label: 'A'},
    ];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('loop')).toBe(true);
});

test('usesAction should return false when an action is not part of the sequence.', () => {
    expect.assertions(2);
    const program = [{block: 'backward3'}];
    const programSequence = new ProgramSequence(program, 0, 0, new Map());
    expect(programSequence.usesAction('forward1')).toBe(false);
    expect(programSequence.usesAction('loop')).toBe(false);
});

type DeleteStepTestCase = {
    program: Program,
    programCounter: number,
    loopIterationsLeft: Map<string, number>,
    index: number,
    expectedProgram: Program,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>
};

test.each(([
    {
        program: [],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        expectedProgram: [],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        expectedProgram: [],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        expectedProgram: [
            { block: 'forward2' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 0,
        expectedProgram: [
            { block: 'forward2' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 0,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 1,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward3' }
        ],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map(),
        index: 2,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward2' }
        ],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map()
    },
    {
        program: [
            {
                block: 'forward1'
            },
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 0,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            {
                block: 'forward1'
            },
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map([['A', 0]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            },
            {
                block: 'forward1'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 1,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 0]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 1
            },
            {
                block: 'endLoop',
                label: 'A'
            },
            {
                block: 'forward1'
            }
        ],
        programCounter: 2,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 0,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 2
            },
            {
                block: 'forward1'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 0,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 2
            },
            {
                block: 'forward1'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 1]]),
        index: 2,
        expectedProgram: [
            { block: 'forward1' }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'startLoop',
                label: 'B',
                iterations: 30
            },
            {
                block: 'endLoop',
                label: 'B'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 2], ['B', 3]]),
        index: 1,
        expectedProgram: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1], ['B', 30]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'startLoop',
                label: 'B',
                iterations: 30
            },
            {
                block: 'endLoop',
                label: 'B'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 1,
        loopIterationsLeft: new Map([['A', 2], ['B', 3]]),
        index: 2,
        expectedProgram: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1], ['B', 30]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'startLoop',
                label: 'B',
                iterations: 30
            },
            {
                block: 'endLoop',
                label: 'B'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 2,
        loopIterationsLeft: new Map([['A', 2], ['B', 3]]),
        index: 1,
        expectedProgram: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 20
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1], ['B', 30]])
    },
    {
        program: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 10
            },
            {
                block: 'forward1'
            },
            {
                block: 'endLoop',
                label: 'A'
            },
            {
                block: 'left45'
            }
        ],
        programCounter: 2,
        loopIterationsLeft: new Map([['A', 2]]),
        index: 2,
        expectedProgram: [
            {
                block: 'forward1'
            },
            {
                block: 'left45'
            }
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]])
    }
]: Array<DeleteStepTestCase>))('deleteStep', (testData: DeleteStepTestCase) => {
    expect.assertions(4);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        0,
        testData.loopIterationsLeft
    );
    const result = programSequence.deleteStep(testData.index);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

type InsertStepTestCase = {
    program: Program,
    programCounter: number,
    loopCounter: number,
    loopIterationsLeft: Map<string, number>,
    index: number,
    commandName: CommandName,
    expectedProgram: Program,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>,
    expectedLoopCounter: number
};

test.each(([
    {
        program: [],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward1'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        commandName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}, {block: 'forward2'}, {block: 'forward3'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}, {block: 'forward3'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 2,
        commandName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'forward2'}, {block: 'left45'}, {block: 'forward3'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [],
        programCounter: 0,
        loopCounter: 4,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'loop',
        expectedProgram: [{block: 'startLoop', iterations: 1, label: 'A'}, {block: 'endLoop', label: 'A'}],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 1]]),
        expectedLoopCounter: 1
    },
    {
        program: [
            {block: 'startLoop', iterations: 1, label: 'B'},
            {block: 'endLoop', label: 'B'}
        ],
        programCounter: 0,
        loopCounter: 2,
        loopIterationsLeft: new Map([['B', 1]]),
        index: 2,
        commandName: 'loop',
        expectedProgram: [
            {block: 'startLoop', iterations: 1, label: 'B'},
            {block: 'endLoop', label: 'B'},
            {block: 'startLoop', iterations: 1, label: 'C'},
            {block: 'endLoop', label: 'C'}
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['B', 1], ['C', 1]]),
        expectedLoopCounter: 3
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        commandName: 'loop',
        expectedProgram: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'},
            {block: 'forward1'}
        ],
        expectedProgramCounter: 2,
        expectedLoopIterationsLeft: new Map([['A', 1]]),
        expectedLoopCounter: 1
    }
]: Array<DeleteStepTestCase>))('insertStep', (testData: InsertStepTestCase) => {
    expect.assertions(5);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        testData.loopCounter,
        testData.loopIterationsLeft
    );
    const result = programSequence.insertStep(testData.index, testData.commandName);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
    expect(result.loopCounter).toBe(testData.expectedLoopCounter);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

type OverwriteStepTestCase = {
    program: Program,
    programCounter: number,
    loopCounter: number,
    loopIterationsLeft: Map<string, number>,
    index: number,
    overwriteStepName: CommandName,
    expectedProgram: Program,
    expectedProgramCounter: number,
    expectedLoopIterationsLeft: Map<string, number>,
    expectedLoopCounter: number
};

test.each(([
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward2'}],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 0,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'left45'}, {block: 'forward2'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}, {block: 'forward2'}],
        programCounter: 1,
        loopCounter: 0,
        loopIterationsLeft: new Map(),
        index: 1,
        overwriteStepName: 'left45',
        expectedProgram: [{block: 'forward1'}, {block: 'left45'}],
        expectedProgramCounter: 1,
        expectedLoopIterationsLeft: new Map(),
        expectedLoopCounter: 0
    },
    {
        program: [{block: 'forward1'}],
        programCounter: 0,
        loopCounter: 4,
        loopIterationsLeft: new Map(),
        index: 0,
        overwriteStepName: 'loop',
        expectedProgram: [
            {block: 'startLoop', iterations: 1, label: 'A'},
            {block: 'endLoop', label: 'A'}
        ],
        expectedProgramCounter: 0,
        expectedLoopIterationsLeft: new Map([['A', 1]]),
        expectedLoopCounter: 1
    },
    {
        program: [
            {
                block: 'startLoop',
                iterations: 4,
                label: 'A'
            },
            {
                block: 'forward1'
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        programCounter: 2,
        loopCounter: 1,
        loopIterationsLeft: new Map([['A', 3]]),
        index: 1,
        overwriteStepName: 'loop',
        expectedProgram: [
            {
                block: 'startLoop',
                iterations: 4,
                label: 'A'
            },
            {
                block: 'startLoop',
                iterations: 1,
                label: 'B',
                cache: new ProgramBlockCache('A', 1)
            },
            {
                block: 'endLoop',
                label: 'B',
                cache: new ProgramBlockCache('A', 2)
            },
            {
                block: 'endLoop',
                label: 'A'
            }
        ],
        expectedProgramCounter: 3,
        expectedLoopIterationsLeft: new Map([['A', 3], ['B', 1]]),
        expectedLoopCounter: 2
    }
]: Array<OverwriteStepTestCase>))('overwriteStep', (testData: OverwriteStepTestCase) => {
    expect.assertions(5);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(
        testData.program,
        testData.programCounter,
        testData.loopCounter,
        testData.loopIterationsLeft
    );
    const result = programSequence.overwriteStep(testData.index, testData.overwriteStepName);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(testData.expectedProgramCounter);
    expect(result.getLoopIterationsLeft()).toStrictEqual(testData.expectedLoopIterationsLeft);
    expect(result.loopCounter).toBe(testData.expectedLoopCounter);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

describe('Test moveToNextStepDisabled and moveToPreviousStepDisabled', () => {
    test('Empty program', () => {
        const programSequence = new ProgramSequence(
            [],
            0,
            0,
            new Map()
        );
        expect(programSequence.moveToNextStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
    });

    test('Single movement', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'}
            ],
            0,
            0,
            new Map()
        );
        expect(programSequence.moveToNextStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
    });

    test('Two movements', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'},
                {block: 'left90'}
            ],
            0,
            0,
            new Map()
        );

        expect(programSequence.moveToNextStepDisabled(0)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(1)).toBe(true);

        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(1)).toBe(false);
    });

    test('Single empty loop', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'endLoop', label: 'A'},
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(programSequence.moveToNextStepDisabled(0)).toBe(true);
        expect(programSequence.moveToNextStepDisabled(1)).toBe(true);

        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(1)).toBe(true);
    });

    test('Loop at start', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'forward1'},
                {block: 'endLoop', label: 'A'},
                {block: 'forward1'}
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(programSequence.moveToNextStepDisabled(0)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(1)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(2)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(3)).toBe(true);

        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(1)).toBe(false);
        expect(programSequence.moveToPreviousStepDisabled(2)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(3)).toBe(false);
    });

    test('Loop at end', () => {
        const programSequence = new ProgramSequence(
            [
                {block: 'forward1'},
                {block: 'startLoop', iterations: 1, label: 'A'},
                {block: 'forward1'},
                {block: 'endLoop', label: 'A'}
            ],
            0,
            0,
            new Map([['A', 1]])
        );

        expect(programSequence.moveToNextStepDisabled(0)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(1)).toBe(true);
        expect(programSequence.moveToNextStepDisabled(2)).toBe(false);
        expect(programSequence.moveToNextStepDisabled(3)).toBe(true);

        expect(programSequence.moveToPreviousStepDisabled(0)).toBe(true);
        expect(programSequence.moveToPreviousStepDisabled(1)).toBe(false);
        expect(programSequence.moveToPreviousStepDisabled(2)).toBe(false);
        expect(programSequence.moveToPreviousStepDisabled(3)).toBe(false);
    });
});

type MoveStepTestCase = {
    program: Program,
    indexFrom: number,
    expectedProgram: Program,
};

test.each(([
    {
        // Empty program
        program: [],
        indexFrom: 0,
        expectedProgram: []
    },
    {
        // Swap a movement block with another one
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        indexFrom: 0,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'forward1' },
            { block: 'forward3' }
        ]
    },
    {
        // Move a block into a loop
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 0,
        expectedProgram: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('A', 1)
            },
            {
                block: 'forward2',
                cache: new ProgramBlockCache('A', 2)
            },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a block out of a loop
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 2,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' },
            { block: 'forward2' }
        ]
    },
    {
        // Move a loop using startLoop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward2' }
        ],
        indexFrom: 0,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('A', 1)
            },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a loop using endLoop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward2' }
        ],
        indexFrom: 2,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('A', 1)
            },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a loop into another loop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' },
            { block: 'startLoop', label: 'B', iterations: 20 },
            { block: 'endLoop', label: 'B' }
        ],
        indexFrom: 0,
        expectedProgram: [
            { block: 'startLoop', label: 'B', iterations: 20 },
            {
                block: 'startLoop',
                label: 'A',
                iterations: 10,
                cache: new ProgramBlockCache('B', 1)
            },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('A', 1)
            },
            {
                block: 'endLoop',
                label: 'A',
                cache: new ProgramBlockCache('B', 3)
            },
            { block: 'endLoop', label: 'B' }
        ]
    },
    {
        // Move a loop out of another loop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'startLoop', label: 'B', iterations: 20 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'B' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 1,
        expectedProgram: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' },
            { block: 'startLoop', label: 'B' , iterations: 20 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('B', 1)
            },
            { block: 'endLoop', label: 'B' }
        ]
    }
]: Array<MoveStepTestCase>))('moveStepNext', (testData: MoveStepTestCase) => {
    expect.assertions(3);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(testData.program, 0, 0, new Map());
    const result = programSequence.moveStepNext(testData.indexFrom);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(0);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

test.each(([
    {
        // Empty program
        program: [],
        indexFrom: 0,
        expectedProgram: []
    },
    {
        // Swap a movement block with another one
        program: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'forward3' }
        ],
        indexFrom: 1,
        expectedProgram: [
            { block: 'forward2' },
            { block: 'forward1' },
            { block: 'forward3' }
        ]
    },
    {
        // Move a block into a loop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'A' },
            { block: 'forward2' }
        ],
        indexFrom: 3,
        expectedProgram: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('A', 1)
            },
            {
                block: 'forward2',
                cache: new ProgramBlockCache('A', 2)
            },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a block out of a loop
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 2,
        expectedProgram: [
            { block: 'forward1' },
            { block: 'forward2' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a loop using startLoop
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 1,
        expectedProgram: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward2',
                cache: new ProgramBlockCache('A', 1)
            },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ]
    },
    {
        // Move a loop using endLoop
        program: [
            { block: 'forward1' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'forward2' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 3,
        expectedProgram: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            {
                block: 'forward2',
                cache: new ProgramBlockCache('A', 1)
            },
            { block: 'endLoop', label: 'A' },
            { block: 'forward1' }
        ]
    },
    {
        // Move a loop into another loop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' },
            { block: 'startLoop', label: 'B', iterations: 20 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'B' }
        ],
        indexFrom: 2,
        expectedProgram: [
            {
                block: 'startLoop',
                label: 'A',
                iterations: 10
            },
            {
                block: 'startLoop',
                label: 'B',
                iterations: 20,
                cache: new ProgramBlockCache('A', 1)
            },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('B', 1)
            },
            {
                block: 'endLoop',
                label: 'B',
                cache: new ProgramBlockCache('A', 3)
            },
            { block: 'endLoop', label: 'A' }
        ]
    },
    {
        // Move a loop out of another loop
        program: [
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'startLoop', label: 'B', iterations: 20 },
            { block: 'forward1' },
            { block: 'endLoop', label: 'B' },
            { block: 'endLoop', label: 'A' }
        ],
        indexFrom: 1,
        expectedProgram: [
            { block: 'startLoop', label: 'B', iterations: 20 },
            {
                block: 'forward1',
                cache: new ProgramBlockCache('B', 1)
            },
            { block: 'endLoop', label: 'B' },
            { block: 'startLoop', label: 'A', iterations: 10 },
            { block: 'endLoop', label: 'A' }
        ]
    }
]: Array<MoveStepTestCase>))('moveStepPrevious', (testData: MoveStepTestCase) => {
    expect.assertions(3);
    const programBefore = testData.program.slice();
    const programSequence = new ProgramSequence(testData.program, 0, 0, new Map());
    const result = programSequence.moveStepPrevious(testData.indexFrom);
    expect(result.getProgram()).toStrictEqual(testData.expectedProgram);
    expect(result.getProgramCounter()).toBe(0);
    expect(programSequence.getProgram()).toStrictEqual(programBefore);
});

test('initiateProgramRun should set iterationsLeft for loops, as well as set programCounter to 0', () => {
    expect.assertions(2);
    const program = [
        {block: 'startLoop', iterations: 3, label: 'A'},
        {block: 'startLoop', iterations: 2, label: 'B'},
        {block: 'endLoop', label: 'B'},
        {block: 'endLoop', label: 'A'}
    ];
    const expectedLoopIterationsLeft = new Map([
        [ 'A', 3 ],
        [ 'B', 2 ]
    ]);
    const programSequence = new ProgramSequence(program, 3, 2, new Map());
    const updatedProgramSequence = programSequence.initiateProgramRun();
    expect(updatedProgramSequence.getLoopIterationsLeft()).toStrictEqual(expectedLoopIterationsLeft);
    expect(updatedProgramSequence.getProgramCounter()).toBe(0);
});
