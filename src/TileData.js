// @flow

import * as React from 'react';
import type { ThemeName } from './types';

import { ReactComponent as EraserTileBlack } from './svg/EraserTileBlack.svg';
import { ReactComponent as EraserTileWhite } from './svg/EraserTileWhite.svg';
import { ReactComponent as GemTileContrast } from './svg/GemTileContrast.svg';
import { ReactComponent as GemTileDefault } from './svg/GemTileDefault.svg';
import { ReactComponent as GemTileGray } from './svg/GemTileGray.svg';
import { ReactComponent as GoldTileContrast } from './svg/GoldTileContrast.svg';
import { ReactComponent as GoldTileDefault } from './svg/GoldTileDefault.svg';
import { ReactComponent as GoldTileGray } from './svg/GoldTileGray.svg';
import { ReactComponent as TreatsTileContrast } from './svg/TreatsTileContrast.svg';
import { ReactComponent as TreatsTileDefault } from './svg/TreatsTileDefault.svg';
import { ReactComponent as TreatsTileGray } from './svg/TreatsTileGray.svg';
import { ReactComponent as WallTileContrast } from './svg/WallTileContrast.svg';
import { ReactComponent as WallTileDefault } from './svg/WallTileDefault.svg';
import { ReactComponent as WallTileGray } from './svg/WallTileGray.svg';

type TileProperties = {|
    name: string,
    colorDefault: string,
    colorGray: string,
    colorContrast: string,
    imageDefault: ?React.ComponentType<{}>,
    imageGray: ?React.ComponentType<{}>,
    imageContrast: ?React.ComponentType<{}>
|};

const tiles: {|
    '0': TileProperties,
    '1': TileProperties,
    '2': TileProperties,
    '3': TileProperties,
    '4': TileProperties,
    '5': TileProperties,
    '6': TileProperties,
    '7': TileProperties,
    '8': TileProperties,
    '9': TileProperties,
    'A': TileProperties,
    'B': TileProperties,
    'C': TileProperties,
    'D': TileProperties,
    'E': TileProperties,
    'F': TileProperties,
    'G': TileProperties
|} = {
    '0': {
        name: 'none',
        colorDefault: '#4C9990',
        colorGray: '#67717E',
        colorContrast: '#1E1E1E',
        imageDefault: EraserTileBlack,
        imageGray: EraserTileWhite,
        imageContrast: EraserTileWhite
    },
    '1': {
        name: 'wall',
        colorDefault: '#F5C58A',
        colorGray: '#F1F2F4',
        colorContrast: '#FFFFFF',
        imageDefault: WallTileDefault,
        imageGray: WallTileGray,
        imageContrast: WallTileContrast
    },
    '2': {
        name: 'white',
        colorDefault: '#FFFFFF',
        colorGray: '#FFFFFF',
        colorContrast: '#FFFFFF',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '3': {
        name: 'black',
        colorDefault: '#1E1E1E',
        colorGray: '#505862',
        colorContrast: '#1E1E1E',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '4': {
        name: 'grey',
        colorDefault: '#9DA4AF',
        colorGray: '#B9BEC6',
        colorContrast: '#B4B4B4',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '5': {
        name: 'darkBlue',
        colorDefault: '#416CA7',
        colorGray: '#7B93B5',
        colorContrast: '#0000FF',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '6': {
        name: 'lightBlue',
        colorDefault: '#5CBCD1',
        colorGray: '#B1D2DA',
        colorContrast: '#00F0FF',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '7': {
        name: 'green',
        colorDefault: '#52BD76',
        colorGray: '#A0C2AC',
        colorContrast: '#00FF57',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '8': {
        name: 'yellow',
        colorDefault: '#F1D05B',
        colorGray: '#E9DDB5',
        colorContrast: '#FFF500',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    '9': {
        name: 'orange',
        colorDefault: '#ED972C',
        colorGray: '#DCC09D',
        colorContrast: '#FFA500',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    'A': {
        name: 'red',
        colorDefault: '#F75322',
        colorGray: '#E6B09F',
        colorContrast: '#FF3A00',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    'B': {
        name: 'pink',
        colorDefault: '#DF86CB',
        colorGray: '#DCC6D7',
        colorContrast: '#FF00C5',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    'C': {
        name: 'purple',
        colorDefault: '#A46BB8',
        colorGray: '#AB93B4',
        colorContrast: '#AD00FF',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    'D': {
        name: 'brown',
        colorDefault: '#775034',
        colorGray: '#A48E7F',
        colorContrast: '#B5651D',
        imageDefault: null,
        imageGray: null,
        imageContrast: null
    },
    'E': {
        name: 'gem',
        colorDefault: 'transparent',
        colorGray: 'transparent',
        colorContrast: 'transparent',
        imageDefault: GemTileDefault,
        imageGray: GemTileGray,
        imageContrast: GemTileContrast
    },
    'F': {
        name: 'gold',
        colorDefault: 'transparent',
        colorGray: 'transparent',
        colorContrast: 'transparent',
        imageDefault: GoldTileDefault,
        imageGray: GoldTileGray,
        imageContrast: GoldTileContrast
    },
    'G': {
        name: 'treats',
        colorDefault: 'transparent',
        colorGray: 'transparent',
        colorContrast: 'transparent',
        imageDefault: TreatsTileDefault,
        imageGray: TreatsTileGray,
        imageContrast: TreatsTileContrast
    }
};

export type TileCode = $Keys<typeof tiles>;

export function isTileCode(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export function getTileCodes(): Array<TileCode> {
    return Object.getOwnPropertyNames(tiles);
}

export function getTileName(tileCode: TileCode): string {
    return tiles[tileCode].name;
}

export function isNone(tileCode: TileCode): boolean {
    return tiles[tileCode].name === 'none';
}

export function isEraser(tileCode: TileCode): boolean {
    return isNone(tileCode);
}

export function isWall(tileCode: TileCode): boolean {
    return tiles[tileCode].name === 'wall';
}

export function getTileColor(tileCode: TileCode, theme: ThemeName): string {
    if (theme === 'gray') {
        return tiles[tileCode].colorGray;
    } else if (theme === 'contrast') {
        return tiles[tileCode].colorContrast;
    } else {
        return tiles[tileCode].colorDefault;
    }
}

export function getTileImage(tileCode: TileCode, theme: ThemeName): ?React.ComponentType<{}> {
    if (theme === 'gray') {
        return tiles[tileCode].imageGray;
    } else if (theme === 'contrast') {
        return tiles[tileCode].imageContrast;
    } else {
        return tiles[tileCode].imageDefault;
    }
}
