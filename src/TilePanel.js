// @flow

import React from 'react';
import { getTileClassName, isTileName } from './TileData';
import type { TileName } from './TileData';
import './TilePanel.css';

type TilePanelProps = {
    onSelectTile: (tileName: TileName) => void
};

export default class TilePanel extends React.Component<TilePanelProps, {}> {
    tiles: Array<TileName>;

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
        const tileName = e.currentTarget.dataset.tilename;
        if (isTileName(tileName)) {
            this.props.onSelectTile(((tileName: any): TileName));
        }
    };

    render() {
        return (
            <div className='TilePanel'>
                {this.tiles.map(tileName => (
                    <div
                        className='TilePanel__tile'
                        data-tilename={tileName}
                        key={tileName}
                        onClick={this.handleClickTile}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 1 1'
                        >
                            <rect
                                className={getTileClassName(tileName)}
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
