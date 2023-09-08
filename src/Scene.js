// @flow

import React from 'react';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import CustomBackgroundSceneLayer from './CustomBackgroundSceneLayer';
import SceneBackground from './SceneBackground';
import SceneCharacter from './SceneCharacter';
import SceneCharacterPath from './SceneCharacterPath';
import SceneColumnLabels from './SceneColumnLabels';
import SceneDimensions from './SceneDimensions';
import SceneGrid from './SceneGrid';
import SceneRowLabels from './SceneRowLabels';
import { getWorldProperties } from './Worlds';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import './Scene.scss';
import './Worlds.scss';
import type { ThemeName, RunningState } from './types';
import type { WorldName } from './Worlds';

const startingGridCellPointSize = 0.25;

type MousePosition = {
    x: number,
    y: number
};

export type SceneProps = {
    dimensions: SceneDimensions,
    characterState: CharacterState,
    theme: ThemeName,
    world: WorldName,
    customBackground: CustomBackground,
    customBackgroundEditMode: boolean,
    startingX: number,
    startingY: number,
    runningState: RunningState,
    characterDescriptionBuilder: CharacterDescriptionBuilder,
    onPaintScene: (x: number, y: number) => void,
    intl: IntlShape
};

class Scene extends React.Component<SceneProps, {}> {
    rowHeaderRef: { current: null | HTMLDivElement };
    columnHeaderRef: { current: null | HTMLDivElement };
    sceneRef: { current: null | HTMLDivElement };
    sceneSvgRef: { current: null | Element };
    lastPaintX: ?number;
    lastPaintY: ?number;

    constructor (props: SceneProps) {
        super(props);
        this.rowHeaderRef = React.createRef();
        this.columnHeaderRef = React.createRef();
        this.sceneRef = React.createRef();
        this.sceneSvgRef = React.createRef();
        this.lastPaintX = null;
        this.lastPaintY = null;
    }

    getDirectionWords(direction: number): string {
        return this.props.intl.formatMessage({id: `Direction.${direction}`});
    }

    getRelativeDirection(xPos: number, yPos: number): string {
        if (this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'inBounds') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.0'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.1'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'inBounds' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.2'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsAbove') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.3'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'inBounds') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.4'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsAbove' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.5'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'inBounds' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.6'});
        } else if (
            this.props.dimensions.getBoundsStateY(yPos) === 'outOfBoundsBelow' &&
            this.props.dimensions.getBoundsStateX(xPos) === 'outOfBoundsBelow') {
            return this.props.intl.formatMessage({id: 'RelativeDirection.7'});
        } else {
            throw new Error(`Unrecognized xPos: ${xPos} or yPos: ${yPos}`);
        }
    }

    generateAriaLabel() {
        const worldLabel = this.props.intl.formatMessage({id: this.props.world + '.name'});
        const numColumns = this.props.dimensions.getWidth();
        const numRows = this.props.dimensions.getHeight();

        const characterDescription = this.props.characterDescriptionBuilder.buildCharacterDescription(
            this.props.characterState,
            this.props.world,
            this.props.customBackground,
            this.props.customBackgroundEditMode
        );

        return this.props.intl.formatMessage(
            { id: 'Scene.description' },
            {
                world: worldLabel,
                numColumns: numColumns,
                numRows: numRows,
                characterDescription: characterDescription
            }
        );
    }

    handleScrollScene = (e: SyntheticEvent<HTMLDivElement>) => {
        const sceneScrollTop = e.currentTarget.scrollTop;
        const sceneScrollLeft = e.currentTarget.scrollLeft;

        if (sceneScrollTop != null && this.rowHeaderRef.current != null) {
            this.rowHeaderRef.current.scrollTop = sceneScrollTop;
        }

        if (sceneScrollLeft != null && this.columnHeaderRef.current != null) {
            this.columnHeaderRef.current.scrollLeft = sceneScrollLeft;
        }
    }

    scrollCharacterIntoView() {
        // Required to avoid the lack of scrollIntoView on SVG elements in Safari.
        /* istanbul ignore next */
        if (this.sceneRef.current != null && this.sceneSvgRef.current != null) {

            const sceneElem = this.sceneRef.current;
            const sceneSvgElem = this.sceneSvgRef.current;

            const sceneBounds = sceneElem.getBoundingClientRect();
            const sceneSvgBounds = sceneSvgElem.getBoundingClientRect();

            // Calculate the grid cell width in pixels by dividing the width
            // of the scene in pixels by the number of columns in the scene
            const cellWidth = sceneSvgBounds.width / this.props.dimensions.getWidth();
            // Calculate the grid cell height in pixels by dividing the height
            // of the scene in pixels by the number of rows in the scene
            const cellHeight = sceneSvgBounds.height / this.props.dimensions.getHeight();

            // Check to see if the character is visible. If not, scroll to
            // bring it into view. We do this ourselves for two reasons:
            //
            // 1. On Safari, scrollIntoView doesn't work on SVG elements
            //    (C2LC-347)
            // 2. On Firefox, scrollIntoView seems to scroll to the center of
            //    the character rather than bringing it completely into view
            //    (C2LC-343)

            // We add some padding to the position checking to ensure that we
            // always leave some room between the character and the edge of the
            // scene (unless we are in the first or last row/col)
            const paddingH = 0.75 * cellWidth;
            const paddingV = 0.75 * cellHeight;

            // Calculate the location of the grid cell that the character is on
            const cellLeft = (this.props.characterState.xPos - this.props.dimensions.getMinX()) * cellWidth;
            const cellRight = cellLeft + cellWidth;
            const cellTop = (this.props.characterState.yPos - this.props.dimensions.getMinY()) * cellHeight;
            const cellBottom = cellTop + cellHeight;

            if (cellLeft - paddingH < sceneElem.scrollLeft) {
                // Off screen to the left
                sceneElem.scrollLeft = cellLeft - paddingH;
            } else if (cellRight + paddingH > sceneElem.scrollLeft + sceneBounds.width) {
                // Off screen to the right
                sceneElem.scrollLeft = cellRight + paddingH - sceneBounds.width;
            }

            if (cellTop - paddingV < sceneElem.scrollTop) {
                // Off screen above
                sceneElem.scrollTop = cellTop - paddingV;
            } else if (cellBottom + paddingV > sceneElem.scrollTop + sceneBounds.height) {
                // Off screen below
                sceneElem.scrollTop = cellBottom + paddingV - sceneBounds.height;
            }
        }
    }

    getWorldEnableFlipCharacter(): boolean {
        return getWorldProperties(this.props.world).enableFlipCharacter;
    }

    getPositionFromSceneSvgMouseEvent(e: any): MousePosition {
        // $FlowFixMe: DOMPoint
        const clientPoint = new DOMPoint(e.clientX, e.clientY);
        const svgElem = e.currentTarget;
        const svgPoint =  clientPoint.matrixTransform(svgElem.getScreenCTM().inverse());
        return {
            x: Math.floor(svgPoint.x + 0.5),
            y: Math.floor(svgPoint.y + 0.5)
        };
    }

    handleMouseDownSceneSvg = (e: any) => {
        const pos: MousePosition = this.getPositionFromSceneSvgMouseEvent(e);
        this.lastPaintX = pos.x;
        this.lastPaintY = pos.y;
        this.props.onPaintScene(pos.x, pos.y);
    }

    handleMouseMoveSceneSvg = (e: any) => {
        const primaryButtonPressed = ((e.buttons % 2) === 1);
        if (primaryButtonPressed) {
            const pos: MousePosition = this.getPositionFromSceneSvgMouseEvent(e);
            if (pos.x !== this.lastPaintX || pos.y !== this.lastPaintY) {
                this.lastPaintX = pos.x;
                this.lastPaintY = pos.y;
                this.props.onPaintScene(pos.x, pos.y);
            }
        }
    }

    render() {
        const minX = this.props.dimensions.getMinX() - 0.5;
        const minY = this.props.dimensions.getMinY() - 0.5;
        const width = this.props.dimensions.getWidth();
        const height = this.props.dimensions.getHeight();

        // Subtract 90 degrees from the character bearing as the character
        // image is drawn upright when it is facing East
        let characterTransform = `translate(${this.props.characterState.xPos} ${this.props.characterState.yPos})`;
        if (!(this.props.customBackgroundEditMode)) {
            characterTransform += ` rotate(${this.props.characterState.getDirectionDegrees() - 90} 0 0)`;
            if (this.getWorldEnableFlipCharacter() && this.props.characterState.direction > 3) {
                characterTransform += ` scale(1 -1)`
            }
        }

        return (
            <React.Fragment>
                <div className='Scene__container'>
                    <div
                        tabIndex='-1'
                        aria-hidden='true'
                        className='Scene__row-header'
                        ref={this.rowHeaderRef}
                    >
                        <SceneRowLabels dimensions={this.props.dimensions}/>
                    </div>
                    <div
                        tabIndex='-1'
                        aria-hidden='true'
                        className='Scene__column-header'
                        ref={this.columnHeaderRef}
                    >
                        <SceneColumnLabels dimensions={this.props.dimensions}/>
                    </div>
                    <div
                        id='scene'
                        className='Scene'
                        role='img'
                        aria-label={this.generateAriaLabel()}
                        onScroll={this.handleScrollScene}
                        ref={this.sceneRef}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox={`${minX} ${minY} ${width} ${height}`}
                            ref={this.sceneSvgRef}
                            onMouseDown={this.handleMouseDownSceneSvg}
                            onMouseMove={this.handleMouseMoveSceneSvg}
                        >
                            <defs>
                                <clipPath id='Scene-clippath'>
                                    <rect x={minX} y={minY} width={width} height={height} />
                                </clipPath>
                            </defs>
                            <SceneBackground
                                dimensions={this.props.dimensions}
                                theme={this.props.theme}
                                world={this.props.world}
                            />
                            <CustomBackgroundSceneLayer
                                customBackground={this.props.customBackground}
                            />
                            <SceneGrid
                                dimensions={this.props.dimensions}
                                world={this.props.world}
                            />
                            <g clipPath='url(#Scene-clippath)'>
                                <SceneCharacterPath
                                    path={this.props.characterState.path}
                                    world={this.props.world}
                                />
                                <rect
                                    // Starting position indicator
                                    className={`Scene__starting-grid-cell-point Scene__starting-grid-cell-point--${this.props.world}`}
                                    // The centre of the starting cell is (startingX, startingY).
                                    // Calculate the top left corner of the indicator
                                    // by subtracting half of the indicator size from
                                    // each of the startingX and startingY.
                                    x={this.props.startingX - (startingGridCellPointSize / 2)}
                                    y={this.props.startingY - (startingGridCellPointSize / 2)}
                                    rx={0.06}
                                    height={startingGridCellPointSize}
                                    width={startingGridCellPointSize}
                                />
                                {this.props.theme === 'contrast' &&
                                    <circle
                                        className='Scene__characterOutline'
                                        cx={this.props.characterState.xPos}
                                        cy={this.props.characterState.yPos}
                                        r={0.51}
                                    />
                                }
                                <SceneCharacter
                                    world={this.props.world}
                                    theme={this.props.theme}
                                    customBackgroundEditMode={this.props.customBackgroundEditMode}
                                    transform={characterTransform}
                                    width={0.9}
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.characterState.xPos !== this.props.characterState.xPos
                || prevProps.characterState.yPos !== this.props.characterState.yPos) {
            this.scrollCharacterIntoView();
        }
        if (prevProps.runningState !== this.props.runningState
                && this.props.runningState === 'running') {
            this.scrollCharacterIntoView();
        }
    }
}

export default injectIntl(Scene);
