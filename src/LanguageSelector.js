// @flow

import React from 'react';
import type { LanguageTag } from './types';
import './LanguageSelector.scss';

type LanguageSelectorProps = {
    value: LanguageTag,
    onChange: (value: LanguageTag) => void
};

export default class LanguageSelector extends React.PureComponent<LanguageSelectorProps, {}> {
    handleClick = () => {
        this.props.onChange(this.props.value === 'en' ? 'fr' : 'en');
    };

    render() {
        const label = this.props.value === 'en' ? 'Français' : 'English';
        const labelLang = this.props.value === 'en' ? 'fr' : 'en';

        return (
            <button
                className='LanguageSelector'
                lang={labelLang}
                onClick={this.handleClick}
            >
                {label}
            </button>
        );
    }
};
