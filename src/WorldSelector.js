// @flow

import React from 'react';
import classNames from 'classnames';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import { Modal } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ReactComponent as WorldIcon } from './svg/World.svg';
import type { WorldName } from './types';
import type { IntlShape } from 'react-intl';
import './WorldSelector.scss';

type WorldSelectorProps = {
    show: boolean,
    currentWorld: WorldName,
    intl: IntlShape,
    onChange: (world: WorldName) => void,
    onSelect: (world: WorldName) => void
};

type WorldSelectorState = {
    selectedWorld: WorldName
}

class WorldSelector extends React.Component<WorldSelectorProps, WorldSelectorState> {
    availableWorldOptions: Array<WorldName>;
    constructor(props: WorldSelectorProps) {
        super(props);
        this.state = {
            selectedWorld: props.currentWorld
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

    renderWorldOptions = () => {
        const worldOptions = [];
        for (const world of this.availableWorldOptions) {
            const classes = classNames(
                'WorldSelector__option-image',
                this.props.currentWorld === world && 'WorldSelector__option--selected'
            );
            worldOptions.push(
                <div
                    className='WorldSelector__option-container'
                    key={`WorldSelector__option-${world}`}>
                    <div className={classes}>
                    </div>
                    <div className='WorldSelector__option-row'>
                        <input
                            className='WorldSelector__option-radio'
                            type='radio'
                            id={`world-${world}`}
                            name='world-option'
                            value={world}
                            checked={this.props.currentWorld === world ? true : false}
                            onChange={this.handleOnSelect}/>
                        <label htmlFor={`world-${world}`}>
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
            <Modal show={this.props.show}>
                <ModalHeader
                    title={this.props.intl.formatMessage({
                        id: 'WorldSelector.Title'
                    })}>
                    <WorldIcon />
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
