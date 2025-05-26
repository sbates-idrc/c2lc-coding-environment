// @flow

import React from 'react';
import type { LanguageTag } from './types';
import './LanguageSelector.scss';

type LanguageSelectorProps = {
    value: LanguageTag,
    onChange: (value: LanguageTag) => void
};

const LanguageSelector = React.forwardRef<LanguageSelectorProps, HTMLButtonElement>(
    (props, ref) => {
        const handleClick = () => {
            props.onChange(props.value === 'en' ? 'fr' : 'en');
        };

        const label = props.value === 'en' ? 'Français' : 'English';
        const labelLang = props.value === 'en' ? 'fr' : 'en';

        return (
            <button
                className='LanguageSelector'
                lang={labelLang}
                onClick={handleClick}
                ref={ref}
            >
                {label}
            </button>
        );
    }
);

export default LanguageSelector;
