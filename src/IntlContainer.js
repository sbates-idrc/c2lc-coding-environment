// @flow
import React from 'react';
import { IntlProvider} from 'react-intl';
import App from './App';
import messages from './messages.json';

type IntlContainerSettings = {
    language: string
};

type IntlContainerState = {
    settings: IntlContainerSettings
};

// TODO: Discuss how best to let App control the language.
export default class IntlContainer extends React.Component<{}, IntlContainerState> {
    constructor(props: any) {
        super(props);

        this.state = {
            settings: {
                language: 'en'
            },
        };
    }

    render() {
        return (
            <IntlProvider
                locale={this.state.settings.language}
                messages={messages[this.state.settings.language]}>
                <App/>
            </IntlProvider>
        );
    }
}