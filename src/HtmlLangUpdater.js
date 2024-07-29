// @flow

import React from 'react';
import type { LanguageTag } from './types';

type HtmlLangUpdaterProps = {
    lang: LanguageTag
};

function setHtmlLang(lang: LanguageTag) {
    const elem = document.documentElement;
    if (elem && elem.tagName === 'HTML') {
        elem.setAttribute('lang', lang);
    }
}

export default class HtmlLangUpdater extends React.PureComponent<HtmlLangUpdaterProps, {}> {
    render() {
        return (
            <React.Fragment />
        );
    }

    componentDidMount() {
        setHtmlLang(this.props.lang);
    }

    componentDidUpdate() {
        setHtmlLang(this.props.lang);
    }
};
