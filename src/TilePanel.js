// @flow

import * as C2lcMath from './C2lcMath';
import classNames from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';
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
    tileRefs: Map<TileCode, HTMLElement>;

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
        this.tileRefs = new Map();
    }

    handleKeyDownTile = (event: KeyboardEvent) => {
        switch(event.key) {
            case 'ArrowRight':
            case 'ArrowDown': {
                event.preventDefault();
                event.stopPropagation();
                // $FlowFixMe: dataset
                const index = this.tileCodes.indexOf(event.currentTarget.dataset.tilecode);
                if (index !== -1) {
                    const newIndex = C2lcMath.wrap(
                        0,
                        this.tileCodes.length,
                        index + 1
                    );
                    const newTileCode = this.tileCodes[newIndex];
                    this.focusTile(newTileCode);
                    this.props.onSelectTile(newTileCode);
                }
                break;
            }
            case 'ArrowLeft':
            case 'ArrowUp': {
                event.preventDefault();
                event.stopPropagation();
                // $FlowFixMe: dataset
                const index = this.tileCodes.indexOf(event.currentTarget.dataset.tilecode);
                if (index !== -1) {
                    const newIndex = C2lcMath.wrap(
                        0,
                        this.tileCodes.length,
                        index - 1
                    );
                    const newTileCode = this.tileCodes[newIndex];
                    this.focusTile(newTileCode);
                    this.props.onSelectTile(newTileCode);
                }
                break;
            }
            default:
                break;
        }
    };

    handleClickTile = (event: MouseEvent) => {
        // $FlowFixMe: dataset
        const tileCode = event.currentTarget.dataset.tilecode;
        if (isTileCode(tileCode)) {
            this.props.onSelectTile(((tileCode: any): TileCode));
        }
    };

    setTileRef(tileCode: TileCode, element: ?HTMLElement) {
        if (element) {
            this.tileRefs.set(tileCode, element);
        }
    }

    focusTile(tileCode: TileCode) {
        const element = this.tileRefs.get(tileCode);
        if (element && element.focus) {
            element.focus();
        }
    }

    render() {
        const tiles = [];

        this.tileCodes.forEach((tileCode, i) => {
            const isSelected = (tileCode === this.props.selectedTile);

            const tabIndex = (
                isSelected
                || (i === 0 && (this.props.selectedTile == null
                    || !isTileCode(this.props.selectedTile)))
            ) ? 0 : -1;

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
                    role='radio'
                    data-tilecode={tileCode}
                    key={tileCode}
                    ref={ (element) => this.setTileRef(tileCode, element) }
                    tabIndex={tabIndex}
                    aria-label={ariaLabel}
                    aria-checked={isSelected}
                    onKeyDown={this.handleKeyDownTile}
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
        });

        return (
            <div
                className='TilePanel'
                role='radiogroup'
                aria-label={this.props.intl.formatMessage({ id: 'TilePanel.heading' })}
            >
                {tiles}
            </div>
        );
    }
}

export default injectIntl(TilePanel);
