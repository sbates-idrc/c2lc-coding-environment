// @flow

import React from 'react';
import SceneDimensions from './SceneDimensions';

type SceneColumnLabelsProps = {
    dimensions: SceneDimensions
};

export default class SceneColumnLabels extends React.PureComponent<SceneColumnLabelsProps, {}> {
    render() {
        const columnLabels = [];

        for (let i = 1; i < this.props.dimensions.getWidth() + 1; i++) {
            const label = this.props.dimensions.getColumnLabel(i);
            columnLabels.push(
                <text
                    className='Scene__grid-label'
                    aria-hidden='true'
                    key={`grid-cell-label-${String.fromCharCode(64 + i)}`}
                    textAnchor='middle'
                    // Center the label with cell width of 10
                    x={(i * 10) - 5}
                    y={0.5}>
                    {label == null ? '' : label}
                </text>
            )
        }

        return (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox={`0 -2 ${this.props.dimensions.getWidth() * 10} 3`}
            >
                {columnLabels}
            </svg>
        );
    }
}
