// @flow
import React from 'react';
import { IntlProvider} from 'react-intl';
import App from './App';
import HtmlLangUpdater from './HtmlLangUpdater';
import type { LanguageTag } from './types';
import messages from './messages.json';

function getLangFromLocalStorage(): LanguageTag {
    if (window.localStorage) {
        switch (window.localStorage.getItem('c2lc-lang')) {
            case('en'):
                return 'en';
            case('fr'):
                return 'fr';
            default:
                // Fall through
        }
    }
    return 'en';
}

type IntlContainerState = {
    language: LanguageTag
};

export default class IntlContainer extends React.Component<{}, IntlContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            language: getLangFromLocalStorage()
        };
    }

    handleChangeLanguage = (language: LanguageTag) => {
        // Remember the language selection in local storage
        if (window.localStorage) {
            window.localStorage.setItem('c2lc-lang', language);
        }

        this.setState({
            language: language
        });
    };

    render() {
        return (
            <IntlProvider
                locale={this.state.language}
                messages={messages[this.state.language]}>
                <App
                    language={this.state.language}
                    onChangeLanguage={this.handleChangeLanguage}
                />
                <HtmlLangUpdater lang={this.state.language}/>
            </IntlProvider>
        );
    }
}
