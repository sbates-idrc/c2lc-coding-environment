// @flow

import IconButton from './IconButton';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { ReactComponent as EnterDesignModeIcon } from './svg/EnterDesignMode.svg';
import { ReactComponent as ExitDesignModeIcon } from './svg/ExitDesignMode.svg';
import './CustomBackgroundDesignModeButton.css';

export type CustomBackgroundDesignModeButtonProps = {
    customBackgroundDesignMode: boolean,
    disabled: boolean,
    intl: IntlShape,
    onChange: (value: boolean) => void
};

class CustomBackgroundDesignModeButton extends React.PureComponent<CustomBackgroundDesignModeButtonProps, {}> {
    handleClick = () => {
        this.props.onChange(!(this.props.customBackgroundDesignMode));
    };

    render() {
        return (
            <IconButton
                className='CustomBackgroundDesignModeButton'
                ariaLabel={this.props.intl.formatMessage({id: 'CustomBackgroundDesignModeButton.customBackgroundDesignMode'})}
                ariaPressed={this.props.customBackgroundDesignMode}
                disabled={this.props.disabled}
                onClick={this.handleClick}
            >
                {this.props.customBackgroundDesignMode ?
                    <ExitDesignModeIcon aria-hidden={true} />
                    :
                    <EnterDesignModeIcon aria-hidden={true} />
                }
            </IconButton>
        );
    }
};

export default injectIntl(CustomBackgroundDesignModeButton);
