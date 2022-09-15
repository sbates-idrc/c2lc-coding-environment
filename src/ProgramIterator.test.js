// @flow

import ProgramIterator from './ProgramIterator';

test('Empty Program', () => {
    const iterator = new ProgramIterator([]);
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toBeUndefined();
    iterator.next();
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toBeUndefined();
});

test('Program with a single block', () => {
    const iterator = new ProgramIterator([{block: 'forward1'}]);
    expect(iterator.done).toBe(false);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toStrictEqual({block: 'forward1'});
    iterator.next();
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toBeUndefined();
    iterator.next();
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toBeUndefined();
});

test('Program with two blocks', () => {
    const iterator = new ProgramIterator([{block: 'forward1'}, {block: 'left45'}]);
    expect(iterator.done).toBe(false);
    expect(iterator.stepNumber).toBe(0);
    expect(iterator.programBlock).toStrictEqual({block: 'forward1'});
    iterator.next();
    expect(iterator.done).toBe(false);
    expect(iterator.stepNumber).toBe(1);
    expect(iterator.programBlock).toStrictEqual({block: 'left45'});
    iterator.next();
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(1);
    expect(iterator.programBlock).toBeUndefined();
    iterator.next();
    expect(iterator.done).toBe(true);
    expect(iterator.stepNumber).toBe(1);
    expect(iterator.programBlock).toBeUndefined();
});
