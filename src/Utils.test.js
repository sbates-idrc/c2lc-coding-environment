// @flow

import { extend, moveToNextStepDisabled, moveToPreviousStepDisabled, generateEncodedProgramURL, getThemeFromString, getWorldFromString, focusByQuerySelector, generateLoopLabel, parseLoopLabel } from './Utils.js';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ProgramSequence from './ProgramSequence';
import { mount, configure } from 'enzyme';
import { makeTestDiv } from './TestUtils';

configure({ adapter: new Adapter()});

test('Test URL encoding', () => {
    expect(generateEncodedProgramURL('version=5', 'light', 'default', 'f1=f2=f3', '0ab', 'f1=f2=f3')).toBe('?v=version%3D5&t=light&w=default&p=f1%3Df2%3Df3&c=0ab&d=f1%3Df2%3Df3');
    expect(generateEncodedProgramURL('version?5', 'dark', 'space', 'f1?f2?f3', '0aab0c0', 'f1?f2?f3')).toBe('?v=version%3F5&t=dark&w=space&p=f1%3Ff2%3Ff3&c=0aab0c0&d=f1%3Ff2%3Ff3');
    expect(generateEncodedProgramURL('version 5', 'contrast', 'forest', 'f1 f2 f3', '0a b c', 'f1 f2 f3')).toBe('?v=version%205&t=contrast&w=forest&p=f1%20f2%20f3&c=0a%20b%20c&d=f1%20f2%20f3');
});

test('Test getThemeFromString', () => {
    expect(getThemeFromString('', 'light')).toBe('light');
    expect(getThemeFromString(null, 'light')).toBe('light');
    expect(getThemeFromString('UNKNOWN', 'light')).toBe('light');
    expect(getThemeFromString('light', 'light')).toBe('light');
    expect(getThemeFromString('dark', 'light')).toBe('dark');
    expect(getThemeFromString('contrast', 'light')).toBe('contrast');
    expect(getThemeFromString('gray', 'light')).toBe('gray');
});

test('Test getWorldFromString', () => {
    // World names before 0.9 release
    expect(getWorldFromString('default', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString('forest', 'Sketchpad')).toBe('Jungle');
    expect(getWorldFromString('space', 'Sketchpad')).toBe('Space');

    expect(getWorldFromString('', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString(null, 'Sketchpad')).toBe('Sketchpad');

    expect(getWorldFromString('DeepOcean', 'Sketchpad')).toBe('DeepOcean');
    expect(getWorldFromString('Jungle', 'Sketchpad')).toBe('Jungle');
    expect(getWorldFromString('Sketchpad', 'Sketchpad')).toBe('Sketchpad');
    expect(getWorldFromString('Space', 'Sketchpad')).toBe('Space');
});

test('Test extend', () => {
    expect(extend({})).toEqual({});
    expect(extend({ a: 0 }, {b: 1}, { c: 2})).toEqual({ a: 0, b: 1, c: 2});
    expect(extend({ foo: { bar: { baz: true }}}, { foo: { new: true, bar: { new: true, baz: false}}})).toEqual({ foo: { new: true, bar: { new: true, baz: false}}});
});

test('Test focusByQuerySelector', () => {
    expect.assertions(2);

    // Test fixture with three focusable elements.
    const testFixture = mount(
        <div>
            <a className="first" href="http://create.weavly.org/">First</a>
            <a className="second" href="http://create.weavly.org/">Second</a>
            <a className="third" href="http://create.weavly.org/">Third</a>
        </div>,
        {attachTo: makeTestDiv()}
    );

    const secondElement = testFixture.find(".second");

    // We should be focused on the body by default.
    // $FlowFixMe: Flow is worried that document.activeElement might not exist.
    expect(document.activeElement.localName).toEqual('body');

    focusByQuerySelector(".second");

    // $FlowFixMe: Flow is worried that document.activeElement might not exist.
    expect(secondElement.html()).toEqual(document.activeElement.outerHTML);

    // make sure to detach after attach
    testFixture.detach();
});

test('generateLoopLabel', () => {
    expect(generateLoopLabel(1)).toEqual('A');
    expect(generateLoopLabel(2)).toEqual('B');
    expect(generateLoopLabel(26)).toEqual('Z');
    expect(generateLoopLabel(27)).toEqual('AA');
    expect(generateLoopLabel(28)).toEqual('AB');
    expect(generateLoopLabel(52)).toEqual('AZ');
    expect(generateLoopLabel(53)).toEqual('BA');
});

test('parseLoopLabel', () => {
    expect(parseLoopLabel('A')).toEqual(1);
    expect(parseLoopLabel('B')).toEqual(2);
    expect(parseLoopLabel('Z')).toEqual(26);
    expect(parseLoopLabel('AA')).toEqual(27);
    expect(parseLoopLabel('AB')).toEqual(28);
    expect(parseLoopLabel('AZ')).toEqual(52);
    expect(parseLoopLabel('BA')).toEqual(53);
});

test('moveToNextStepDisabled', () => {
    const programSequence = new ProgramSequence(
        [{block: 'forward1'}, {block: 'startLoop', iterations: 1, label: 'A'}, {block: 'forward1'}, {block: 'endLoop', label: 'A'}],
        0,
        0,
        new Map([['A', 1]])
    );
    expect(moveToNextStepDisabled(programSequence, 0)).toBe(false);
    expect(moveToNextStepDisabled(programSequence, 1)).toBe(true);
    expect(moveToNextStepDisabled(programSequence, 2)).toBe(false);
    expect(moveToNextStepDisabled(programSequence, 3)).toBe(true);
});

test('moveToPreviousStepDisabled', () => {
    const programSequence = new ProgramSequence(
        [{block: 'startLoop', iterations: 1, label: 'A'}, {block: 'forward1'}, {block: 'endLoop', label: 'A'}, {block: 'forward1'}],
        0,
        0,
        new Map([['A', 1]])
    );
    expect(moveToPreviousStepDisabled(programSequence, 0)).toBe(true);
    expect(moveToPreviousStepDisabled(programSequence, 1)).toBe(false);
    expect(moveToPreviousStepDisabled(programSequence, 2)).toBe(true);
    expect(moveToPreviousStepDisabled(programSequence, 3)).toBe(false);
});
