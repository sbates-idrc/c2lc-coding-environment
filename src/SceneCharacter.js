// @flow

import React from 'react';
import { getWorldCharacter } from './Worlds';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import { ReactComponent as BrushIcon } from './svg/Brush.svg';
import { ReactComponent as BrushContrastIcon } from './svg/BrushContrast.svg';

type SceneCharacterProps = {
    world: WorldName,
    theme: ThemeName,
    customBackgroundEditMode: boolean,
    transform: string,
    width: number,
};

export default class SceneCharacter extends React.Component<SceneCharacterProps, {}> {
    render() {
        const characterIcon = this.props.customBackgroundEditMode ?
            (this.props.theme === 'contrast' ? BrushContrastIcon : BrushIcon)
            :
            getWorldCharacter(this.props.theme, this.props.world);
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
