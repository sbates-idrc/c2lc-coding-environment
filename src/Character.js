// @flow

import React from 'react';
import { getWorldCharacter } from './Worlds';
import type { ThemeName, WorldName } from './types';
import './Character.scss';

type CharacterProps = {
    world: WorldName,
    theme: ThemeName,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    render() {
        return (
            <g
                className='Character'
                transform={this.props.transform}>
                {getWorldCharacter(
                    this.props.theme,
                    this.props.world,
                    {
                        className: 'Character__icon',
                        x: -this.props.width/2,
                        y: -this.props.width/2,
                        width: this.props.width,
                        height: this.props.width
                    }
                )}
            </g>
        );
    }
}
