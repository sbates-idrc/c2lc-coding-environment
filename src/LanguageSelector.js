// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import './LanguageSelector.scss';

type LanguageSelectorProps = {
    intl: IntlShape,
    value: string,
    onChange: (value: string) => void
};

class LanguageSelector extends React.PureComponent<LanguageSelectorProps, {}> {
    handleChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        this.props.onChange(e.currentTarget.value);
    };

    render() {
        return (
            <select
                className='LanguageSelector'
                value={this.props.value}
                onChange={this.handleChange}
            >
                <option value='en'>EN</option>
                <option value='fr'>FR</option>
            </select>
        );
    }
};

export default injectIntl(LanguageSelector);
