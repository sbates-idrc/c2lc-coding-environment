// @flow

import { ReactComponent as BlankTile } from './svg/BlankTile.svg';
import { ReactComponent as WallTile } from './svg/WallTile.svg';
import * as React from 'react';

type TileProperties = {|
    className: ?string,
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
        className: null,
        isTransparent: true,
        isWall: false,
        image: BlankTile
    },
    '1': {
        // Wall
        className: 'Scene__custom-wall',
        isTransparent: false,
        isWall: true,
        image: WallTile
    },
    '2': {
        // White
        className: 'Scene__custom-white',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '3': {
        // Black
        className: 'Scene__custom-black',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '4': {
        // Grey
        className: 'Scene__custom-grey',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '5': {
        // Dark blue
        className: 'Scene__custom-dark-blue',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '6': {
        // Light blue
        className: 'Scene__custom-light-blue',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '7': {
        // Green
        className: 'Scene__custom-green',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '8': {
        // Yellow
        className: 'Scene__custom-yellow',
        isTransparent: false,
        isWall: false,
        image: null
    },
    '9': {
        // Orange
        className: 'Scene__custom-orange',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'A': {
        // Red
        className: 'Scene__custom-red',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'B': {
        // Pink
        className: 'Scene__custom-pink',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'C': {
        // Purple
        className: 'Scene__custom-purple',
        isTransparent: false,
        isWall: false,
        image: null
    },
    'D': {
        // Brown
        className: 'Scene__custom-brown',
        isTransparent: false,
        isWall: false,
        image: null
    }
};

export type TileName = $Keys<typeof tiles>;

export function isTileName(str: ?string): boolean {
    return tiles.hasOwnProperty(str);
}

export function getTileClassName(tileName: TileName): ?string {
    return tiles[tileName].className;
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
