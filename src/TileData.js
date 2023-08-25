// @flow

import { ReactComponent as BlankTile } from './svg/BlankTile.svg';
import { ReactComponent as WallTile } from './svg/WallTile.svg';
import * as React from 'react';

type TileProperties = {|
    name: string,
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
        name: 'transparent',
        color: 'transparent',
        isTransparent: true,
        isWall: false,
        image: BlankTile
    },
    '1': {
        name: 'wall',
        color: '#F5C58A',
        isTransparent: false,
        isWall: true,
        image: WallTile
    },
    '2': {
        name: 'white',
        color: '#FFFFFF',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '3': {
        name: 'black',
        color: '#1E1E1E',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '4': {
        name: 'grey',
        color: '#C4C4C4',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '5': {
        name: 'darkBlue',
        color: '#416CA7',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '6': {
        name: 'lightBlue',
        color: '#5CBCD1',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '7': {
        name: 'green',
        color: '#52BD76',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '8': {
        name: 'yellow',
        color: '#F1D05B',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '9': {
        name: 'orange',
        color: '#FF9900',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'A': {
        name: 'red',
        color: '#F75322',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'B': {
        name: 'pink',
        color: '#F387C8',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'C': {
        name: 'purple',
        color: '#AA70C7',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'D': {
        name: 'brown',
        color: '#775034',
        isTransparent: false,
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

export function getTileColor(tileCode: TileCode): string {
    return tiles[tileCode].color;
}

export function isTransparent(tileCode: TileCode): boolean {
    return tiles[tileCode].isTransparent;
}

export function isWall(tileCode: TileCode): boolean {
    return tiles[tileCode].isWall;
}

export function getTileImage(tileCode: TileCode): ?React.ComponentType<{}> {
    return tiles[tileCode].image;
}
