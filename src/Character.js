// @flow

import React from 'react';
import { ReactComponent as RobotIcon } from './svg/Robot.svg';
import { ReactComponent as SpaceShipIcon } from './svg/SpaceShip.svg';
import { ReactComponent as SafariJeepIcon } from './svg/SafariJeep.svg';
import { ReactComponent as SubmarineIcon } from './svg/Submarine.svg';

import { ReactComponent as SpaceShipGrayIcon } from './svg/SpaceShip-gray.svg';
import { ReactComponent as SafariJeepGrayIcon } from './svg/SafariJeep-gray.svg';
import { ReactComponent as SubmarineGrayIcon } from './svg/Submarine-gray.svg';

import { ReactComponent as SpaceShipContrastIcon } from './svg/SpaceShip-contrast.svg';
import { ReactComponent as SafariJeepContrastIcon } from './svg/SafariJeep-contrast.svg';
import { ReactComponent as SubmarineContrastIcon } from './svg/Submarine-contrast.svg';

import type { ThemeName, WorldName } from './types';
import './Character.scss';

type CharacterProps = {
    world: WorldName,
    theme: ThemeName,
    transform: string,
    width: number,
};

export default class Character extends React.Component<CharacterProps, {}> {
    getThemedCharacter = () => {
        if (this.props.world === 'Space') {
            if (this.props.theme === 'gray') {
                return (
                    <SpaceShipGrayIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else if (this.props.theme === 'contrast') {
                return (
                    <SpaceShipContrastIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else {
                return (
                    <SpaceShipIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            }
        } else if (this.props.world === 'Jungle') {
            if (this.props.theme === 'gray') {
                return (
                    <SafariJeepGrayIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else if (this.props.theme === 'contrast') {
                return (
                    <SafariJeepContrastIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else {
                return (
                    <SafariJeepIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            }
        } else if (this.props.world === 'DeepOcean'){
            if (this.props.theme === 'gray') {
                return (
                    <SubmarineGrayIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else if (this.props.theme === 'contrast') {
                return (
                    <SubmarineContrastIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            } else {
                return (
                    <SubmarineIcon
                        className='Character__icon'
                        x={-this.props.width/2}
                        y={-this.props.width/2}
                        width={this.props.width}
                        height={this.props.width} />
                );
            }
        } else {
            return (
                <RobotIcon
                    className='Character__icon'
                    x={-this.props.width/2}
                    y={-this.props.width/2}
                    width={this.props.width}
                    height={this.props.width} />
            )
        }
    }

    render() {
        return (
            <g
                className='Character'
                transform={this.props.transform}>
                {this.getThemedCharacter()}
            </g>
        );
    }
}
