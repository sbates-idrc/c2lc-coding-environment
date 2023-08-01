// @flow

import { CustomBackground } from './CustomBackground';
import React from 'react';
import { getTileClassName, getTileImage, isTransparent } from './TileData';
import './CustomBackgroundSceneLayer.css';

type CustomBackgroundSceneLayerProps = {
    customBackground: CustomBackground
};

export default class CustomBackgroundSceneLayer extends React.Component<CustomBackgroundSceneLayerProps, {}> {
    shouldComponentUpdate(nextProps: CustomBackgroundSceneLayerProps) {
        return (this.props.customBackground !== nextProps.customBackground);
    }

    render() {
        const tiles = [];

        for (let y = this.props.customBackground.sceneDimensions.getMinY(); y < this.props.customBackground.sceneDimensions.getMaxY() + 1; y++) {
            for (let x = this.props.customBackground.sceneDimensions.getMinX(); x < this.props.customBackground.sceneDimensions.getMaxX() + 1; x++) {
                const tileName = this.props.customBackground.getTile(x, y);
                if (!isTransparent(tileName)) {
                    const tileImage = getTileImage(tileName);
                    if (tileImage == null) {
                        tiles.push(
                            <rect
                                className={getTileClassName(tileName)}
                                key={`custom-background-tile-${x}-${y}`}
                                x={x - 0.5}
                                y={y - 0.5}
                                width={1}
                                height={1}
                            />
                        );
                    } else {
                        tiles.push(React.createElement(tileImage,
                            {
                                key: `custom-background-tile-${x}-${y}`,
                                x: x - 0.5,
                                y: y - 0.5,
                                width: 1,
                                height: 1
                            }
                        ));
                    }
                }
            }
        }

        return (
            <React.Fragment>
                {tiles}
            </React.Fragment>
        );
    }
}
