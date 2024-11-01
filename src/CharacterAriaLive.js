// @flow

import React from 'react';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import DesignModeCursorDescriptionBuilder from './DesignModeCursorDescriptionBuilder';
import DesignModeCursorState from './DesignModeCursorState';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { RunningState, UserMessage } from './types';
import type { WorldName } from './Worlds';

type CharacterAriaLiveProps = {
    intl: IntlShape,
    ariaLiveRegionId: string,
    ariaHidden: boolean,
    characterState: CharacterState,
    designModeCursorState: DesignModeCursorState,
    runningState: RunningState,
    world: WorldName,
    customBackground: CustomBackground,
    customBackgroundDesignMode: boolean,
    characterDescriptionBuilder: CharacterDescriptionBuilder,
    designModeCursorDescriptionBuilder: DesignModeCursorDescriptionBuilder,
    message: ?UserMessage
};

class CharacterAriaLive extends React.Component<CharacterAriaLiveProps, {}> {
    lastMessage: ?UserMessage;

    constructor(props: any) {
        super(props);
        this.lastMessage = null;
    }

    setCharacterMoving() {
        const characterLabel = this.props.intl.formatMessage({
            id: `${this.props.world}.character`
        });
        const text = this.props.intl.formatMessage(
            { id:'CharacterAriaLive.movementAriaLabel' },
            { character: characterLabel }
        );
        this.setLiveRegion(text);
    }

    // Combine the most recent message (if there is one) with the character
    // description in a single update. With 2 separate updates, it was not
    // possible to have both updates be spoken by VoiceOver on macOS. When
    // the character description update was made while the message was still
    // being spoken, either the character description would interrupt the
    // message, or the character description would be ignored. A number of
    // different node structures and live region attributes were tried but
    // none were successful. With this approach, the message and character
    // description texts are combined into a single live region update.
    setMessageAndCharacterDescription() {
        let text = '';

        if (this.props.message != null
                && this.props.message !== this.lastMessage) {
            text = this.props.message.getMessage(this.props.intl);
            if (text.endsWith('.')) {
                text += ' ';
            } else {
                text += '. ';
            }
            this.lastMessage = this.props.message;
        }

        text += this.props.characterDescriptionBuilder.buildDescription(
            this.props.characterState,
            this.props.world,
            this.props.customBackground,
            this.props.intl
        );

        this.setLiveRegion(text);
    }

    setDesignModeCursorDescription() {
        this.setLiveRegion(
            this.props.designModeCursorDescriptionBuilder.buildDescription(
                this.props.designModeCursorState,
                this.props.world,
                this.props.customBackground,
                this.props.intl
            )
        );
    }

    setLiveRegion(text: string) {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (ariaLiveRegion) {
            ariaLiveRegion.textContent = text;
        }
    }

    render() {
        return (
            <React.Fragment />
        );
    }

    componentDidMount() {
        // Set aria-hidden
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (ariaLiveRegion) {
            ariaLiveRegion.setAttribute('aria-hidden', this.props.ariaHidden.toString());
        }
    }

    componentDidUpdate(prevProps: CharacterAriaLiveProps) {
        // Set aria-hidden
        if (prevProps.ariaHidden !== this.props.ariaHidden) {
            const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
            if (ariaLiveRegion) {
                ariaLiveRegion.setAttribute('aria-hidden', this.props.ariaHidden.toString());
            }
        }

        if (this.props.message == null) {
            this.lastMessage = null;
        }

        // Update the live region
        if (prevProps.characterState !== this.props.characterState) {
            if (this.props.runningState !== 'running') {
                this.setMessageAndCharacterDescription();
            }
        } else if (prevProps.designModeCursorState !== this.props.designModeCursorState) {
            this.setDesignModeCursorDescription();
        } else if (prevProps.runningState !== this.props.runningState) {
            if (this.props.runningState === 'stopRequested'
                || this.props.runningState === 'pauseRequested'
                || (prevProps.runningState === 'running' && this.props.runningState === 'stopped')
                || (prevProps.runningState === 'running' && this.props.runningState === 'paused')) {
                this.setMessageAndCharacterDescription();
            } else if (this.props.runningState === "running") {
                this.setCharacterMoving();
            }
        } else if (prevProps.customBackgroundDesignMode && !(this.props.customBackgroundDesignMode)) {
            this.setMessageAndCharacterDescription();
        } else if (prevProps.world !== this.props.world) {
            if (this.props.customBackgroundDesignMode) {
                this.setDesignModeCursorDescription();
            } else {
                this.setMessageAndCharacterDescription();
            }
        }
    }
}

export default injectIntl(CharacterAriaLive);
