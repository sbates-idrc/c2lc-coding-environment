// @flow

import * as React from 'react';
import type { ThemeName } from './types';

import { ReactComponent as BlankTile } from './svg/BlankTile.svg';
import { ReactComponent as WallTile } from './svg/WallTile.svg';

type TileProperties = {|
    name: string,
    colorDefault: string,
    colorGray: string,
    colorContrast: string,
    isNone: boolean,
    isWall: boolean,
    image: ?React.ComponentType<{}>
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
|} = {
    '0': {
        name: 'none',
        colorDefault: 'transparent',
        colorGray: 'transparent',
        colorContrast: 'transparent',
        isNone: true,
        isWall: false,
        image: BlankTile
    },
    '1': {
        name: 'wall',
        colorDefault: '#F5C58A',
        colorGray: 'transparent', // TODO
        colorContrast: 'transparent', // TODO
        isNone: false,
        isWall: true,
        image: WallTile
    },
    '2': {
        name: 'white',
        colorDefault: '#FFFFFF',
        colorGray: '#FFFFFF',
        colorContrast: '#FFFFFF',
        isNone: false,
        isWall: false,
        image: null
    },
    '3': {
        name: 'black',
        colorDefault: '#1E1E1E',
        colorGray: '#505862',
        colorContrast: '#1E1E1E',
        isNone: false,
        isWall: false,
        image: null
    },
    '4': {
        name: 'grey',
        colorDefault: '#9DA4AF',
        colorGray: '#B9BEC6',
        colorContrast: '#B4B4B4',
        isNone: false,
        isWall: false,
        image: null
    },
    '5': {
        name: 'darkBlue',
        colorDefault: '#416CA7',
        colorGray: '#7B93B5',
        colorContrast: '#0000FF',
        isNone: false,
        isWall: false,
        image: null
    },
    '6': {
        name: 'lightBlue',
        colorDefault: '#5CBCD1',
        colorGray: '#B1D2DA',
        colorContrast: '#00F0FF',
        isNone: false,
        isWall: false,
        image: null
    },
    '7': {
        name: 'green',
        colorDefault: '#52BD76',
        colorGray: '#A0C2AC',
        colorContrast: '#00FF57',
        isNone: false,
        isWall: false,
        image: null
    },
    '8': {
        name: 'yellow',
        colorDefault: '#F1D05B',
        colorGray: '#E9DDB5',
        colorContrast: '#FFF500',
        isNone: false,
        isWall: false,
        image: null
    },
    '9': {
        name: 'orange',
        colorDefault: '#ED972C',
        colorGray: '#DCC09D',
        colorContrast: '#FFA500',
        isNone: false,
        isWall: false,
        image: null
    },
    'A': {
        name: 'red',
        colorDefault: '#F75322',
        colorGray: '#E6B09F',
        colorContrast: '#FF3A00',
        isNone: false,
        isWall: false,
        image: null
    },
    'B': {
        name: 'pink',
        colorDefault: '#DF86CB',
        colorGray: '#DCC6D7',
        colorContrast: '#FF00C5',
        isNone: false,
        isWall: false,
        image: null
    },
    'C': {
        name: 'purple',
        colorDefault: '#A46BB8',
        colorGray: '#AB93B4',
        colorContrast: '#AD00FF',
        isNone: false,
        isWall: false,
        image: null
    },
    'D': {
        name: 'brown',
        colorDefault: '#775034',
        colorGray: '#A48E7F',
        colorContrast: '#B5651D',
        isNone: false,
        isWall: false,
        image: null
    }
};

export type TileCode = $Keys<typeof tiles>;

export function isTileCode(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export function getTileName(tileCode: TileCode): string {
    return tiles[tileCode].name;
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

export function isNone(tileCode: TileCode): boolean {
    return tiles[tileCode].isNone;
}

export function isWall(tileCode: TileCode): boolean {
    return tiles[tileCode].isWall;
}

export function getTileImage(tileCode: TileCode): ?React.ComponentType<{}> {
    return tiles[tileCode].image;
}
