// @flow

import type {WorldName} from './types';

const backgroundInfo = {
    'Jungle' : [
        [null, null, null, null, null, null, 'Jungle.giraffe', null, null, 'Jungle.lion', null, null],
        [null, null, null, null, null, 'Jungle.giraffe', 'Jungle.babyGiraffe', null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        ['Jungle.tree', 'Jungle.tree', 'Jungle.tree', null, 'Jungle.bush', 'Jungle.bush', null, null, null, null, 'Jungle.tree', 'Jungle.tree'],
        ['Jungle.tree', 'Jungle.tree', null, null, null, null, null, 'Jungle.flamingo', null, null, null, null],
        [null, null, null, null, 'Jungle.babyAlligator', 'Jungle.babyAlligator', 'Jungle.pond', 'Jungle.flamingo', 'Jungle.pond', 'Jungle.hipo', 'Jungle.hipo', null],
        [null, null, 'Jungle.alligator', 'Jungle.alligator', 'Jungle.alligator', 'Jungle.alligator', 'Jungle.pond', 'Jungle.pond', 'Jungle.pond', 'Jungle.pond', 'Jungle.bush', 'Jungle.bush'],
        ['Jungle.bush', 'Jungle.bush', null, null, null, null, null, null, null, 'Jungle.bush', 'Jungle.bush', 'Jungle.bush']
    ],
    'Space' : [
        ['Space.earth', null, 'Space.moon', null, null, 'Space.meteor', null, null, null, null, null, 'Space.aliens'],
        ['Space.earth', 'Space.earth', null, null, null, null, null, 'Space.saturn', 'Space.saturn', 'Space.saturn', null, null],
        ['Space.earth', null, null, null, null, 'Space.asteroid', 'Space.asteroid', null, 'Space.saturn', 'Space.saturn', null, 'Space.star'],
        [null, 'Space.meteor', null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, 'Space.asteroid', 'Space.asteroid', null],
        [null, null, null, 'Space.mars', null, null, 'Space.meteor', null, null, null, null, null],
        ['Space.asteroid', 'Space.asteroid', null, null, null, null, null, null, 'Space.satellite', null, null, null],
        [null, null, null, null, 'Space.star', null, null, null, null, null, null, null]
    ],
    'DeepOcean' : [
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, 'DeepOcean.fishGroup', 'DeepOcean.fishGroup', null],
        [null, null, null, null, null, null, null, null, null, 'DeepOcean.fishGroup', 'DeepOcean.fishGroup', null],
        [null, 'DeepOcean.babyJellyfish', 'DeepOcean.jellyfish', null, null, null, 'DeepOcean.shark', 'DeepOcean.shark', null, null, 'DeepOcean.shark', 'DeepOcean.coral'],
        [null, 'DeepOcean.babyJellyfish', 'DeepOcean.jellyfish', null, 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.coral'],
        [null, null, null, null, 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', null, null, null, null],
        ['DeepOcean.fish', 'DeepOcean.coral', null, null, null, null, null, 'DeepOcean.treasure', 'DeepOcean.treasure', 'DeepOcean.treasure', null, null],
        ['DeepOcean.coral', 'DeepOcean.fish', null, null, null, null, null, 'DeepOcean.treasure', 'DeepOcean.treasure', 'DeepOcean.treasure', null, 'DeepOcean.fish']
    ],
    // Include Sketchpad to make flow check to pass
    'Sketchpad': undefined
};

function getBackgroundInfo(world: WorldName, xPos: number, yPos: number): ?string {
    const worldBackground = backgroundInfo[world];
    if (worldBackground) {
        return worldBackground[yPos][xPos];
    }
    return null;
}

export { getBackgroundInfo };
