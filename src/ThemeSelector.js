// @flow

import React from 'react';
import ModalWithFooter from './ModalWithFooter';
import ModalHeader from './ModalHeader';
import type { ThemeName } from './types';
import type { IntlShape } from 'react-intl';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as ThemeIcon } from './svg/Theme.svg';
import './ThemeSelector.scss';

type ThemeSelectorProps = {
    intl: IntlShape,
    show: boolean,
    currentTheme: ThemeName,
    onSelect: (value: ThemeName) => void,
    onChange: (value: ThemeName) => void
};

type ThemeSelectorStates = {
    selectedTheme: ThemeName
};

class ThemeSelector extends React.Component<ThemeSelectorProps, ThemeSelectorStates> {
    constructor (props: ThemeSelectorProps) {
        super(props);
        this.state = {
            selectedTheme: props.currentTheme
        };
    };

    handleOnSelect = (e: Event) => {
        // $FlowFixMe: value is missing in EventTarget
        this.props.onSelect(e.target.value);
    };

    handleCancel = () => {
        this.props.onChange(this.state.selectedTheme);
    }

    handleDone = () => {
        this.props.onChange(this.props.currentTheme);
    };

    renderThemeOptions() {
        const themeOptions = ['default', 'light', 'dark', 'grayscale', 'contrast'];
        const themeGroup = [];
        for (const theme of themeOptions) {
            themeGroup.push(
                <div
                    className={`ThemeSelector__option ${theme}`}
                    key={`ThemeSelector__option-${theme}`}>
                    <input className='ThemeSelector__option-radio' type='radio' id={`theme-${theme}`} name='theme-option' value={theme}
                        checked={this.props.currentTheme === theme ? true : false}
                        onChange={this.handleOnSelect}/>
                    <label htmlFor={`theme-${theme}`}>
                        <FormattedMessage id={`ThemeSelector.option.${theme}`} />
                    </label>
                </div>
            );
        }
        return themeGroup;
    }

    componentDidUpdate(prevProps: ThemeSelectorProps) {
        // When the modal first open up, remember the theme at that time
        if (prevProps.show !== this.props.show && this.props.show) {
            this.setState({
                selectedTheme: this.props.currentTheme
            });
        }
    }

    render() {
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={`#theme-${this.props.currentTheme}`}
                focusOnCloseSelector='.IconButton.themeSelector'
                ariaLabelledById='ThemeSelector'
                onClose={this.handleCancel}
                buttonProperties={[
                    {label: this.props.intl.formatMessage({id: 'ThemeSelector.cancelButton'}), onClick: this.handleCancel},
                    {label: this.props.intl.formatMessage({id: 'ThemeSelector.doneButton'}), onClick: this.handleDone, isPrimary: true}
                ]}>
                <ModalHeader
                    id='ThemeSelector'
                    title={this.props.intl.formatMessage({
                        id: 'ThemeSelector.title'
                    })}>
                    <ThemeIcon aria-hidden='true' />
                </ModalHeader>
                <div className='ThemeSelector__body'>
                    {this.renderThemeOptions()}
                </div>
            </ModalWithFooter>
        );
    }
}

export default injectIntl(ThemeSelector);
