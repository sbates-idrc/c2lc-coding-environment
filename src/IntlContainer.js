// @flow
import React from 'react';
import { IntlProvider} from 'react-intl';
import App from './App';
import messages from './messages.json';

type IntlContainerState = {
    language: string
};

export default class IntlContainer extends React.Component<{}, IntlContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            language: 'en'
        };
    }

    handleChangeLanguage = (language: string) => {
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
            </IntlProvider>
        );
    }
}
