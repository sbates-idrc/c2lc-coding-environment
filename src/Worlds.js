// @flow

import type { WorldName } from './types';

// DeepOcean
import { ReactComponent as DeepOcean } from './svg/DeepOcean.svg';
import { ReactComponent as DeepOceanGray } from './svg/DeepOcean-gray.svg';
import { ReactComponent as DeepOceanContrast } from './svg/DeepOcean-contrast.svg';
import { ReactComponent as DeepOceanThumbnail } from './svg/DeepOceanThumbnail.svg';
import { ReactComponent as DeepOceanThumbnailGray } from './svg/DeepOceanThumbnail-gray.svg';
import { ReactComponent as DeepOceanThumbnailContrast } from './svg/DeepOceanThumbnail-contrast.svg';

// Jungle
import { ReactComponent as Jungle } from './svg/Jungle.svg';
import { ReactComponent as JungleGray } from './svg/Jungle-gray.svg';
import { ReactComponent as JungleContrast } from './svg/Jungle-contrast.svg';
import { ReactComponent as JungleThumbnail } from './svg/JungleThumbnail.svg';
import { ReactComponent as JungleThumbnailGray } from './svg/JungleThumbnail-gray.svg';
import { ReactComponent as JungleThumbnailContrast } from './svg/JungleThumbnail-contrast.svg';

// Sketchpad
import { ReactComponent as SketchpadThumbnail } from './svg/SketchpadThumbnail.svg';

// Space
import { ReactComponent as Space } from './svg/Space.svg';
import { ReactComponent as SpaceGray } from './svg/Space-gray.svg';
import { ReactComponent as SpaceContrast } from './svg/Space-contrast.svg';
import { ReactComponent as SpaceThumbnail } from './svg/SpaceThumbnail.svg';
import { ReactComponent as SpaceThumbnailGray } from './svg/SpaceThumbnail-gray.svg';
import { ReactComponent as SpaceThumbnailContrast } from './svg/SpaceThumbnail-contrast.svg';

export type WorldProperties = {
    background: any,
    backgroundGray: any,
    backgroundContrast: any,
    thumbnail: any,
    thumbnailGray: any,
    thumbnailContrast: any
};

const worlds = {
    'DeepOcean': {
        background: DeepOcean,
        backgroundGray: DeepOceanGray,
        backgroundContrast: DeepOceanContrast,
        thumbnail: DeepOceanThumbnail,
        thumbnailGray: DeepOceanThumbnailGray,
        thumbnailContrast: DeepOceanThumbnailContrast
    },
    'Jungle': {
        background: Jungle,
        backgroundGray: JungleGray,
        backgroundContrast: JungleContrast,
        thumbnail: JungleThumbnail,
        thumbnailGray: JungleThumbnailGray,
        thumbnailContrast: JungleThumbnailContrast
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        thumbnail: SketchpadThumbnail,
        thumbnailGray: SketchpadThumbnail,
        thumbnailContrast: SketchpadThumbnail
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast,
        thumbnail: SpaceThumbnail,
        thumbnailGray: SpaceThumbnailGray,
        thumbnailContrast: SpaceThumbnailContrast
    }
};

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}
