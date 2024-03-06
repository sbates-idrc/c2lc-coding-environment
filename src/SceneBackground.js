import React from 'react';
import SceneDimensions from './SceneDimensions';
import type { ThemeName } from './types';
import { getWorldProperties } from './Worlds';
import type { WorldName } from './Worlds';

type SceneBackgroundProps = {
    dimensions: SceneDimensions,
    theme: ThemeName,
    world: WorldName
};

export default class SceneBackground extends React.PureComponent<SceneBackgroundProps, {}> {
    render() {
        const x = this.props.dimensions.getMinX() - 0.5;
        const y = this.props.dimensions.getMinY() - 0.5;
        const width = this.props.dimensions.getWidth();
        const height = this.props.dimensions.getHeight();

        const worldProperties = getWorldProperties(this.props.world);

        if (this.props.theme === 'gray') {
            if (worldProperties.backgroundGray) {
                return React.createElement(worldProperties.backgroundGray, {
                    className: 'Scene__background',
                    'aria-hidden': true,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        } else if (this.props.theme === 'contrast') {
            if (worldProperties.backgroundContrast) {
                return React.createElement(worldProperties.backgroundContrast, {
                    className: 'Scene__background',
                    'aria-hidden': true,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        } else {
            if (worldProperties.background) {
                return React.createElement(worldProperties.background, {
                    className: 'Scene__background',
                    'aria-hidden': true,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    preserveAspectRatio: 'none'
                });
            } else {
                return <></>;
            }
        }
    }
}
