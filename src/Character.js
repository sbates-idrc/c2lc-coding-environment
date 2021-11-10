// @flow

import React from 'react';
import { getWorldCharacter } from './Worlds';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import classNames from 'classnames';

import './Character.scss';

type CharacterProps = {
    className?: string,
    world: WorldName,
    theme: ThemeName,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    render() {
        const character = getWorldCharacter(this.props.theme, this.props.world);
        const characterClassNames = classNames(
            'Character',
            this.props.className
        );

        return (
            <g
                className={characterClassNames}
                transform={this.props.transform}>
                {React.createElement(character,
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
