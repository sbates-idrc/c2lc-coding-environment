// @flow

import React from 'react';
import CharacterDescriptionBuilder from './CharacterDescriptionBuilder';
import CharacterState from './CharacterState';
import CustomBackground from './CustomBackground';
import CustomBackgroundSceneLayer from './CustomBackgroundSceneLayer';
import DesignModeCursorState from './DesignModeCursorState';
import SceneBackground from './SceneBackground';
import SceneCharacter from './SceneCharacter';
import SceneCharacterPath from './SceneCharacterPath';
import SceneColumnLabels from './SceneColumnLabels';
import SceneDimensions from './SceneDimensions';
import SceneGrid from './SceneGrid';
import SceneMessage from './SceneMessage';
import SceneRowLabels from './SceneRowLabels';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import './PaintbrushCursor.css';
import './Scene.scss';
import './Worlds.scss';
import type { ThemeName, RunningState } from './types';
import type { WorldName } from './Worlds';
import { ReactComponent as PaintbrushCursor } from './svg/PaintbrushCursor.svg';
import { ReactComponent as StartIndicator } from './svg/StartIndicator.svg';

const startIndicatorWidth = 0.45;

type MousePosition = {
    x: number,
    y: number
};

export type SceneProps = {
    dimensions: SceneDimensions,
    characterState: CharacterState,
    designModeCursorState: DesignModeCursorState,
    theme: ThemeName,
    world: WorldName,
    customBackground: CustomBackground,
    customBackgroundDesignMode: boolean,
    startingX: number,
    startingY: number,
    runningState: RunningState,
    message: ?string,
    characterDescriptionBuilder: CharacterDescriptionBuilder,
    onCloseMessage: () => void,
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

    generateAriaLabel() {
        const worldLabel = this.props.intl.formatMessage({id: this.props.world + '.name'});
        const numColumns = this.props.dimensions.getWidth();
        const numRows = this.props.dimensions.getHeight();

        const characterDescription = this.props.characterDescriptionBuilder.buildDescription(
            this.props.characterState,
            this.props.world,
            this.props.customBackground
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

    /* istanbul ignore next */
    scrollCharacterIntoView() {
        this.scrollSquareIntoView(
            this.props.characterState.xPos,
            this.props.characterState.yPos
        );
    }

    /* istanbul ignore next */
    scrollDesignModeCursorIntoView() {
        this.scrollSquareIntoView(
            this.props.designModeCursorState.x,
            this.props.designModeCursorState.y
        );
    }

    /* istanbul ignore next */
    scrollSquareIntoView(x: number, y: number) {
        // Check to see if the specified square is visible. If not, scroll to
        // bring it into view. We do this ourselves for two reasons:
        //
        // 1. On Safari, scrollIntoView doesn't work on SVG elements (C2LC-347)
        // 2. On Firefox, scrollIntoView seems to scroll to the centre of
        //    an element rather than bringing it completely into view (C2LC-343)

        if (this.sceneRef.current != null && this.sceneSvgRef.current != null) {
            const sceneElem = this.sceneRef.current;
            const sceneSvgElem = this.sceneSvgRef.current;

            const sceneBounds = sceneElem.getBoundingClientRect();
            const sceneSvgBounds = sceneSvgElem.getBoundingClientRect();

            // Calculate the grid square width in pixels by dividing the width
            // of the scene in pixels by the number of columns in the scene
            const squareW = sceneSvgBounds.width / this.props.dimensions.getWidth();

            // Calculate the grid square height in pixels by dividing the height
            // of the scene in pixels by the number of rows in the scene
            const squareH = sceneSvgBounds.height / this.props.dimensions.getHeight();

            // We add some padding to the position checking to ensure that we
            // always leave some room between the target square and the edge of
            // the scene (unless we are in the first or last row/col)
            const paddingH = 0.75 * squareW;
            const paddingV = 0.75 * squareH;

            // Calculate the bounds of the target square to scroll into view
            const targetSquareLeft = (x - this.props.dimensions.getMinX()) * squareW;
            const targetSquareRight = targetSquareLeft + squareW;
            const targetSquareTop = (y - this.props.dimensions.getMinY()) * squareH;
            const targetSquareBottom = targetSquareTop + squareH;

            if (targetSquareLeft - paddingH < sceneElem.scrollLeft) {
                // Off screen to the left
                sceneElem.scrollLeft = targetSquareLeft - paddingH;
            } else if (targetSquareRight + paddingH > sceneElem.scrollLeft + sceneBounds.width) {
                // Off screen to the right
                sceneElem.scrollLeft = targetSquareRight + paddingH - sceneBounds.width;
            }

            if (targetSquareTop - paddingV < sceneElem.scrollTop) {
                // Off screen above
                sceneElem.scrollTop = targetSquareTop - paddingV;
            } else if (targetSquareBottom + paddingV > sceneElem.scrollTop + sceneBounds.height) {
                // Off screen below
                sceneElem.scrollTop = targetSquareBottom + paddingV - sceneBounds.height;
            }
        }
    }

    /* istanbul ignore next */
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

    /* istanbul ignore next */
    handleMouseDownSceneSvg = (e: any) => {
        const pos: MousePosition = this.getPositionFromSceneSvgMouseEvent(e);
        this.lastPaintX = pos.x;
        this.lastPaintY = pos.y;
        this.props.onPaintScene(pos.x, pos.y);
    }

    /* istanbul ignore next */
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

        return (
            <React.Fragment>
                <div className='Scene__container'>
                    {this.props.message != null &&
                        <div className='Scene__SceneMessage'>
                            <SceneMessage
                                intl={this.props.intl}
                                message={this.props.message}
                                onClose={this.props.onCloseMessage}
                            />
                        </div>
                    }
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
                            aria-hidden={true}
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
                                theme={this.props.theme}
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
                                <StartIndicator
                                    className='Scene__startIndicator'
                                    aria-hidden={true}
                                    // The centre of the starting square is (startingX, startingY).
                                    // Calculate the top left corner of the indicator
                                    // by subtracting half of the indicator width from
                                    // each of the startingX and startingY.
                                    x={this.props.startingX - (startIndicatorWidth / 2)}
                                    y={this.props.startingY - (startIndicatorWidth / 2)}
                                    width={startIndicatorWidth}
                                    height={startIndicatorWidth}
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
                                    characterState={this.props.characterState}
                                    theme={this.props.theme}
                                    world={this.props.world}
                                />
                                {this.props.customBackgroundDesignMode &&
                                    <PaintbrushCursor
                                        className='Scene__designModeCursor'
                                        aria-hidden={true}
                                        x={this.props.designModeCursorState.x - 0.5}
                                        y={this.props.designModeCursorState.y - 0.5}
                                        width={1}
                                        height={1}
                                    />
                                }
                            </g>
                        </svg>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    /* istanbul ignore next */
    componentDidUpdate(prevProps) {
        if (prevProps.characterState.xPos !== this.props.characterState.xPos
                || prevProps.characterState.yPos !== this.props.characterState.yPos) {
            this.scrollCharacterIntoView();
        } else if (prevProps.runningState !== this.props.runningState
                && this.props.runningState === 'running') {
            this.scrollCharacterIntoView();
        } else if (prevProps.customBackgroundDesignMode !== this.props.customBackgroundDesignMode
                && this.props.customBackgroundDesignMode === false) {
            this.scrollCharacterIntoView();
        } else if (this.props.customBackgroundDesignMode === true
                && (prevProps.designModeCursorState.x !== this.props.designModeCursorState.x
                    || prevProps.designModeCursorState.y !== this.props.designModeCursorState.y)) {
            this.scrollDesignModeCursorIntoView();
        }
    }
}

export default injectIntl(Scene);
