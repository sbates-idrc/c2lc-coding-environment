// @flow

import React from 'react';
import ModalBody from './ModalBody';
import ModalHeader from './ModalHeader';
import ModalWithFooter from './ModalWithFooter';
import ToggleSwitch from './ToggleSwitch';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import { ReactComponent as AudioIcon } from './svg/AudioOn.svg';
import './SoundOptionsModal.scss';

type SoundOptionsModalProps = {
    intl: IntlShape,
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    sonificationEnabled: boolean,
    show: boolean,
    onCancel: () => void,
    onChangeSoundOptions: ( audioEnabled: boolean, announcementsEnabled: boolean, sonificationEnabled: boolean ) => void
};

type SoundOptionsModalStates = {
    audioEnabled: boolean,
    announcementsEnabled: boolean,
    sonificationEnabled: boolean
};

class SoundOptionsModal extends React.Component<SoundOptionsModalProps, SoundOptionsModalStates> {
    constructor (props: SoundOptionsModalProps) {
        super(props);
        this.state = {
            audioEnabled: this.props.audioEnabled,
            announcementsEnabled: this.props.announcementsEnabled,
            sonificationEnabled: this.props.sonificationEnabled
        };
    };

    handleToggleAudioEnabled = () => {
        this.setState({
            audioEnabled: !this.state.audioEnabled
        });
    };

    handleToggleAnnouncementsEnabled = () => {
        this.setState({
            announcementsEnabled: !this.state.announcementsEnabled
        });
    };

    handleToggleSonificationEnabled = () => {
        this.setState({
            sonificationEnabled: !this.state.sonificationEnabled
        });
    };

    handleOnSave = () => {
        this.props.onChangeSoundOptions(this.state.audioEnabled, this.state.announcementsEnabled, this.state.sonificationEnabled );
    }

    handleOnCancel = () => {
        this.setState({
            audioEnabled: this.props.audioEnabled,
            announcementsEnabled: this.props.announcementsEnabled,
            sonificationEnabled: this.props.sonificationEnabled
        });
        this.props.onCancel();
    }

    renderSoundOptions = () => {
        const soundOptions = [];
        const soundOptionsProps = [
            { id:'sound-options-allsounds', label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.allSounds'}), toggleState: this.state.audioEnabled, onChange: this.handleToggleAudioEnabled },
            { id:'sound-options-musicalSounds', label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.musicalSounds' }), toggleState: this.state.sonificationEnabled, onChange: this.handleToggleSonificationEnabled },
            { id:'sound-options-announcements', label: this.props.intl.formatMessage({ id: 'SoundOptionsModal.announcements' }), toggleState: this.state.announcementsEnabled, onChange: this.handleToggleAnnouncementsEnabled }
        ];
        for (let i=0; i< soundOptionsProps.length; i++) {
            const soundOptionProps = soundOptionsProps[i];
            soundOptions.push(
                <div className='SoundOptions__option-container' key={soundOptionProps.id}>
                    <div aria-hidden={true}>
                        {soundOptionProps.label}
                    </div>
                    <div className='SoundOptions__toggle-container'>
                        <div aria-hidden={true}>
                            {this.props.intl.formatMessage({ id: 'SoundOptionsModal.toggleOff' })}
                        </div>
                        <ToggleSwitch
                            className='SoundOptionsToggle'
                            id={soundOptionProps.id}
                            ariaLabel={soundOptionProps.label}
                            value={soundOptionProps.toggleState}
                            contentsTrue={null}
                            contentsFalse={null}
                            onChange={soundOptionProps.onChange}
                        />
                        <div aria-hidden={true}>
                            {this.props.intl.formatMessage({ id: 'SoundOptionsModal.toggleOn' })}
                        </div>
                    </div>
                </div>
            )
        }
        return soundOptions;
    }

    render() {
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'#sound-options-allsounds'}
                focusOnCloseSelector={'.App__header-soundOptions'}
                ariaLabel={this.props.intl.formatMessage({ id: 'SoundOptionsModal.title' })}
                onClose={this.handleOnCancel}
                buttonProperties={
                    [
                        {label: this.props.intl.formatMessage({id: 'SoundOptionsModal.cancelButton'}), onClick: this.handleOnCancel},
                        {id: 'SoundOptionsModal-save', label: this.props.intl.formatMessage({id: 'SoundOptionsModal.saveButton'}), onClick: this.handleOnSave, isPrimary: true}
                    ]
                }>
                <ModalHeader
                    id='SoundOptionsModal'
                    title={this.props.intl.formatMessage({
                        id: 'SoundOptionsModal.title'
                    })}>
                    <AudioIcon aria-hidden='true' />
                </ModalHeader>
                <ModalBody>
                    <div className='SoundOptionsModal__body'>
                        {this.renderSoundOptions()}
                    </div>
                </ModalBody>
            </ModalWithFooter>
        );
    }
}

export default injectIntl(SoundOptionsModal);
