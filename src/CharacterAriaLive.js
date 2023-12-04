// @flow

import React from 'react';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { RunningState } from './types';
import type { WorldName } from './Worlds';

type CharacterAriaLiveProps = {
    intl: IntlShape,
    ariaLiveRegionId: string,
    ariaHidden: boolean,
    characterState: CharacterState,
    runningState: RunningState,
    world: WorldName,
    customBackground: CustomBackground,
    customBackgroundDesignMode: boolean,
    characterDescriptionBuilder: CharacterDescriptionBuilder,
    message: ?string
};

class CharacterAriaLive extends React.Component<CharacterAriaLiveProps, {}> {
    appendToLog(text: string) {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (ariaLiveRegion) {
            const newDiv = document.createElement("div");
            newDiv.appendChild(document.createTextNode(text));
            ariaLiveRegion.appendChild(newDiv);
        }
    }

    appendCharacterDescription() {
        const description = this.props.characterDescriptionBuilder.buildCharacterDescription(
            this.props.characterState,
            this.props.world,
            this.props.customBackground,
            this.props.customBackgroundDesignMode
        );
        this.appendToLog(description);
    }

    appendCharacterMoving() {
        const characterLabel = this.props.intl.formatMessage({id: `${this.props.world}.character`});
        const description = this.props.intl.formatMessage(
            {id:'CharacterAriaLive.movementAriaLabel'},
            {character: characterLabel}
        );
        this.appendToLog(description);
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

        // Append the message if there is a new one
        if (prevProps.message !== this.props.message && this.props.message != null) {
            this.appendToLog(this.props.message);
        }

        // Append the character description, if appropriate
        if (prevProps.characterState !== this.props.characterState) {
            if (this.props.runningState !== 'running') {
                this.appendCharacterDescription();
            }
        }  else if (prevProps.runningState !== this.props.runningState) {
            if (this.props.runningState === 'stopRequested'
                || this.props.runningState === 'pauseRequested'
                || (prevProps.runningState === 'running' && this.props.runningState === 'stopped')
                || (prevProps.runningState === 'running' && this.props.runningState === 'paused')) {
                this.appendCharacterDescription();
            }
        } else if (prevProps.world !== this.props.world) {
            this.appendCharacterDescription();
        }
    }

}

export default injectIntl(CharacterAriaLive);
