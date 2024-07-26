// @flow

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HtmlLangUpdater from './HtmlLangUpdater';
import React from 'react';
import type { LanguageCode } from './types';

configure({ adapter: new Adapter() });

function createComponent(lang: LanguageCode) {
    return mount(
        React.createElement(
            HtmlLangUpdater,
            {
                lang: lang,
            }
        )
    );
}

function getHtmlLang(): ?string {
    const elem = document.documentElement;
    if (elem && elem.tagName === 'HTML') {
        return elem.getAttribute('lang');
    }
    return null;
}

beforeEach(() => {
    ((document.documentElement: any): Element).removeAttribute('lang');
});

test('Create with "en" and change to "fr"', () => {
    expect(getHtmlLang()).toBeNull();
    const wrapper = createComponent('en');
    expect(getHtmlLang()).toBe('en');
    wrapper.setProps({
        lang: 'fr'
    });
    expect(getHtmlLang()).toBe('fr');
});

test('Create with "fr" and change to "en"', () => {
    expect(getHtmlLang()).toBeNull();
    const wrapper = createComponent('fr');
    expect(getHtmlLang()).toBe('fr');
    wrapper.setProps({
        lang: 'en'
    });
    expect(getHtmlLang()).toBe('en');
});
