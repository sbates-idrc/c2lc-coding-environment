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
        backgroundContrast: DeepOceanContrast
    },
    'Jungle': {
        background: Jungle,
        backgroundGray: JungleGray,
        backgroundContrast: JungleContrast
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast
    }
};

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}
