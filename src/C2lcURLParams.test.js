// @flow

import C2lcURLParams from './C2lcURLParams';

test('Given URL query parameters, get param values', () => {
    const urlParams = new C2lcURLParams('?v=0.5&t=dark&p=f1f2f3&c=00b');
    expect(urlParams.getVersion()).toBe('0.5');
    expect(urlParams.getProgram()).toBe('f1f2f3');
    expect(urlParams.getCharacterState()).toBe('00b');
    expect(urlParams.getTheme()).toBe('dark');
});

test('Given URL query parameters with special characters, get decoded param values', () => {
    const urlParams = new C2lcURLParams('?v=%20%21%224&t=dark&p=%28%22&c=%21%20');
    expect(urlParams.getVersion()).toBe(' !"4');
    expect(urlParams.getProgram()).toBe('("');
    expect(urlParams.getCharacterState()).toBe('! ');
    expect(urlParams.getTheme()).toBe('dark');
})
