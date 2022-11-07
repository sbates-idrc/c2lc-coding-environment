// @flow

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import './CookieNotification.scss';

type CookieNotificationProps = {
    onDismiss: () => void,
    onLearnMore: () => void
};

class CookieNotification extends React.Component<CookieNotificationProps, {}> {
    render() {
        return (
            <div className='CookieNotification'>
                <div className='CookieNotification__message'>
                    <FormattedMessage id='CookieNotification.message'/>
                </div>
                <div>
                    <button className='CookieNotification__button' onClick={this.props.onDismiss}>
                        <FormattedMessage id='CookieNotification.dismiss'/>
                    </button>
                    <button
                        className='CookieNotification__button CookieNotification__button--margin-left CookieNotification__learnMoreButton'
                        onClick={this.props.onLearnMore}
                    >
                        <FormattedMessage id='CookieNotification.learnMore'/>
                    </button>
                </div>
            </div>
        );
    }
}

export default injectIntl(CookieNotification);
