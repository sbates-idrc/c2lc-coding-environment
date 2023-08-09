// @flow

import { ReactComponent as BlankTile } from './svg/BlankTile.svg';
import { ReactComponent as WallTile } from './svg/WallTile.svg';
import * as React from 'react';

type TileProperties = {|
    color: string,
    isTransparent: boolean,
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
        // Transparent
        color: 'transparent',
        isTransparent: true,
        isWall: false,
        image: BlankTile
    },
    '1': {
        // Wall
        color: '#F5C58A',
        isTransparent: false,
        isWall: true,
        image: WallTile
    },
    '2': {
        // White
        color: '#FFFFFF',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '3': {
        // Black
        color: '#1E1E1E',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '4': {
        // Grey
        color: '#C4C4C4',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '5': {
        // Dark blue
        color: '#416CA7',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '6': {
        // Light blue
        color: '#5CBCD1',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '7': {
        // Green
        color: '#52BD76',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '8': {
        // Yellow
        color: '#F1D05B',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '9': {
        // Orange
        color: '#FF9900',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'A': {
        // Red
        color: '#F75322',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'B': {
        // Pink
        color: '#F387C8',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'C': {
        // Purple
        color: '#AA70C7',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'D': {
        // Brown
        color: '#775034',
        isTransparent: false,
        isWall: false,
        image: null
    }
};

export type TileName = $Keys<typeof tiles>;

export function isTileName(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export function getTileColor(tileName: TileName): string {
    return tiles[tileName].color;
}

export function isTransparent(tileName: TileName): boolean {
    return tiles[tileName].isTransparent;
}

export function isWall(tileName: TileName): boolean {
    return tiles[tileName].isWall;
}

export function getTileImage(tileName: TileName): ?React.ComponentType<{}> {
    return tiles[tileName].image;
}
