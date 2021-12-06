// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import SoundOptionsModal from './SoundOptionsModal';
import ToggleSwitch from './ToggleSwitch';

configure({ adapter: new Adapter() });

const defaultSoundOptionsModalProps = {
    audioEnabled: true,
    announcementsEnabled: true,
    sonificationEnabled: true,
    show: true
};

function createMountSoundOptionsModal(props) {
    const mockOnCancel = jest.fn();
    const mockOnSave = jest.fn();
    const wrapper = mount(
        React.createElement(
            SoundOptionsModal,
            Object.assign(
                {},
                defaultSoundOptionsModalProps,
                {
                    onCancel: mockOnCancel,
                    onChangeSoundOptions: mockOnSave
                },
                props
            )
        ),
        {
            wrappingComponent: IntlProvider,
            wrappingComponentProps: {
                locale: 'en',
                defaultLocale: 'en',
                messages: messages.en
            }
        }
    );

    return {
        wrapper,
        mockOnCancel,
        mockOnSave
    };
}

function getAudioToggleSwitches(wrapper) {
    return wrapper.find(ToggleSwitch);
}

// TODO: Update getCancelButton once C2LC-520 gets merged
function getCancelButton(wrapper) {
    return wrapper.find('.ModalWithFooter__secondaryButton');
}

// TODO: Update getSaveButton once C2LC-520 gets merged
function getSaveButton(wrapper) {
    return wrapper.find('.ModalWithFooter__primaryButton');
}

function getWrapperState(wrapper) {
    return wrapper.children().at(0).instance().state;
}

describe('When rendering audio toggles', () => {
    test('Three toggle switches should render in following order: "All Sounds", "Musical Sounds" and "Audio Announcements"', () => {
        expect.assertions(8);
        const { wrapper } = createMountSoundOptionsModal();
        // No options should have disabled class when allSound toggle is on
        expect(wrapper.find('.SoundOptions__option--disabled').length).toBe(0);
        const audioToggleSwitches = getAudioToggleSwitches(wrapper);
        expect(audioToggleSwitches.length).toBe(3);
        expect(audioToggleSwitches.get(0).props.id).toBe('sound-options-allsounds');
        expect(audioToggleSwitches.get(0).props.value).toBe(true);
        expect(audioToggleSwitches.get(1).props.id).toBe('sound-options-musicalSounds');
        expect(audioToggleSwitches.get(1).props.value).toBe(true);
        expect(audioToggleSwitches.get(2).props.id).toBe('sound-options-announcements');
        expect(audioToggleSwitches.get(2).props.value).toBe(true);
    });
    test('Changing audioEnabled, announcementsEnabled and sonificationEnabled properties to false should turn off corresponding toggle siwtches', () => {
        expect.assertions(8);
        const { wrapper } = createMountSoundOptionsModal({ audioEnabled: false, announcementsEnabled: false, sonificationEnabled: false });
        // Other options than allSounds should have disabled class when audioEnabled is false
        expect(wrapper.find('.SoundOptions__option--disabled').length).toBe(2);
        const audioToggleSwitches = getAudioToggleSwitches(wrapper);
        expect(audioToggleSwitches.length).toBe(3);
        expect(audioToggleSwitches.get(0).props.id).toBe('sound-options-allsounds');
        expect(audioToggleSwitches.get(0).props.value).toBe(false);
        expect(audioToggleSwitches.get(1).props.id).toBe('sound-options-musicalSounds');
        expect(audioToggleSwitches.get(1).props.value).toBe(false);
        expect(audioToggleSwitches.get(2).props.id).toBe('sound-options-announcements');
        expect(audioToggleSwitches.get(2).props.value).toBe(false);
    })
});

describe('When interacting with footer buttons', () => {
    test('Pressing cancel button should close the modal without changing toggle states', () => {
        expect.assertions(10);
        const { wrapper, mockOnCancel } = createMountSoundOptionsModal();
        expect(getWrapperState(wrapper).audioEnabled).toBe(true);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(true);

        const announcementsToggle = getAudioToggleSwitches(wrapper).at(1);
        const sonificationToggle = getAudioToggleSwitches(wrapper).at(2);
        announcementsToggle.simulate('click');
        sonificationToggle.simulate('click');
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(false);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(false);

        const allSoundsToggle = getAudioToggleSwitches(wrapper).at(0);
        allSoundsToggle.simulate('click');
        expect(getWrapperState(wrapper).audioEnabled).toBe(false);
        
        const cancelButton = getCancelButton(wrapper);
        cancelButton.at(0).simulate('click');
        expect(mockOnCancel.mock.calls.length).toBe(1);
        // Reset all toggle state to the initial state from props
        expect(getWrapperState(wrapper).audioEnabled).toBe(true);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(true);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(true);
    });
    test('Pressing save button should update the toggle states', () => {
        expect.assertions(7);
        const { wrapper, mockOnSave } = createMountSoundOptionsModal({ audioEnabled: true, announcementsEnabled: true, sonificationEnabled: false });
        
        const announcementsToggle = getAudioToggleSwitches(wrapper).at(1);
        const sonificationToggle = getAudioToggleSwitches(wrapper).at(2);
        announcementsToggle.simulate('click');
        sonificationToggle.simulate('click');

        const expectedAudioEnabled = true;
        const expectedAnnouncementsEnabled = false;
        const expectedSonificationEnabled = true;
        
        const saveButton = getSaveButton(wrapper);
        saveButton.at(0).simulate('click');
        expect(mockOnSave.mock.calls.length).toBe(1);
        // audioEnabled
        expect(mockOnSave.mock.calls[0][0]).toBe(expectedAudioEnabled);
        // announcementsEnabled
        expect(mockOnSave.mock.calls[0][1]).toBe(expectedAnnouncementsEnabled);
        // sonificationEnabled
        expect(mockOnSave.mock.calls[0][2]).toBe(expectedSonificationEnabled);

        expect(getWrapperState(wrapper).audioEnabled).toBe(expectedAudioEnabled);
        expect(getWrapperState(wrapper).announcementsEnabled).toBe(expectedAnnouncementsEnabled);
        expect(getWrapperState(wrapper).sonificationEnabled).toBe(expectedSonificationEnabled);
    });
});