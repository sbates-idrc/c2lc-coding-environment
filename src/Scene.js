// @flow

import React from 'react';
import CharacterState from './CharacterState';
import RobotCharacter from './RobotCharacter';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';

import './Scene.scss';

export type SceneProps = {
    numRows: number,
    numColumns: number,
    gridCellWidth: number,
    intl: IntlShape,
    characterState: CharacterState
};

class Scene extends React.Component<SceneProps, {}> {
    generateColumnHeaders(cellXCoords, minY, sceneHeight) {
        const columnLabelOffset = sceneHeight * 0.025;
        const columnHeaders = [];
        columnHeaders.push(<text role='columnheader' key='grid-corner'/>)
        for (let i=0;i < cellXCoords.length; i++) {
            const xOffset = cellXCoords[i].x2;
            columnHeaders.push(
                <text
                    role='columnheader'
                    className='Scene__grid-label'
                    id={`column-${String.fromCharCode(65+i)}`}
                    key={`grid-cell-label-${String.fromCharCode(65+i)}`}
                    textAnchor='middle'
                    x={xOffset - this.props.gridCellWidth / 2}
                    y={minY - columnLabelOffset}>
                    {String.fromCharCode(65+i)}
                </text>
            )
        }
        return (
            <g role='rowgroup' key={`columnHeaderRow`}>
                <g role='row'>
                    {columnHeaders}
                </g>
            </g>
        )
    }

    populateRow(cellXCoords, yOffset, rowIndex) {
        const row = [];
        for (let i=0; i<cellXCoords.length; i++) {
            const x1 = cellXCoords[i].x1;
            const x2 = cellXCoords[i].x2;
            const y1 = yOffset - this.props.gridCellWidth;
            const y2 = yOffset;
            row.push(
                <g
                    role='gridcell'
                    key={`gridcell-${String.fromCharCode(65+i)}${rowIndex}`}
                    aria-describedby={`column-${String.fromCharCode(65+i)} row-${rowIndex}`}>
                    <path
                        className='Scene__grid-cell'
                        role='img'
                        aria-label={
                            `${this.props.characterState.xPos <= x2 && this.props.characterState.xPos >= x1 &&
                            this.props.characterState.yPos <= y2 && this.props.characterState.yPos >= y1 ?
                            this.props.intl.formatMessage({id:'Scene.robotCharacter'}) :
                            this.props.intl.formatMessage({id:'Scene.backgroundOnly'})}`}
                        fill='transparent'
                        d={`M${x1} ${y1} L${x2} ${y1} L${x2} ${y2} L${x1} ${y2} Z`}
                    />
                </g>
            );
        }
        return row;
    }

    drawGrid(minX: number, minY: number, sceneWidth: number, sceneHeight: number) {
        const grid = [];
        const cellXCoords = [];
        if (this.props.numRows === 0 || this.props.numColumns === 0) {
            return grid;
        }
        const rowLabelOffset = sceneWidth * 0.025;
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
            cellXCoords.push({
                x1: xOffset - this.props.gridCellWidth,
                x2: xOffset
            });
        }
        let yOffset = minY;
        grid.push(this.generateColumnHeaders(cellXCoords, minY, sceneHeight));
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
                <g role='rowgroup' key={`row-${i}`}>
                    <g role='row'>
                        <text
                            scope='row'
                            role='rowheader'
                            className='Scene__grid-label'
                            textAnchor='end'
                            id={`row-${i}`}
                            key={`grid-cell-label-${i}`}
                            dominantBaseline='middle'
                            x={minX - rowLabelOffset}
                            y={yOffset - this.props.gridCellWidth / 2}>
                            {i}
                        </text>
                        {this.populateRow(cellXCoords, yOffset, i)}
                    </g>
                </g>
            )
        }
        return grid;
    }

    drawCharacterPath() {
        return this.props.characterState.path.map((pathSegment, i) => {
            return <line
                className='Scene__path-line'
                key={`path-${i}`}
                x1={pathSegment.x1}
                y1={pathSegment.y1}
                x2={pathSegment.x2}
                y2={pathSegment.y2} />
        });
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
                    className='Scene'>
                    <svg
                        aria-label='scene'
                        role='grid'
                        aria-colcount={this.props.numColumns}
                        aria-rowcount={this.props.numRows}
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox={`${minX} ${minY} ${width} ${height}`}>
                        <defs>
                            <clipPath id='Scene-clippath'>
                                <rect x={minX} y={minY} width={width} height={height} />
                            </clipPath>
                        </defs>
                        {this.drawGrid(minX, minY, width, height)}
                        <g clipPath='url(#Scene-clippath)'>
                            {this.drawCharacterPath()}
                            <RobotCharacter
                                transform={robotCharacterTransform}
                                width={this.props.gridCellWidth * 0.6}
                            />
                        </g>
                    </svg>
                </span>
            </div>
        );
    }
}

export default injectIntl(Scene);
