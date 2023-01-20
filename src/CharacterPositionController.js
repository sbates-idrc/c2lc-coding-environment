// @flow

import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import React from 'react';
import CharacterState from './CharacterState';
import classNames from 'classnames';
import { getWorldCharacter, getWorldProperties } from './Worlds';
import { ReactComponent as MovePositionUp } from './svg/MovePositionUp.svg';
import { ReactComponent as MovePositionRight } from './svg/MovePositionRight.svg';
import { ReactComponent as MovePositionDown } from './svg/MovePositionDown.svg';
import { ReactComponent as MovePositionLeft } from './svg/MovePositionLeft.svg';
import { ReactComponent as TurnPositionRight } from './svg/TurnPositionRight.svg';
import { ReactComponent as TurnPositionLeft } from './svg/TurnPositionLeft.svg';
import type { ThemeName } from './types';
import type { WorldName } from './Worlds';
import './CharacterPositionController.scss';

type CharacterPositionControllerProps = {
    intl: IntlShape,
    characterState: CharacterState,
    editingDisabled: boolean,
    theme: ThemeName,
    world: WorldName,
    onChangeCharacterPosition: (direction: ?string) => void,
    onChangeCharacterXPosition: (x: number) => void,
    onChangeCharacterYPosition: (y: number) => void
};

type CharacterPositionControllerState = {
    prevPropsCharacterState: CharacterState,
    characterColumnLabel: string,
    userHasChangedColumnLabel: boolean,
    characterRowLabel: string,
    userHasChangedRowLabel: boolean
};

class CharacterPositionController extends React.Component<CharacterPositionControllerProps, CharacterPositionControllerState> {
    constructor(props: CharacterPositionControllerProps) {
        super(props);
        this.state = {
            prevPropsCharacterState: this.props.characterState,
            characterColumnLabel: this.props.characterState.getColumnLabel(),
            userHasChangedColumnLabel: false,
            characterRowLabel: this.props.characterState.getRowLabel(),
            userHasChangedRowLabel: false
        }
    }

    static getDerivedStateFromProps(props: CharacterPositionControllerProps, state: CharacterPositionControllerState) {
        if (props.characterState !== state.prevPropsCharacterState) {
            const currentCharacterState = props.characterState;
            return {
                prevPropsCharacterState: currentCharacterState,
                characterColumnLabel: currentCharacterState.getColumnLabel(),
                userHasChangedColumnLabel: false,
                characterRowLabel: currentCharacterState.getRowLabel(),
                userHasChangedRowLabel: false
            };
        } else {
            return null;
        }
    }

    handleClickCharacterPositionButton = (e: SyntheticEvent<HTMLElement>) => {
        this.props.onChangeCharacterPosition(e.currentTarget.getAttribute('value'));
    }

    handleKeyDownCharacterPositionButton = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.onChangeCharacterPosition(e.currentTarget.getAttribute('value'));
        }
    }

    handleChangeColumnLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({
            characterColumnLabel: e.currentTarget.value,
            userHasChangedColumnLabel: true
        });
    }

    handleChangeRowLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        this.setState({
            characterRowLabel: e.currentTarget.value,
            userHasChangedRowLabel: true
        });
    }

    handleBlurColumnLabel = () => {
        const x = this.props.characterState.getXFromColumnLabel(this.state.characterColumnLabel);
        if (this.state.userHasChangedColumnLabel && x != null) {
            this.props.onChangeCharacterXPosition(x);
        } else {
            this.setState({
                characterColumnLabel: this.props.characterState.getColumnLabel(),
                userHasChangedColumnLabel: false
            });
        }
    }

    handleBlurRowLabel = () => {
        const y = this.props.characterState.getYFromRowLabel(this.state.characterRowLabel);
        if (this.state.userHasChangedRowLabel && y != null) {
            this.props.onChangeCharacterYPosition(y);
        } else {
            this.setState({
                characterRowLabel: this.props.characterState.getRowLabel(),
                userHasChangedRowLabel: false
            });
        }
    }

    handleKeyDownColumnLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const x = this.props.characterState.getXFromColumnLabel(this.state.characterColumnLabel);
            if (x != null) {
                this.props.onChangeCharacterXPosition(x);
            } else {
                this.setState({
                    characterColumnLabel: this.props.characterState.getColumnLabel(),
                    userHasChangedColumnLabel: false
                });
            }
        }
    }

    handleKeyDownRowLabel = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const y = this.props.characterState.getYFromRowLabel(this.state.characterRowLabel);
            if (y != null) {
                this.props.onChangeCharacterYPosition(y);
            } else {
                this.setState({
                    characterRowLabel: this.props.characterState.getRowLabel(),
                    userHasChangedRowLabel: false
                });
            }
        }
    }

    getWorldEnableFlipCharacter(): boolean {
        return getWorldProperties(this.props.world).enableFlipCharacter;
    }

    getWorldCharacter() {
        // We use a CSS approach because Safari doesn't support scale transforms whole svgs (and ignores the rotation
        // if you include scaling in the transform).  See:
        // https://stackoverflow.com/questions/48248512/svg-transform-rotate180-does-not-work-in-safari-11
        const worldCharacterClassName = classNames(
            'CharacterPositionController__character-column-character',
            'CharacterPositionController__character-column-character--angle' + this.props.characterState.direction,
            this.getWorldEnableFlipCharacter() && 'CharacterPositionController__character-column-character--enable-flip'
        );

        const character = getWorldCharacter(this.props.theme, this.props.world);
        return React.createElement(character, {
            className: worldCharacterClassName,
            transform: ""
        });
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
            <div className='CharacterPositionController__character-column'>
                <div className='CharacterPositionController__character-turn-positions'>
                    <TurnPositionLeft
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnLeft'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='turnLeft'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                    <TurnPositionRight
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.turnRight'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='turnRight'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                </div>
                <div className='CharacterPositionController__character-move-position-top'>
                    <MovePositionUp
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveUp'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='up'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
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
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
                    <div
                        aria-hidden='true'
                        className={`CharacterPositionController__character-column-character-container
                            CharacterPositionController__character-column-character-container--${this.props.world}`}
                        role='img'>
                        {this.getWorldCharacter()}
                    </div>
                    <MovePositionRight
                        className={characterPositionButtonClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.moveRight'})}
                        aria-disabled={this.props.editingDisabled}
                        role='button'
                        tabIndex='0'
                        value='right'
                        onKeyDown={!this.props.editingDisabled ? this.handleKeyDownCharacterPositionButton : undefined}
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
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
                        onClick={!this.props.editingDisabled ? this.handleClickCharacterPositionButton : undefined} />
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
                        onChange={!this.props.editingDisabled ? this.handleChangeColumnLabel : () => {}}
                        onKeyDown={this.handleKeyDownColumnLabel}
                        onBlur={this.handleBlurColumnLabel} />
                    <input
                        name='yPosition'
                        className={characterPositionRowTextInputClassName}
                        aria-label={this.props.intl.formatMessage({id:'CharacterPositionController.editPosition.rowPosition'})}
                        aria-disabled={this.props.editingDisabled}
                        maxLength='2'
                        size='2'
                        type='text'
                        value={this.state.characterRowLabel}
                        onChange={!this.props.editingDisabled ? this.handleChangeRowLabel : () => {}}
                        onKeyDown={this.handleKeyDownRowLabel}
                        onBlur={this.handleBlurRowLabel} />
                </div>
            </div>
        )
    }
}

export default injectIntl(CharacterPositionController);
