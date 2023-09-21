// @flow

import React from 'react';
import type { ThemeName } from './types';
import { getWorldCharacter } from './Worlds';
import type { WorldName } from './Worlds';

import { ReactComponent as PaintbrushIcon } from './svg/Paintbrush.svg';

import './Paintbrush.css';

type SceneCharacterProps = {
    world: WorldName,
    theme: ThemeName,
    customBackgroundEditMode: boolean,
    transform: string,
    width: number,
};

export default class SceneCharacter extends React.PureComponent<SceneCharacterProps, {}> {
    render() {
        const characterIcon = this.props.customBackgroundEditMode ?
            PaintbrushIcon
            : getWorldCharacter(this.props.theme, this.props.world);

        return (
            <g
                className='SceneCharacter'
                transform={this.props.transform}>
                {React.createElement(characterIcon,
                    {
                        className: 'SceneCharacter__icon',
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
