// @flow

import { getTileClassName, isTile } from './CustomBackground';
import type { Tile } from './CustomBackground';
import React from 'react';
import './TilePanel.css';

type TilePanelProps = {
    onSelectTile: (tile: Tile) => void
};

export default class TilePanel extends React.Component<TilePanelProps, {}> {
    tiles: Array<Tile>;

    constructor(props: TilePanelProps) {
        super(props);
        this.tiles = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'A',
            'B',
            'C',
            'D'
        ];
    }

    handleClickTile = (e: any) => {
        const tile = e.currentTarget.dataset.tile;
        if (isTile(tile)) {
            this.props.onSelectTile(((tile: any): Tile));
        }
    };

    render() {
        return (
            <div className='TilePanel'>
                {this.tiles.map(tile => (
                    <div
                        className='TilePanel__tile'
                        data-tile={tile}
                        onClick={this.handleClickTile}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 1 1'
                        >
                            <rect
                                className={getTileClassName(tile)}
                                x={0}
                                y={0}
                                width={1}
                                height={1}
                            />
                        </svg>
                    </div>
                ))}
            </div>
        );
    }
}
