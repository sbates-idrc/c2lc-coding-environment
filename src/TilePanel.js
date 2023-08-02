// @flow

import React from 'react';
import { getTileClassName, getTileImage, isTileName } from './TileData';
import type { TileName } from './TileData';
import './TilePanel.css';

type TilePanelProps = {
    onSelectTile: (tileName: TileName) => void
};

export default class TilePanel extends React.PureComponent<TilePanelProps, {}> {
    tileNames: Array<TileName>;

    constructor(props: TilePanelProps) {
        super(props);
        this.tileNames = [
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
        const tiles = [];

        for (const tileName of this.tileNames) {
            const tileImage = getTileImage(tileName);

            tiles.push(
                <div
                    className='TilePanel__tile'
                    data-tilename={tileName}
                    key={tileName}
                    onClick={this.handleClickTile}
                >
                    {tileImage == null ?
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
                        :
                        React.createElement(tileImage)
                    }
                </div>
            );
        }

        return (
            <div className='TilePanel'>
                {tiles}
            </div>
        );
    }
}
