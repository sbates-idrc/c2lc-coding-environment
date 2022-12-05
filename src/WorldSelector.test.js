// @flow

import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import messages from './messages.json';
import WorldSelector from './WorldSelector';

configure({ adapter: new Adapter() });

const defaultWorldSelectorProps = {
    currentWorld: 'Sketchpad',
    theme: 'default',
    show: true
};

function createMountWorldSelector(props) {
    const mockOnSelect = jest.fn();
    const mockOnChange = jest.fn();
    const wrapper = mount(
        React.createElement(
            WorldSelector,
            Object.assign(
                {},
                defaultWorldSelectorProps,
                {
                    onSelect: mockOnSelect,
                    onChange: mockOnChange
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
        mockOnSelect,
        mockOnChange
    };
}

function getWorldSelectorRadioButton(wrapper) {
    return wrapper.find('.WorldSelector__option-radio');
}

function getWorldSelectorThumbnailIcon(wrapper) {
    return wrapper.find('.WorldSelector__option-image');
}

function getCancelButton(wrapper) {
    return wrapper.find('.TextButton--secondaryButton');
}

function getDoneButton(wrapper) {
    return wrapper.find('.TextButton--primaryButton');
}

describe('When rendering selector options', () => {
    test('All worlds should be displayed as options and only one is checked', () => {
        expect.assertions(27);
        const { wrapper } = createMountWorldSelector();
        const selectorOptions = getWorldSelectorRadioButton(wrapper);

        expect(selectorOptions.length).toBe(13);

        expect(selectorOptions.get(0).props.value).toBe('Sketchpad');
        expect(selectorOptions.get(1).props.value).toBe('AmusementPark');
        expect(selectorOptions.get(2).props.value).toBe('AtlanticCanada');
        expect(selectorOptions.get(3).props.value).toBe('Camping');
        expect(selectorOptions.get(4).props.value).toBe('DeepOcean');
        expect(selectorOptions.get(5).props.value).toBe('EuropeTrip');
        expect(selectorOptions.get(6).props.value).toBe('GroceryStore');
        expect(selectorOptions.get(7).props.value).toBe('Haunted');
        expect(selectorOptions.get(8).props.value).toBe('Landmarks');
        expect(selectorOptions.get(9).props.value).toBe('Marble');
        expect(selectorOptions.get(10).props.value).toBe('Savannah');
        expect(selectorOptions.get(11).props.value).toBe('Space');
        expect(selectorOptions.get(12).props.value).toBe('Sports');

        expect(selectorOptions.get(0).props.checked).toBe(true);
        for (let i = 1; i < selectorOptions.length; i++) {
            expect(selectorOptions.get(i).props.checked).toBe(false);
        }
    });
    test('Thumbnail icons get rendered with the selector options', () => {
        const { wrapper } = createMountWorldSelector();

        let selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);
        expect(selectorThumbnails.get(0).props.children.type.render().props.children).toBe('SketchpadThumbnail.svg');
        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('AmusementParkThumbnail.svg');

        // Grayscale theme
        wrapper.setProps({theme: 'gray'});
        selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);
        expect(selectorThumbnails.get(0).props.children.type.render().props.children).toBe('SketchpadThumbnail-gray.svg');
        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('AmusementParkThumbnailGray.svg');

        // High contrast theme
        wrapper.setProps({theme: 'contrast'});
        selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);
        expect(selectorThumbnails.get(0).props.children.type.render().props.children).toBe('SketchpadThumbnail-contrast.svg');
        expect(selectorThumbnails.get(1).props.children.type.render().props.children).toBe('AmusementParkThumbnailContrast.svg');
    });
});

describe('When selecting a world', () => {
    test('should call onSelect prop', () => {
        expect.assertions(4);
        const { wrapper, mockOnSelect } = createMountWorldSelector();
        const selectorOptions = getWorldSelectorRadioButton(wrapper);

        const firstWorldSelector = selectorOptions.at(0);
        const secondWorldSelector = selectorOptions.at(1);

        // First World
        firstWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(1);
        expect(mockOnSelect.mock.calls[0][0]).toBe('Sketchpad');

        // Second World
        secondWorldSelector.simulate('change');
        expect(mockOnSelect.mock.calls.length).toBe(2);
        expect(mockOnSelect.mock.calls[1][0]).toBe('AmusementPark');
    });
});

describe('When the cancel button is clicked', () => {
    test('The world stays the same as when the modal is opened', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountWorldSelector({currentWorld: 'Space'});
        const cancelButton = getCancelButton(wrapper).at(0);
        wrapper.setProps({currentWorld: 'Savannah'});
        cancelButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('Space');
    });
});

describe('When the done button is clicked', () => {
    test('The world changed to the selected world', () => {
        expect.assertions(2);
        const { wrapper, mockOnChange } = createMountWorldSelector({currentWorld: 'Space'});
        const doneButton = getDoneButton(wrapper).at(0);
        wrapper.setProps({currentWorld: 'Savannah'});
        doneButton.simulate('click');
        expect(mockOnChange.mock.calls.length).toBe(1);
        expect(mockOnChange.mock.calls[0][0]).toBe('Savannah');
    })
});

test('When one of the thumbnail images is clicked, onSelect prop gets called', () => {
    expect.assertions(2);
    const { wrapper, mockOnSelect } = createMountWorldSelector();
    const selectorThumbnails = getWorldSelectorThumbnailIcon(wrapper);

    const firstThumbnailImage = selectorThumbnails.at(0);
    const secondThumbnailImage = selectorThumbnails.at(1);

    firstThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[0][0]).toBe('Sketchpad');
    secondThumbnailImage.simulate('click');
    expect(mockOnSelect.mock.calls[1][0]).toBe('AmusementPark');
});
