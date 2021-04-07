// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Adapter from 'enzyme-adapter-react-16';
import { IntlProvider } from 'react-intl';
import { configure, shallow } from 'enzyme';
import { createIntl } from 'react-intl';
import messages from './messages.json';

import ShareButton from './ShareButton';

configure({ adapter: new Adapter()});

class FakeClipboard {
    currentClipboardContents: string;

    constructor() {
        this.currentClipboardContents = '';
    }

    readText(): Promise<string> {
        return Promise.resolve(this.currentClipboardContents);
    }

    writeText(data: string): Promise<void> {
        this.currentClipboardContents = data;
        return Promise.resolve();
    }
}

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

function createShareButton(props) {
    const wrapper = shallow(
        React.createElement(
            ShareButton.WrappedComponent,
            Object.assign(
                {},
                {
                    intl: intl
                },
                props
            )
        )
    );

    return wrapper;
}

test('The component should render without errors.', () => {
    const div = document.createElement('div');
    ReactDOM.render(<IntlProvider
        locale={intl.locale}
        messages={intl.messages}
    >
        <ShareButton/>
    </IntlProvider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('The modal should be hidden on startup', () => {
    const wrapper = createShareButton();
    const modal = wrapper.children().at(1);
    expect(modal.props().show).toBe(false);
});

test('When the Share button is clicked, then the modal should be displayed', (done) => {
    expect.assertions(1);

    Object.assign(navigator, {
        // $FlowFixMe: Flow wants us to mock the full clipboard before we do this.
        clipboard: new FakeClipboard()
    });

    const wrapper = createShareButton({
        // Register a callback to verify that the modal has been shown
        onShowModal: () => {
            const modal = wrapper.children().at(1);
            expect(modal.props().show).toBe(true);
            done();
        }
    });

    const button = wrapper.children().at(0);
    button.simulate("click");
});

test('When the Share button is clicked, then the URL should be copied to the clipboard', (done) => {
    expect.assertions(1);

    Object.assign(navigator, {
        // $FlowFixMe: Flow wants us to mock the full clipboard before we do this.
        clipboard: new FakeClipboard()
    });

    const wrapper = createShareButton();
    const button = wrapper.children().at(0);
    button.simulate("click");

    navigator.clipboard.readText().then((clipBoardText) => {
        expect(clipBoardText).toBe(document.location.href);
        done();
    });
});
