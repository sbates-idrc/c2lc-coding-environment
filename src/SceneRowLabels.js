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
            const label = this.props.dimensions.getRowLabel(i);
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
                    {label == null ? '' : label}
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
