// @flow

import React from 'react';
import type { LanguageCode } from './types';

type HtmlLangUpdaterProps = {
    lang: LanguageCode
};

function setHtmlLang(lang: LanguageCode) {
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
