// @flow

import CharacterState from './CharacterState';
import SceneDimensions from './SceneDimensions';
import { encodeCoordinate, decodeCoordinate } from './Utils';

export default class CharacterStateSerializer {
    sceneDimensions: SceneDimensions;

    constructor(sceneDimensions: SceneDimensions) {
        this.sceneDimensions = sceneDimensions;
    }
    serialize(characterState: CharacterState): string {
        let pathParam = '' +
            encodeCoordinate(characterState.xPos) +
            encodeCoordinate(characterState.yPos) +
            this.encodeDirection(characterState.direction);
        for ( const pathSegment of characterState.path ) {
            const { x1, x2, y1, y2 } = pathSegment;
            pathParam +=
                encodeCoordinate(x1) +
                encodeCoordinate(y1) +
                encodeCoordinate(x2) +
                encodeCoordinate(y2);
        }
        return pathParam;
    }

    deserialize(text: string): CharacterState {
        const xPos = decodeCoordinate(text.charAt(0));
        const yPos = decodeCoordinate(text.charAt(1));
        const direction = this.decodeDirection(text.charAt(2));
        const path = [];
        // Split path segment part of the text every 4 characters
        const encodedPathSegments = text.substring(3).match(/.{4}/g);
        if (encodedPathSegments != null) {
            for ( const pathSegment of encodedPathSegments ) {
                const x1 = decodeCoordinate(pathSegment.charAt(0));
                const y1 = decodeCoordinate(pathSegment.charAt(1));
                const x2 = decodeCoordinate(pathSegment.charAt(2));
                const y2 = decodeCoordinate(pathSegment.charAt(3));
                path.push({ x1, y1, x2, y2 });
            }
        }
        return new CharacterState(xPos, yPos, direction, path, this.sceneDimensions);
    }

    encodeDirection(direction: number): string {
        switch(direction) {
            case(0): return '0';
            case(1): return 'a';
            case(2): return 'b';
            case(3): return 'c';
            case(4): return 'd';
            case(5): return 'e';
            case(6): return 'f';
            case(7): return 'g';
            default: throw new Error(`Unrecognized direction ${direction}`);
        }
    }

    decodeDirection(character: string): number {
        switch(character) {
            case('0'): return 0;
            case('a'): return 1;
            case('b'): return 2;
            case('c'): return 3;
            case('d'): return 4;
            case('e'): return 5;
            case('f'): return 6;
            case('g'): return 7;
            default: throw new Error(`Unrecognized direction character ${character}`);
        }
    }
};
