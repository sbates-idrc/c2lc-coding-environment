// @flow

import { generateEncodedProgramURL, getThemeFromString } from './Utils.js';

test('Test URL encoding', () => {
    // expect(generateEncodedProgramURL('version=5', 'default', 'f1=f2=f3', '0ab', '123')).toBe('?v=version%3D5&t=default&p=f1%3Df2%3Df3&c=0ab&a=123');
    // expect(generateEncodedProgramURL('version?5', 'space', 'f1?f2?f3', '0aab0c0', '123')).toBe('?v=version%3F5&t=space&p=f1%3Ff2%3Ff3&c=0aab0c0&a=123');
    // expect(generateEncodedProgramURL('version 5', 'forest', 'f1 f2 f3', '0a b c', '123')).toBe('?v=version%205&t=forest&p=f1%20f2%20f3&c=0a%20b%20c&a=123');

    expect(generateEncodedProgramURL('version=5', 'default', 'f1=f2=f3', '0ab', '123')).toBe('?v=version%3D5&p=f1%3Df2%3Df3&c=0ab&a=123');
    expect(generateEncodedProgramURL('version?5', 'space', 'f1?f2?f3', '0aab0c0', '123')).toBe('?v=version%3F5&p=f1%3Ff2%3Ff3&c=0aab0c0&a=123');
    expect(generateEncodedProgramURL('version 5', 'forest', 'f1 f2 f3', '0a b c', '123')).toBe('?v=version%205&p=f1%20f2%20f3&c=0a%20b%20c&a=123');
});

test('Test getThemeFromString', () => {
    expect(getThemeFromString('', 'default')).toBe('default');
    expect(getThemeFromString(null, 'default')).toBe('default');
    expect(getThemeFromString('default', 'default')).toBe('default');
    expect(getThemeFromString('space', 'default')).toBe('space');
    expect(getThemeFromString('forest', 'default')).toBe('forest');
})
