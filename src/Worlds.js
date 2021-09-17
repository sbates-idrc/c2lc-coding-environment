// @flow

import * as React from 'react';
import type { ThemeName } from './types';

// DeepOcean
import { ReactComponent as DeepOcean } from './svg/DeepOcean.svg';
import { ReactComponent as DeepOceanGray } from './svg/DeepOcean-gray.svg';
import { ReactComponent as DeepOceanContrast } from './svg/DeepOcean-contrast.svg';
import { ReactComponent as DeepOceanThumbnail } from './svg/DeepOceanThumbnail.svg';
import { ReactComponent as DeepOceanThumbnailGray } from './svg/DeepOceanThumbnail-gray.svg';
import { ReactComponent as DeepOceanThumbnailContrast } from './svg/DeepOceanThumbnail-contrast.svg';
import { ReactComponent as Submarine } from './svg/Submarine.svg';
import { ReactComponent as SubmarineGray } from './svg/Submarine-gray.svg';
import { ReactComponent as SubmarineContrast } from './svg/Submarine-contrast.svg';

// Jungle
import { ReactComponent as Jungle } from './svg/Jungle.svg';
import { ReactComponent as JungleGray } from './svg/Jungle-gray.svg';
import { ReactComponent as JungleContrast } from './svg/Jungle-contrast.svg';
import { ReactComponent as JungleThumbnail } from './svg/JungleThumbnail.svg';
import { ReactComponent as JungleThumbnailGray } from './svg/JungleThumbnail-gray.svg';
import { ReactComponent as JungleThumbnailContrast } from './svg/JungleThumbnail-contrast.svg';
import { ReactComponent as SafariJeep } from './svg/SafariJeep.svg';
import { ReactComponent as SafariJeepGray } from './svg/SafariJeep-gray.svg';
import { ReactComponent as SafariJeepContrast } from './svg/SafariJeep-contrast.svg';

// Sketchpad
import { ReactComponent as SketchpadThumbnail } from './svg/SketchpadThumbnail.svg';
import { ReactComponent as Robot } from './svg/Robot.svg';

// Space
import { ReactComponent as Space } from './svg/Space.svg';
import { ReactComponent as SpaceGray } from './svg/Space-gray.svg';
import { ReactComponent as SpaceContrast } from './svg/Space-contrast.svg';
import { ReactComponent as SpaceThumbnail } from './svg/SpaceThumbnail.svg';
import { ReactComponent as SpaceThumbnailGray } from './svg/SpaceThumbnail-gray.svg';
import { ReactComponent as SpaceThumbnailContrast } from './svg/SpaceThumbnail-contrast.svg';
import { ReactComponent as SpaceShip } from './svg/SpaceShip.svg';
import { ReactComponent as SpaceShipGray } from './svg/SpaceShip-gray.svg';
import { ReactComponent as SpaceShipContrast } from './svg/SpaceShip-contrast.svg';

export type WorldProperties = {
    background: ?React.ComponentType<{}>,
    backgroundGray: ?React.ComponentType<{}>,
    backgroundContrast: ?React.ComponentType<{}>,
    thumbnail: React.ComponentType<{}>,
    thumbnailGray: React.ComponentType<{}>,
    thumbnailContrast: React.ComponentType<{}>,
    character: React.ComponentType<{}>
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
        ],
        thumbnail: DeepOceanThumbnail,
        thumbnailGray: DeepOceanThumbnailGray,
        thumbnailContrast: DeepOceanThumbnailContrast,
        character: Submarine,
        characterGray: SubmarineGray,
        characterContrast: SubmarineContrast
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
        ],
        thumbnail: JungleThumbnail,
        thumbnailGray: JungleThumbnailGray,
        thumbnailContrast: JungleThumbnailContrast,
        character: SafariJeep,
        characterGray: SafariJeepGray,
        characterContrast: SafariJeepContrast
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        backgroundInfo: null,
        thumbnail: SketchpadThumbnail,
        thumbnailGray: SketchpadThumbnail,
        thumbnailContrast: SketchpadThumbnail,
        character: Robot,
        characterGray: Robot,
        characterContrast: Robot
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
        ],
        thumbnail: SpaceThumbnail,
        thumbnailGray: SpaceThumbnailGray,
        thumbnailContrast: SpaceThumbnailContrast,
        character: SpaceShip,
        characterGray: SpaceShipGray,
        characterContrast: SpaceShipContrast
    }
};

export type WorldName = $Keys<typeof worlds>;

export function isWorldName(str: ?string): boolean {
    return worlds.hasOwnProperty(str);
}

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}

export function getBackgroundInfo(world: WorldName, yPos: number, xPos: number): ?string {
    const worldBackgroundInfo = worlds[world].backgroundInfo;
    if (worldBackgroundInfo) {
        return worldBackgroundInfo[yPos][xPos];
    }
    return null;
}

export function getWorldCharacter(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.characterGray;
    } else if (theme === 'contrast') {
        return worldProperties.characterContrast;
    } else {
        return worldProperties.character;
    }
}
