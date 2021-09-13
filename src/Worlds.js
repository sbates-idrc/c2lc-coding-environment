// @flow

import type { WorldName } from './types';

import { ReactComponent as Space } from './svg/Space.svg';
import { ReactComponent as SpaceGray } from './svg/Space-gray.svg';
import { ReactComponent as SpaceContrast } from './svg/Space-contrast.svg';

import { ReactComponent as Jungle } from './svg/Jungle.svg';
import { ReactComponent as JungleGray } from './svg/Jungle-gray.svg';
import { ReactComponent as JungleContrast } from './svg/Jungle-contrast.svg';

import { ReactComponent as DeepOcean } from './svg/DeepOcean.svg';
import { ReactComponent as DeepOceanGray } from './svg/DeepOcean-gray.svg';
import { ReactComponent as DeepOceanContrast } from './svg/DeepOcean-contrast.svg';

export type WorldProperties = {
    background: any,
    backgroundGray: any,
    backgroundContrast: any
};

const worlds = {
    'DeepOcean': {
        background: DeepOcean,
        backgroundGray: DeepOceanGray,
        backgroundContrast: DeepOceanContrast,
        backgroundInfo: [
            [null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, 'DeepOcean.fishGroup', 'DeepOcean.fishGroup', null],
            [null, null, null, null, null, null, null, null, null, 'DeepOcean.fishGroup', 'DeepOcean.fishGroup', null],
            [null, 'DeepOcean.babyJellyfish', 'DeepOcean.jellyfish', null, null, null, 'DeepOcean.shark', 'DeepOcean.shark', null, null, 'DeepOcean.shark', 'DeepOcean.coral'],
            [null, 'DeepOcean.babyJellyfish', 'DeepOcean.jellyfish', null, 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.coral'],
            [null, null, null, null, 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', 'DeepOcean.shark', null, null, null, null],
            ['DeepOcean.fish', 'DeepOcean.coral', null, null, null, null, null, 'DeepOcean.treasure', 'DeepOcean.treasure', 'DeepOcean.treasure', null, null],
            ['DeepOcean.coral', 'DeepOcean.fish', null, null, null, null, null, 'DeepOcean.treasure', 'DeepOcean.treasure', 'DeepOcean.treasure', null, 'DeepOcean.fish']
        ]
    },
    'Jungle': {
        background: Jungle,
        backgroundGray: JungleGray,
        backgroundContrast: JungleContrast,
        backgroundInfo: [
            [null, null, null, null, null, null, 'Jungle.giraffe', null, null, 'Jungle.lion', null, null],
            [null, null, null, null, null, 'Jungle.giraffe', 'Jungle.babyGiraffe', null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null],
            ['Jungle.tree', 'Jungle.tree', 'Jungle.tree', null, 'Jungle.bush', 'Jungle.bush', null, null, null, null, 'Jungle.tree', 'Jungle.tree'],
            ['Jungle.tree', 'Jungle.tree', null, null, null, null, null, 'Jungle.flamingo', null, null, null, null],
            [null, null, null, null, 'Jungle.babyAlligator', 'Jungle.babyAlligator', 'Jungle.pond', 'Jungle.flamingo', 'Jungle.pond', 'Jungle.hipo', 'Jungle.hipo', null],
            [null, null, 'Jungle.alligator', 'Jungle.alligator', 'Jungle.alligator', 'Jungle.alligator', 'Jungle.pond', 'Jungle.pond', 'Jungle.pond', 'Jungle.pond', 'Jungle.bush', 'Jungle.bush'],
            ['Jungle.bush', 'Jungle.bush', null, null, null, null, null, null, null, 'Jungle.bush', 'Jungle.bush', 'Jungle.bush']
        ]
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        backgroundInfo: null
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast,
        backgroundInfo: [
            ['Space.earth', null, 'Space.moon', null, null, 'Space.meteor', null, null, null, null, null, 'Space.aliens'],
            ['Space.earth', 'Space.earth', null, null, null, null, null, 'Space.saturn', 'Space.saturn', 'Space.saturn', null, null],
            ['Space.earth', null, null, null, null, 'Space.asteroid', 'Space.asteroid', null, 'Space.saturn', 'Space.saturn', null, 'Space.star'],
            [null, 'Space.meteor', null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, 'Space.asteroid', 'Space.asteroid', null],
            [null, null, null, 'Space.mars', null, null, 'Space.meteor', null, null, null, null, null],
            ['Space.asteroid', 'Space.asteroid', null, null, null, null, null, null, 'Space.satellite', null, null, null],
            [null, null, null, null, 'Space.star', null, null, null, null, null, null, null]
        ]
    }
};

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}

export function getBackgroundInfo(world: WorldName, xPos: number, yPos: number): ?string {
    const worldBackgroundInfo = worlds[world].backgroundInfo;
    if (worldBackgroundInfo) {
        return worldBackgroundInfo[yPos][xPos];
    }
    return null;
}
