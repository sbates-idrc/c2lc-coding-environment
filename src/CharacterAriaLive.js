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
    characterDescriptionBuilder: CharacterDescriptionBuilder
};

class CharacterAriaLive extends React.Component<CharacterAriaLiveProps, {}> {
    setCharacterMovingAriaLive() {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (ariaLiveRegion) {
            const characterLabel = this.props.intl.formatMessage({id: `${this.props.world}.character`});
            ariaLiveRegion.innerText = this.props.intl.formatMessage(
                {id:'CharacterAriaLive.movementAriaLabel'},
                {character: characterLabel}
            );
        }
    }

    updateCharacterPositionAriaLive() {
        const ariaLiveRegion = document.getElementById(this.props.ariaLiveRegionId);
        if (ariaLiveRegion) {
            ariaLiveRegion.innerText = this.props.characterDescriptionBuilder.buildCharacterDescription(
                this.props.characterState,
                this.props.world,
                this.props.customBackground
            );
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
        // Ensure updateCharacterPositionAriaLive gets called only once
        if (prevProps.characterState !== this.props.characterState) {
            if (this.props.runningState !== 'running') {
                this.updateCharacterPositionAriaLive();
            }
        }  else if (prevProps.runningState !== this.props.runningState) {
            if (this.props.runningState === 'pauseRequested' ||
                this.props.runningState === 'stopRequested' ||
                (prevProps.runningState === 'running' && this.props.runningState === 'stopped')) {
                this.updateCharacterPositionAriaLive();
            }
            else if (this.props.runningState === "running") {
                this.setCharacterMovingAriaLive();
            }
        } else if (prevProps.world !== this.props.world) {
            this.updateCharacterPositionAriaLive();
        }
    }

}

export default injectIntl(CharacterAriaLive);
