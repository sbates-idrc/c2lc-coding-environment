// @flow

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import ToggleSwitch from './ToggleSwitch';
import { ReactComponent as CustomBackgroundEditModeIcon } from './svg/CustomBackgroundEditMode.svg';
import './CustomBackgroundEditModeToggleSwitch.scss';

type CustomBackgroundEditModeToggleSwitchProps = {
    intl: IntlShape,
    value: boolean,
    onChange: (value: boolean) => void
};

class CustomBackgroundEditModeToggleSwitch extends React.Component<CustomBackgroundEditModeToggleSwitchProps, {}> {
    render() {
        return (
            <ToggleSwitch
                className='CustomBackgroundEditModeToggleSwitch'
                ariaLabel={this.props.intl.formatMessage({id: 'CustomBackgroundEditModeToggleSwitch.customBackgroundEditMode'})}
                value={this.props.value}
                contentsTrue={<CustomBackgroundEditModeIcon />}
                contentsFalse={<CustomBackgroundEditModeIcon />}
                onChange={this.props.onChange}
            />
        );
    }
};

export default injectIntl(CustomBackgroundEditModeToggleSwitch);
