// @flow

import React from 'react';
import classNames from 'classnames';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import { Modal } from 'react-bootstrap';
import { getWorldThumbnail } from './Worlds';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as WorldIcon } from './svg/World.svg';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import type { IntlShape } from 'react-intl';
import './WorldSelector.scss';

type WorldSelectorProps = {
    show: boolean,
    currentWorld: WorldName,
    theme: ThemeName,
    intl: IntlShape,
    onChange: (world: WorldName) => void,
    onSelect: (world: WorldName) => void
};

type WorldSelectorState = {
    selectedWorld: WorldName,
    focusedWorld: ?WorldName
}

class WorldSelector extends React.Component<WorldSelectorProps, WorldSelectorState> {
    availableWorldOptions: Array<WorldName>;
    constructor(props: WorldSelectorProps) {
        super(props);
        this.state = {
            selectedWorld: props.currentWorld,
            focusedWorld: null
        }
        this.availableWorldOptions = ['Sketchpad', 'Space', 'Jungle', 'DeepOcean'];
    }

    handleOnSelect = (e: Event) => {
        // $FlowFixMe: value is missing in EventTarget
        this.props.onSelect(e.target.value);
    };

    handleCancel = () => {
        this.props.onChange(this.state.selectedWorld);
    }

    handleDone = () => {
        this.props.onChange(this.props.currentWorld);
    };

    onFocusWorld = (e: Event) => {
        // $FlowFixMe event target doesn't know value
        const focusedWorld = e.target.value;
        if (focusedWorld) {
            this.setState({ focusedWorld });
        }
    }

    onBlurWorld = () => {
        this.setState({
            focusedWorld: null
        });
    }

    renderWorldThumbnail = (world: WorldName) => {
        const worldThumbnail = getWorldThumbnail(this.props.theme, world);
        return React.createElement(worldThumbnail, { 'aria-hidden': 'true' });
    }

    renderWorldOptions = () => {
        const worldOptions = [];
        for (const world of this.availableWorldOptions) {
            const classes = classNames(
                'WorldSelector__option-image',
                this.state.focusedWorld === world && 'WorldSelector__option--selected'
            );
            worldOptions.push(
                <div
                    className='WorldSelector__option-container'
                    key={`WorldSelector__option-${world}`}>
                    <div className={classes}>
                        {this.renderWorldThumbnail(world)}
                    </div>
                    <div className='WorldSelector__option-row'>
                        <input
                            className='WorldSelector__option-radio'
                            type='radio'
                            id={`WorldSelector__input-world-${world}`}
                            name='world-option'
                            value={world}
                            checked={this.props.currentWorld === world ? true : false}
                            onChange={this.handleOnSelect}
                            onFocus={this.onFocusWorld}
                            onBlur={this.onBlurWorld}/>
                        <label htmlFor={`WorldSelector__input-world-${world}`}>
                            <FormattedMessage id={`WorldSelector.option.${world}`} />
                        </label>
                    </div>
                </div>
            );
        }
        return worldOptions;
    }

    componentDidUpdate(prevProps: WorldSelectorProps) {
        // When the modal first open up, remember the world at that time
        if (prevProps.show !== this.props.show && this.props.show) {
            this.setState({
                selectedWorld: this.props.currentWorld
            });
        }
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.handleCancel}>
                <ModalHeader
                    title={this.props.intl.formatMessage({
                        id: 'WorldSelector.Title'
                    })}>
                    <WorldIcon aria-hidden='true' />
                </ModalHeader>
                <Modal.Body>
                    <div className='WorldSelector__prompt'>
                        <FormattedMessage id={'WorldSelector.Prompt'} />
                    </div>
                    <div className='WorldSelector__options'>
                        {this.renderWorldOptions()}
                    </div>
                </Modal.Body>
                <ModalFooter
                    hasCancel={true}
                    onClickCancel={this.handleCancel}
                    onClickDone={this.handleDone}
                />
            </Modal>
        );
    }
}

export default injectIntl(WorldSelector);
