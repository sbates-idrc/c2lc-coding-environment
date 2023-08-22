// @flow

import classNames from 'classnames';
import React from 'react';
import { getTileColor, getTileImage, isTileName } from './TileData';
import type { TileName } from './TileData';
import './TilePanel.scss';

type TilePanelProps = {
    selectedTile: ?TileName,
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
            const tileClassName = classNames(
                'TilePanel__tile',
                (tileName === this.props.selectedTile)
                    && 'TilePanel__tile--selected'
            );

            const tileImage = getTileImage(tileName);

            tiles.push(
                <button
                    className={tileClassName}
                    data-tilename={tileName}
                    key={tileName}
                    onClick={this.handleClickTile}
                >
                    <div
                        className='TilePanel__tileInner'
                        style={{backgroundColor: getTileColor(tileName)}}
                    >
                        {tileImage != null &&
                            React.createElement(tileImage)
                        }
                    </div>
                </button>
            );
        }

        return (
            <div className='TilePanel'>
                {tiles}
            </div>
        );
    }
}
