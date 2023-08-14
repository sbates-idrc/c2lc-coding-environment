// @flow

import React from 'react';
import SceneDimensions from './SceneDimensions';

type SceneRowLabelsProps = {
    dimensions: SceneDimensions
};

export default class SceneRowLabels extends React.PureComponent<SceneRowLabelsProps, {}> {
    render() {
        const rowLabels = [];

        for (let i = 1; i < this.props.dimensions.getHeight() + 1; i++) {
            rowLabels.push(
                <text
                    className='Scene__grid-label'
                    aria-hidden='true'
                    textAnchor='middle'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={-0.5}
                    // Center the label with cell height of 10
                    y={(i * 10) - 5}>
                    {i}
                </text>
            )
        }

        return (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox={`-2 0 3 ${this.props.dimensions.getHeight() * 10}`}
            >
                {rowLabels}
            </svg>
        );
    }
}
