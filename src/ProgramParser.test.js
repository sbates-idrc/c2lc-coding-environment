//@flow

import ProgramParser from './ProgramParser';

test('Parse empty string', () => {
    expect((new ProgramParser()).parse('')).toStrictEqual([]);
});

test('Parse unsupported character', () => {
    expect(() => {
        (new ProgramParser()).parse('f');
    }).toThrowError(/^Unexpected character: f$/);
});

test('Parse 1', () => {
    expect((new ProgramParser()).parse('1')).toStrictEqual([{block: 'forward1'}]);
});

test('Parse 2', () => {
    expect((new ProgramParser()).parse('2')).toStrictEqual([{block: 'forward2'}]);
});

test('Parse 3', () => {
    expect((new ProgramParser()).parse('3')).toStrictEqual([{block: 'forward3'}]);
});

test('Parse 4', () => {
    expect((new ProgramParser()).parse('4')).toStrictEqual([{block: 'backward1'}]);
});

test('Parse 5', () => {
    expect((new ProgramParser()).parse('5')).toStrictEqual([{block: 'backward2'}]);
});

test('Parse 6', () => {
    expect((new ProgramParser()).parse('6')).toStrictEqual([{block: 'backward3'}]);
});

test('Parse A', () => {
    expect((new ProgramParser()).parse('A')).toStrictEqual([{block: 'left45'}]);
});

test('Parse B', () => {
    expect((new ProgramParser()).parse('B')).toStrictEqual([{block: 'left90'}]);
});

test('Parse D', () => {
    expect((new ProgramParser()).parse('D')).toStrictEqual([{block: 'left180'}]);
});

test('Parse a', () => {
    expect((new ProgramParser()).parse('a')).toStrictEqual([{block: 'right45'}]);
});

test('Parse b', () => {
    expect((new ProgramParser()).parse('b')).toStrictEqual([{block: 'right90'}]);
});

test('Parse d', () => {
    expect((new ProgramParser()).parse('d')).toStrictEqual([{block: 'right180'}]);
});

test('Parse program with multiple commands', () => {
    expect((new ProgramParser()).parse('123456ABDabd')).toStrictEqual([
        {block: 'forward1'},
        {block: 'forward2'},
        {block: 'forward3'},
        {block: 'backward1'},
        {block: 'backward2'},
        {block: 'backward3'},
        {block: 'left45'},
        {block: 'left90'},
        {block: 'left180'},
        {block: 'right45'},
        {block: 'right90'},
        {block: 'right180'}
    ]);
});
