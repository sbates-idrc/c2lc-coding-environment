// @flow

import CharacterState from './CharacterState';
import React from 'react';
import type { ThemeName } from './types';
import { getWorldCharacter, getWorldProperties } from './Worlds';
import type { WorldName } from './Worlds';

type SceneCharacterProps = {
    characterState: CharacterState,
    opacity: number,
    theme: ThemeName,
    world: WorldName
};

export default class SceneCharacter extends React.PureComponent<SceneCharacterProps, {}> {
    render() {
        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        let transform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.getDirectionDegrees() - 90} 0 0)`;
        if (getWorldProperties(this.props.world).enableFlipCharacter && this.props.characterState.direction > 3) {
            transform += ` scale(1 -1)`;
        }

        const characterIcon = getWorldCharacter(this.props.theme, this.props.world);

        const width = 0.9;

        return (
            <g
                className='SceneCharacter'
                transform={transform}
                opacity={this.props.opacity}
            >
                {React.createElement(characterIcon,
                    {
                        className: 'SceneCharacter__icon',
                        'aria-hidden': true,
                        x: -width/2,
                        y: -width/2,
                        width: width,
                        height: width
                    }
                )}
            </g>
        );
    }
}
