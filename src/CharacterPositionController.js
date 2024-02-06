// @flow

import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import React from 'react';
import classNames from 'classnames';
import IconButton from './IconButton';
import { ReactComponent as MovePositionUp } from './svg/MovePositionUp.svg';
import { ReactComponent as MovePositionRight } from './svg/MovePositionRight.svg';
import { ReactComponent as MovePositionDown } from './svg/MovePositionDown.svg';
import { ReactComponent as MovePositionLeft } from './svg/MovePositionLeft.svg';
import { ReactComponent as TurnPositionRight } from './svg/TurnPositionRight.svg';
import { ReactComponent as TurnPositionLeft } from './svg/TurnPositionLeft.svg';
import { ReactComponent as PaintbrushIcon } from './svg/PaintbrushIcon.svg';
import { ReactComponent as SetStartIcon } from './svg/SetStartIcon.svg';
import SceneDimensions from './SceneDimensions';
import { getTileName, isEraser } from './TileData';
import type { TileCode } from './TileData';
import './CharacterPositionController.scss';

type CharacterPositionControllerProps = {
    intl: IntlShape,
    x: number,
    y: number,
    sceneDimensions: SceneDimensions,
    editingDisabled: boolean,
    customBackgroundDesignMode: boolean,
    selectedCustomBackgroundTile: ?TileCode,
    onClickTurnLeft: () => void,
    onClickTurnRight: () => void,
    onClickLeft: () => void,
    onClickRight: () => void,
    onClickUp: () => void,
    onClickDown: () => void,
    onChangeCharacterXPosition: (x: number) => void,
    onChangeCharacterYPosition: (y: number) => void,
    onClickSetStartButton: () => void,
    onClickPaintbrushButton: () => void
};

type CharacterPositionControllerState = {
    prevPropsX: number,
    prevPropsY: number,
    characterColumnLabel: string,
    characterRowLabel: string
};

class CharacterPositionController extends React.Component<CharacterPositionControllerProps, CharacterPositionControllerState> {
    constructor(props: CharacterPositionControllerProps) {
        super(props);
        this.state = {
            prevPropsX: this.props.x,
            prevPropsY: this.props.y,
            characterColumnLabel: CharacterPositionController.getColumnLabel(this.props.x, this.props.sceneDimensions),
            characterRowLabel: CharacterPositionController.getRowLabel(this.props.y, this.props.sceneDimensions)
        }
    }

    static getDerivedStateFromProps(props: CharacterPositionControllerProps, state: CharacterPositionControllerState) {
        if (props.x !== state.prevPropsX || props.y !== state.prevPropsY) {
            return {
                prevPropsX: props.x,
                prevPropsY: props.y,
                characterColumnLabel: CharacterPositionController.getColumnLabel(props.x, props.sceneDimensions),
                characterRowLabel: CharacterPositionController.getRowLabel(props.y, props.sceneDimensions)
            };
        } else {
            return null;
        }
    }

    static getColumnLabel(x: number, sceneDimensions: SceneDimensions): string {
        const label = sceneDimensions.getColumnLabel(x);
        return label == null ? '' : label;
    }

    static getRowLabel(y: number, sceneDimensions: SceneDimensions): string {
        const label = sceneDimensions.getRowLabel(y);
        return label == null ? '' : label;
    }

    handleClickCharacterPositionButton = (e: SyntheticEvent<HTMLElement>) => {
        this.doClickCharacterPositionButton(e.currentTarget.getAttribute('value'));
    }

    handleKeyDownCharacterPositionButton = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.doClickCharacterPositionButton(e.currentTarget.getAttribute('value'));
        }
    }

    doClickCharacterPositionButton(button: ?string) {
        if (button != null) {
            switch(button) {
                case 'turnLeft':
                    this.props.onClickTurnLeft();
                    break;
                case 'turnRight':
                    this.props.onClickTurnRight();
                    break;
                case 'left':
                    this.props.onClickLeft();
                    break;
                case 'right':
                    this.props.onClickRight();
                    break;
                case 'up':
                    this.props.onClickUp();
                    break;
                case 'down':
                    this.props.onClickDown();
                    break;
                default:
                    break;
            }
        }
    }

    handleChangeColumn = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({
            characterColumnLabel: e.currentTarget.value
        });
    }

    handleChangeRow = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({
            characterRowLabel: e.currentTarget.value
        });
    }

    handleBlurColumn = () => {
        this.changeCharacterXPositionIfValid();
    }

    handleBlurRow = () => {
        this.changeCharacterYPositionIfValid();
    }

    handleKeyDownColumn = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.changeCharacterXPositionIfValid();
        }
    }

    handleKeyDownRow = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.changeCharacterYPositionIfValid();
        }
    }

    changeCharacterXPositionIfValid() {
        const xFromLabel = this.props.sceneDimensions.getXFromColumnLabel(this.state.characterColumnLabel);
        if (xFromLabel == null) {
            // Reset the label
            this.setState({
                characterColumnLabel: CharacterPositionController.getColumnLabel(this.props.x, this.props.sceneDimensions)
            })
        } else {
            this.props.onChangeCharacterXPosition(xFromLabel);
        }
    }

    changeCharacterYPositionIfValid() {
        const yFromLabel = this.props.sceneDimensions.getYFromRowLabel(this.state.characterRowLabel);
        if (yFromLabel == null) {
            // Reset the label
            this.setState({
                characterRowLabel: CharacterPositionController.getRowLabel(this.props.y, this.props.sceneDimensions)
            })
        } else {
            this.props.onChangeCharacterYPosition(yFromLabel);
        }
    }

    getPaintbrushButtonAriaLabel() {
        if (this.props.selectedCustomBackgroundTile == null) {
            return this.props.intl.formatMessage({
                id: 'CharacterPositionController.paintbrushButtonNoSelection'
            });
        } else {
            if (isEraser(this.props.selectedCustomBackgroundTile)) {
                return this.props.intl.formatMessage({
                    id: 'CharacterPositionController.paintbrushButtonEraserSelected'
                });
            } else {
                const tileDescription = this.props.intl.formatMessage({
                    id: `TileDescription.${getTileName(this.props.selectedCustomBackgroundTile)}`
                });

                return this.props.intl.formatMessage(
                    {
                        id: 'CharacterPositionController.paintbrushButtonTileSelected'
                    },
                    {
                        tile: tileDescription
                    }
                );
            }
        }
    }

    render() {
        const characterPositionButtonClassName = classNames(
            'CharacterPositionController__character-position-button',
            this.props.editingDisabled && 'CharacterPositionController__character-position-button--disabled'
        );

        const characterPositionColumnTextInputClassName = classNames(
            'ProgramBlock__character-position-coordinate-box',
            'ProgramBlock__character-position-coordinate-box-column',
            this.props.editingDisabled && 'ProgramBlock__character-position-coordinate-box--disabled'
        );


        const characterPositionRowTextInputClassName = classNames(
            'ProgramBlock__character-position-coordinate-box',
            'ProgramBlock__character-position-coordinate-box-row',
            this.props.editingDisabled && 'ProgramBlock__character-position-coordinate-box--disabled'
        );

        const moveUpLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.moveUp'
                : 'CharacterPositionController.editPosition.moveUp'
        });

        const moveLeftLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.moveLeft'
                : 'CharacterPositionController.editPosition.moveLeft'
        });

        const moveRightLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.moveRight'
                : 'CharacterPositionController.editPosition.moveRight'
        });

        const moveDownLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.moveDown'
                : 'CharacterPositionController.editPosition.moveDown'
        });

        const columnTextBoxLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.columnPosition'
                : 'CharacterPositionController.editPosition.columnPosition'
        });

        const rowTextBoxLabel = this.props.intl.formatMessage({
            id: this.props.customBackgroundDesignMode ?
                'CharacterPositionController.editPosition.designMode.rowPosition'
                : 'CharacterPositionController.editPosition.rowPosition'
        });

        return (
            <div className='CharacterPositionController'>
                {!(this.props.customBackgroundDesignMode) &&
                    <div className='CharacterPositionController__character-turn-positions'>
                        <TurnPositionLeft
                            className={characterPositionButtonClassName}
                            aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnLeft'})}
                            aria-disabled={this.props.editingDisabled}
                            role='button'
                            tabIndex='0'
                            value='turnLeft'
                            onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                            onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                        />
                        <TurnPositionRight
                            className={characterPositionButtonClassName}
                            aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnRight'})}
                            aria-disabled={this.props.editingDisabled}
                            role='button'
                            tabIndex='0'
                            value='turnRight'
                            onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                            onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                        />
                    </div>
                }
                <div className='CharacterPositionController__character-move-position-top'>
                    <MovePositionUp
                        className={characterPositionButtonClassName}
                        aria-label={moveUpLabel}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='up'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                    />
                </div>
                <div className='CharacterPositionController__character-move-position-sides'>
                    <MovePositionLeft
                        className={characterPositionButtonClassName}
                        aria-label={moveLeftLabel}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='left'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                    />
                    {this.props.customBackgroundDesignMode ?
                        <IconButton
                            className='CharacterPositionController__paintbrushButton'
                            disabled={this.props.selectedCustomBackgroundTile == null}
                            ariaLabel={this.getPaintbrushButtonAriaLabel()}
                            onClick={this.props.onClickPaintbrushButton}
                        >
                            <PaintbrushIcon
                                className='CharacterPositionController__centerButtonIcon'
                            />
                        </IconButton>
                        :
                        <IconButton
                            className='CharacterPositionController__setStartButton'
                            disabled={this.props.editingDisabled}
                            ariaLabel={this.props.intl.formatMessage({id:'CharacterPositionController.setStartButton'})}
                            onClick={this.props.onClickSetStartButton}
                        >
                            <SetStartIcon
                                className='CharacterPositionController__centerButtonIcon'
                            />
                        </IconButton>
                    }
                    <MovePositionRight
                        className={characterPositionButtonClassName}
                        aria-label={moveRightLabel}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='right'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                    />
                </div>
                <div className='CharacterPositionController__character-move-position-bottom'>
                    <MovePositionDown
                        className={characterPositionButtonClassName}
                        aria-label={moveDownLabel}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='down'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined}
                    />
                </div>
                <div className='CharacterPositionController__character-move-position-coordinate'>
                    <input
                        name='xPosition'
                        className={characterPositionColumnTextInputClassName}
                        aria-label={columnTextBoxLabel}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='1'
                        size='2'
                        type='text'
                        value={this.state.characterColumnLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeColumn : () => {}}
                        onKeyDown={this.handleKeyDownColumn}
                        onBlur={this.handleBlurColumn}
                    />
                    <input
                        name='yPosition'
                        className={characterPositionRowTextInputClassName}
                        aria-label={rowTextBoxLabel}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.characterRowLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeRow : () => {}}
                        onKeyDown={this.handleKeyDownRow}
                        onBlur={this.handleBlurRow}
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(CharacterPositionController);
