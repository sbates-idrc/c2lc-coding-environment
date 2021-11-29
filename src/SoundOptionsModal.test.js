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

function getCancelButton(wrapper) {
    return wrapper.find('.ModalWithFooter__secondaryButton');
}

function getSaveButton(wrapper) {
    return wrapper.find('.ModalWithFooter__primaryButton');
}

describe('When rendering audio toggles', () => {
    test('Three toggle switches should render in following order: "All Sounds", "Musical Sounds" and "Audio Announcements"', () => {
        expect.assertions(7);
        const { wrapper } = createMountSoundOptionsModal();
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
        expect.assertions(7);
        const { wrapper } = createMountSoundOptionsModal({ audioEnabled: false, announcementsEnabled: false, sonificationEnabled: false });
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
        expect.assertions(2);
        const { wrapper, mockOnCancel } = createMountSoundOptionsModal();
        const cancelButton = getCancelButton(wrapper);
        cancelButton.at(0).simulate('click');
        expect(mockOnCancel.mock.calls.length).toBe(1);
        expect(mockOnCancel.mock.calls[0][0]).toBe(undefined);
    });
    test('Pressing save button should update the toggle states', () => {
        expect.assertions(4);
        const { wrapper, mockOnSave } = createMountSoundOptionsModal({ audioEnabled: false, announcementsEnabled: true, sonificationEnabled: false });
        const saveButton = getSaveButton(wrapper);
        saveButton.at(0).simulate('click');
        expect(mockOnSave.mock.calls.length).toBe(1);
        // audioEnabled
        expect(mockOnSave.mock.calls[0][0]).toBe(false);
        // announcementsEnabled
        expect(mockOnSave.mock.calls[0][1]).toBe(true);
        // sonificationEnabled
        expect(mockOnSave.mock.calls[0][2]).toBe(false);
    });
});