// @flow

type TileProperties = {|
    className: ?string,
    isTransparent: boolean,
    isWall: boolean
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
        isWall: false
    },
    '1': {
        // Wall
        className: 'Scene__custom-wall',
        isTransparent: false,
        isWall: true
    },
    '2': {
        // White
        className: 'Scene__custom-white',
        isTransparent: false,
        isWall: false
    },
    '3': {
        // Black
        className: 'Scene__custom-black',
        isTransparent: false,
        isWall: false
    },
    '4': {
        // Grey
        className: 'Scene__custom-grey',
        isTransparent: false,
        isWall: false
    },
    '5': {
        // Dark blue
        className: 'Scene__custom-dark-blue',
        isTransparent: false,
        isWall: false
    },
    '6': {
        // Light blue
        className: 'Scene__custom-light-blue',
        isTransparent: false,
        isWall: false
    },
    '7': {
        // Green
        className: 'Scene__custom-green',
        isTransparent: false,
        isWall: false
    },
    '8': {
        // Yellow
        className: 'Scene__custom-yellow',
        isTransparent: false,
        isWall: false
    },
    '9': {
        // Orange
        className: 'Scene__custom-orange',
        isTransparent: false,
        isWall: false
    },
    'A': {
        // Red
        className: 'Scene__custom-red',
        isTransparent: false,
        isWall: false
    },
    'B': {
        // Pink
        className: 'Scene__custom-pink',
        isTransparent: false,
        isWall: false
    },
    'C': {
        // Purple
        className: 'Scene__custom-purple',
        isTransparent: false,
        isWall: false
    },
    'D': {
        // Brown
        className: 'Scene__custom-brown',
        isTransparent: false,
        isWall: false
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
