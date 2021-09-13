// @flow

import React from 'react';
import { getWorldProperties } from './Worlds';
import type { WorldName } from './types';
import './Character.scss';

type CharacterProps = {
    world: WorldName,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    getThemedCharacter = () => {
        const worldProperties = getWorldProperties(this.props.world);
        return React.createElement(worldProperties.character, {
            className: 'Character__icon',
            x: -this.props.width/2,
            y: -this.props.width/2,
            width: this.props.width,
            height: this.props.width
        });
    }

    render() {
        return (
            <g
                className='Character'
                transform={this.props.transform}>
                {this.getThemedCharacter()}
            </g>
        );
    }
}
