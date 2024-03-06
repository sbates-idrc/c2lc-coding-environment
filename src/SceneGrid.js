// @flow

import React from 'react';
import SceneDimensions from './SceneDimensions';
import type { WorldName } from './Worlds';

type SceneGridProps = {
    dimensions: SceneDimensions,
    world: WorldName
};

export default class SceneGrid extends React.PureComponent<SceneGridProps, {}> {
    render() {
        const grid = [];

        for (let i = 1; i < this.props.dimensions.getHeight(); i++) {
            grid.push(
                <line
                    className={`Scene__grid-line Scene__grid-line--${this.props.world}`}
                    key={`grid-cell-row-${i}`}
                    x1={this.props.dimensions.getMinX() - 0.5}
                    y1={this.props.dimensions.getMinY() - 0.5 + i}
                    x2={this.props.dimensions.getMaxX() + 0.5}
                    y2={this.props.dimensions.getMinY() - 0.5 + i}
                />
            );
        }

        for (let i = 1; i < this.props.dimensions.getWidth(); i++) {
            grid.push(
                <line
                    className={`Scene__grid-line Scene__grid-line--${this.props.world}`}
                    key={`grid-cell-column-${i}`}
                    x1={this.props.dimensions.getMinX() - 0.5 + i}
                    y1={this.props.dimensions.getMinY() - 0.5}
                    x2={this.props.dimensions.getMinX() - 0.5 + i}
                    y2={this.props.dimensions.getMaxY() + 0.5}
                />
            );
        }

        return (
            <React.Fragment>
                {grid}
            </React.Fragment>
        );
    }
}
