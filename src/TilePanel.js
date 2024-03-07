// @flow

import classNames from 'classnames';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { getTileColor, getTileImage, getTileName, isTileCode } from './TileData';
import type { TileCode } from './TileData';
import type { ThemeName } from './types';
import './TilePanel.scss';

type TilePanelProps = {
    intl: IntlShape,
    selectedTile: ?TileCode,
    theme: ThemeName,
    onSelectTile: (tileCode: TileCode) => void
};

class TilePanel extends React.PureComponent<TilePanelProps, {}> {
    tileCodes: Array<TileCode>;

    constructor(props: TilePanelProps) {
        super(props);
        this.tileCodes = [
            '0',
            '1',
            'E',
            'F',
            'G',
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
        this.selectTile(e.currentTarget);
    };

    handleMouseDownTile = (e: any) => {
        this.selectTile(e.currentTarget);
    };

    selectTile(element: any) {
        const tileCode = element.dataset.tilecode;
        if (isTileCode(tileCode)) {
            this.props.onSelectTile(((tileCode: any): TileCode));
        }
    }

    render() {
        const tiles = [];

        for (const tileCode of this.tileCodes) {
            const isSelected = (tileCode === this.props.selectedTile);

            const tileClassName = classNames(
                'TilePanel__tile',
                isSelected && 'TilePanel__tile--selected'
            );

            const tileImage = getTileImage(tileCode, this.props.theme);

            const ariaLabel = this.props.intl.formatMessage({
                id: `TileDescription.${getTileName(tileCode)}`
            });

            tiles.push(
                <button
                    className={tileClassName}
                    data-tilecode={tileCode}
                    key={tileCode}
                    aria-label={ariaLabel}
                    aria-pressed={isSelected}
                    onClick={this.handleClickTile}
                >
                    <div
                        className='TilePanel__tileInner'
                        style={{backgroundColor: getTileColor(tileCode, this.props.theme)}}
                    >
                        {tileImage != null &&
                            React.createElement(
                                tileImage,
                                {
                                    'aria-hidden': true
                                }
                            )
                        }
                    </div>
                </button>
            );
        }

        return (
            <div className='TilePanel'>
                <h2 className='sr-only'>
                    <FormattedMessage id='TilePanel.heading' />
                </h2>
                {tiles}
            </div>
        );
    }
}

export default injectIntl(TilePanel);
