// @flow

import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import React from 'react';
import CharacterState from './CharacterState';
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
import { getTileName, isEraser } from './TileData';
import type { TileCode } from './TileData';
import './CharacterPositionController.scss';

type CharacterPositionControllerProps = {
    intl: IntlShape,
    characterState: CharacterState,
    editingDisabled: boolean,
    customBackgroundDesignMode: boolean,
    selectedCustomBackgroundTile: ?TileCode,
    onClickTurnLeft: () => void,
    onClickTurnRight: () => void,
    onClickLeft: () => void,
    onClickRight: () => void,
    onClickUp: () => void,
    onClickDown: () => void,
    onChangeCharacterXPosition: (columnLabel: string) => void,
    onChangeCharacterYPosition: (rowLabel: string) => void,
    onClickSetStartButton: () => void,
    onClickPaintbrushButton: () => void
};

type CharacterPositionControllerState = {
    prevPropsCharacterState: CharacterState,
    characterColumnLabel: string,
    characterRowLabel: string
};

class CharacterPositionController extends React.Component<CharacterPositionControllerProps, CharacterPositionControllerState> {
    constructor(props: CharacterPositionControllerProps) {
        super(props);
        this.state = {
            prevPropsCharacterState: this.props.characterState,
            characterColumnLabel: this.props.characterState.getColumnLabel(),
            characterRowLabel: this.props.characterState.getRowLabel()
        }
    }

    static getDerivedStateFromProps(props: CharacterPositionControllerProps, state: CharacterPositionControllerState) {
        if (props.characterState !== state.prevPropsCharacterState) {
            const currentCharacterState = props.characterState;
            return {
                prevPropsCharacterState: currentCharacterState,
                characterColumnLabel: currentCharacterState.getColumnLabel(),
                characterRowLabel: currentCharacterState.getRowLabel()
            };
        } else {
            return null;
        }
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

    handleChangeCharacterPositionLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.currentTarget.name === 'xPosition') {
            this.setState({
                characterColumnLabel: e.currentTarget.value
            });
        } else if (e.currentTarget.name === 'yPosition'){
            this.setState({
                characterRowLabel: e.currentTarget.value
            });
        }
    }

    handleBlurCharacterPositionLabel = (e: SyntheticEvent<HTMLInputElement>) => {
        if (e.currentTarget.name === 'xPosition') {
            this.props.onChangeCharacterXPosition(this.state.characterColumnLabel);
        } else if (e.currentTarget.name === 'yPosition'){
            this.props.onChangeCharacterYPosition(this.state.characterRowLabel);
        }
    }

    handleKeyDownCharacterPositionLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        const enterKey = 'Enter';
        if (e.key === enterKey) {
            e.preventDefault();
            if (e.currentTarget.name === 'xPosition') {
                this.props.onChangeCharacterXPosition(this.state.characterColumnLabel);
            } else if (e.currentTarget.name === 'yPosition'){
                this.props.onChangeCharacterYPosition(this.state.characterRowLabel);
            }
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
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveUp'})}
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
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveLeft'})}
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
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveRight'})}
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
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveDown'})}
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
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.columnPosition'})}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='1'
                        size='2'
                        type='text'
                        value={this.state.characterColumnLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeCharacterPositionLabel : () => {}}
                        onKeyDown={this.handleKeyDownCharacterPositionLabel}
                        onBlur={this.handleBlurCharacterPositionLabel}
                    />
                    <input
                        name='yPosition'
                        className={characterPositionRowTextInputClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.rowPosition'})}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.characterRowLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeCharacterPositionLabel : () => {}}
                        onKeyDown={this.handleKeyDownCharacterPositionLabel}
                        onBlur={this.handleBlurCharacterPositionLabel}
                    />
                </div>
            </div>
        )
    }
}

export default injectIntl(CharacterPositionController);
