// @flow

import * as React from 'react';
import type { LanguageCode } from './types';
import './LanguageSelector.scss';

type LanguageSelectorProps = {
    value: LanguageCode,
    onChange: (value: LanguageCode) => void
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
