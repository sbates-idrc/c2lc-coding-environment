// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import './Scene.scss';

type SceneProps = {
    intl: any,
    numRows: number,
    numColumns: number,
    gridCellWidth: number,
    characterState: CharacterState
};

class Scene extends React.Component<SceneProps, {}> {

    drawGrid(minX: number, minY: number, sceneWidth: number, sceneHeight: number) {
        const grid = [];
        if (this.props.numRows === 0 || this.props.numColumns === 0) {
            return grid;
        }
        const rowLabelOffset = sceneWidth * 0.025;
        const columnLabelOffset = sceneHeight * 0.025;
        let yOffset = minY;
        for (let i=1;i < this.props.numRows + 1;i++) {
            yOffset = yOffset + this.props.gridCellWidth;
            if (i < this.props.numRows) {
                grid.push(<line
                    className='Scene__grid-line'
                    key={`grid-cell-row-${i}`}
                    x1={minX}
                    y1={yOffset}
                    x2={minX + sceneWidth}
                    y2={yOffset} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    textAnchor='end'
                    key={`grid-cell-label-${i}`}
                    dominantBaseline='middle'
                    x={minX - rowLabelOffset}
                    y={yOffset - this.props.gridCellWidth / 2}>
                    {i}
                </text>
            )
        }
        let xOffset = minX;
        for (let i=1;i < this.props.numColumns + 1;i++) {
            xOffset = xOffset + this.props.gridCellWidth;
            if (i < this.props.numColumns) {
                grid.push(<line
                    className='Scene__grid-line'
                    key={`grid-cell-column-${i}`}
                    x1={xOffset}
                    y1={minY}
                    x2={xOffset}
                    y2={minY + sceneHeight} />);
            }
            grid.push(
                <text
                    className='Scene__grid-label'
                    key={`grid-cell-label-${String.fromCharCode(64+i)}`}
                    textAnchor='middle'
                    x={xOffset - this.props.gridCellWidth / 2}
                    y={minY - columnLabelOffset}>
                    {String.fromCharCode(64+i)}
                </text>
            )
        }
        return grid;
    }

    render() {
        const width = this.props.numColumns * this.props.gridCellWidth;
        const height = this.props.numRows * this.props.gridCellWidth;
        const minX = -width / 2;
        const minY = -height / 2;

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        const robotCharacterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos}) rotate(${this.props.characterState.directionDegrees - 90} 0 0)`;

        return (
            <div>
                <span
                    className='Scene'
                    role='img'
                    aria-label={this.props.intl.formatMessage({id: 'Scene'})}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${minX} ${minY} ${width} ${height}`}>
                        <defs>
                            <clipPath id='Scene-clippath'>
                                <rect x={minX} y={minY} width={width} height={height} />
                            </clipPath>
                        </defs>
                        {this.drawGrid(minX, minY, width, height)}
                        <g clipPath='url(#Scene-clippath)'>
                            <RobotCharacter
                                transform={robotCharacterTransform}
                                width={this.props.gridCellWidth * 0.8}
                            />
                        </g>
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
