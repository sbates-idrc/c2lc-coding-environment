// @flow
import React from 'react';
import { IntlProvider} from 'react-intl';
import App from './App';
import messages from './messages.json';
import type { AvailableLanguages } from './types';

type IntlContainerState = {
    language: AvailableLanguages
};

// TODO: Discuss how best to let App control the language.
export default class IntlContainer extends React.Component<{}, IntlContainerState> {
    constructor(props: any) {
        super(props);

        this.state = {
            language: 'fr'
        };
    }

    render() {
        return (
            <IntlProvider
                locale={this.state.language}
                defaultLocale='en'
                messages={messages[this.state.language]}>
                <App/>
            </IntlProvider>
        );
    }
}