// @flow

import * as React from 'react';
import type { ThemeName } from './types';

// Amusement Park
import { ReactComponent as AmusementPark } from './svg/AmusementPark.svg';
import { ReactComponent as AmusementParkGray } from './svg/AmusementParkGray.svg';
import { ReactComponent as AmusementParkContrast } from './svg/AmusementParkContrast.svg';
import { ReactComponent as AmusementParkThumbnail } from './svg/AmusementParkThumbnail.svg';
import { ReactComponent as AmusementParkThumbnailGray } from './svg/AmusementParkThumbnailGray.svg';
import { ReactComponent as AmusementParkThumbnailContrast } from './svg/AmusementParkThumbnailContrast.svg';
import { ReactComponent as AmusementParkTicket } from './svg/AmusementParkTicket.svg';
import { ReactComponent as AmusementParkTicketGray } from './svg/AmusementParkTicketGray.svg';
import { ReactComponent as AmusementParkTicketContrast } from './svg/AmusementParkTicketContrast.svg';

// Camping
import { ReactComponent as Camping } from './svg/Camping.svg';
import { ReactComponent as CampingGray } from './svg/Camping-gray.svg';
import { ReactComponent as CampingContrast } from './svg/Camping-contrast.svg';
import { ReactComponent as CampingThumbnail } from './svg/CampingThumbnail.svg';
import { ReactComponent as CampingThumbnailGray } from './svg/CampingThumbnail-gray.svg';
import { ReactComponent as CampingThumbnailContrast } from './svg/CampingThumbnail-contrast.svg';
import { ReactComponent as Squirrel } from './svg/Squirrel.svg';
import { ReactComponent as SquirrelGray } from './svg/Squirrel-gray.svg';
import { ReactComponent as SquirrelContrast } from './svg/Squirrel-contrast.svg';

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

// Haunted House
import { ReactComponent as Haunted } from './svg/Haunted.svg';
import { ReactComponent as HauntedGray } from './svg/Haunted-gray.svg';
import { ReactComponent as HauntedContrast } from './svg/Haunted-contrast.svg';
import { ReactComponent as HauntedThumbnail } from './svg/HauntedThumbnail.svg';
import { ReactComponent as HauntedThumbnailGray } from './svg/HauntedThumbnail-gray.svg';
import { ReactComponent as HauntedThumbnailContrast } from './svg/HauntedThumbnail-contrast.svg';
import { ReactComponent as Candle } from './svg/Candle.svg';
import { ReactComponent as CandleGray } from './svg/Candle-gray.svg';
import { ReactComponent as CandleContrast } from './svg/Candle-contrast.svg';

// Landmarks
import { ReactComponent as LandmarksWorld } from './svg/LandmarksWorld.svg';
import { ReactComponent as LandmarksWorldGray } from './svg/LandmarksWorldGray.svg';
import { ReactComponent as LandmarksWorldContrast } from './svg/LandmarksWorldContrast.svg';
import { ReactComponent as LandmarksThumbnail } from './svg/LandmarksThumbnail.svg';
import { ReactComponent as LandmarksThumbnailGray } from './svg/LandmarksThumbnailGray.svg';
import { ReactComponent as LandmarksThumbnailContrast } from './svg/LandmarksThumbnailContrast.svg';
import { ReactComponent as Bot } from './svg/Bot.svg';
import { ReactComponent as BotGray } from './svg/BotGray.svg';
import { ReactComponent as BotContrast } from './svg/BotContrast.svg';

// Marble
import { ReactComponent as MarbleWorld } from './svg/MarbleWorld.svg';
import { ReactComponent as MarbleWorldGray } from './svg/MarbleWorldGray.svg';
import { ReactComponent as MarbleWorldContrast } from './svg/MarbleWorldContrast.svg';
import { ReactComponent as MarbleThumbnail } from './svg/MarbleThumbnail.svg';
import { ReactComponent as MarbleThumbnailGray } from './svg/MarbleThumbnailGray.svg';
import { ReactComponent as MarbleThumbnailContrast } from './svg/MarbleThumbnailContrast.svg';
import { ReactComponent as Marble } from './svg/Marble.svg';
import { ReactComponent as MarbleGray } from './svg/MarbleGray.svg';
import { ReactComponent as MarbleContrast } from './svg/MarbleContrast.svg';

// Savannah
import { ReactComponent as Savannah } from './svg/Savannah.svg';
import { ReactComponent as SavannahGray } from './svg/Savannah-gray.svg';
import { ReactComponent as SavannahContrast } from './svg/Savannah-contrast.svg';
import { ReactComponent as SavannahThumbnail } from './svg/SavannahThumbnail.svg';
import { ReactComponent as SavannahThumbnailGray } from './svg/SavannahThumbnail-gray.svg';
import { ReactComponent as SavannahThumbnailContrast } from './svg/SavannahThumbnail-contrast.svg';
import { ReactComponent as SavannahJeep } from './svg/SavannahJeep.svg';
import { ReactComponent as SavannahJeepGray } from './svg/SavannahJeep-gray.svg';
import { ReactComponent as SavannahJeepContrast } from './svg/SavannahJeep-contrast.svg';

// Sketchpad
import { ReactComponent as SketchpadThumbnail } from './svg/SketchpadThumbnail.svg';
import { ReactComponent as SketchpadThumbnailDark } from './svg/SketchpadThumbnail-dark.svg';
import { ReactComponent as SketchpadThumbnailGray } from './svg/SketchpadThumbnail-gray.svg';
import { ReactComponent as SketchpadThumbnailContrast } from './svg/SketchpadThumbnail-contrast.svg';
import { ReactComponent as Robot } from './svg/Robot.svg';
import { ReactComponent as RobotGray } from './svg/RobotGray.svg';
import { ReactComponent as RobotContrast } from './svg/RobotContrast.svg';

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

export type WorldProperties = {|
    background: ?React.ComponentType<{}>,
    backgroundGray: ?React.ComponentType<{}>,
    backgroundContrast: ?React.ComponentType<{}>,
    backgroundInfo: ?{ [string]: string },
    thumbnail: React.ComponentType<{}>,
    thumbnailDark: React.ComponentType<{}>,
    thumbnailGray: React.ComponentType<{}>,
    thumbnailContrast: React.ComponentType<{}>,
    character: React.ComponentType<{}>,
    characterGray: React.ComponentType<{}>,
    characterContrast: React.ComponentType<{}>,
    startingX: number,
    startingY: number,
    startingDirection: number,
    enableFlipCharacter: boolean
|};

const worlds: {|
    'AmusementPark': WorldProperties,
    'Camping': WorldProperties,
    'DeepOcean': WorldProperties,
    'Haunted': WorldProperties,
    'Landmarks': WorldProperties,
    'Marble': WorldProperties,
    'Savannah': WorldProperties,
    'Sketchpad': WorldProperties,
    'Space': WorldProperties
|} = {
    'AmusementPark': {
        background: AmusementPark,
        backgroundGray: AmusementParkGray,
        backgroundContrast: AmusementParkContrast,
        backgroundInfo: {
            A1: 'entrance',
            C1: 'gameBooth',
            D1: 'gameBooth',
            G1: 'pirateShip',
            H1: 'pirateShip',
            J1: 'swingRide',
            K1: 'swingRide',
            L1: 'swingRide',
            A2: 'entrance',
            C2: 'gameBooth',
            D2: 'gameBooth',
            G2: 'pirateShip',
            H2: 'pirateShip',
            J2: 'swingRide',
            K2: 'swingRide',
            L2: 'swingRide',
            A3: 'merryGoRound',
            B3: 'merryGoRound',
            G3: 'pirateShip',
            H3: 'pirateShip',
            A4: 'merryGoRound',
            B4: 'merryGoRound',
            E4: 'waterSlide',
            F4: 'waterSlide',
            J4: 'goKart',
            K4: 'goKart',
            L4: 'goKart',
            E5: 'waterSlide',
            F5: 'waterSlide',
            G5: 'ferrisWheel',
            H5: 'ferrisWheel',
            I5: 'ferrisWheel',
            J5: 'goKart',
            K5: 'goKart',
            L5: 'goKart',
            A6: 'rollerCoaster',
            B6: 'rollerCoaster',
            D6: 'waterPark',
            E6: 'waterPark',
            F6: 'whaleFountain',
            G6: 'ferrisWheel',
            H6: 'ferrisWheel',
            I6: 'ferrisWheel',
            J6: 'goKart',
            K6: 'goKart',
            A7: 'rollerCoaster',
            B7: 'rollerCoaster',
            C7: 'rollerCoaster',
            G7: 'ferrisWheel',
            H7: 'ferrisWheel',
            I7: 'ferrisWheel',
            K7: 'snackStand',
            L7: 'snackStand',
            A8: 'rollerCoaster',
            B8: 'rollerCoaster',
            C8: 'rollerCoaster',
            D8: 'rollerCoaster',
            K8: 'snackStand',
            L8: 'snackStand'
        },
        thumbnail: AmusementParkThumbnail,
        thumbnailDark: AmusementParkThumbnail,
        thumbnailGray: AmusementParkThumbnailGray,
        thumbnailContrast: AmusementParkThumbnailContrast,
        character: AmusementParkTicket,
        characterGray: AmusementParkTicketGray,
        characterContrast: AmusementParkTicketContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Camping': {
        background: Camping,
        backgroundGray: CampingGray,
        backgroundContrast: CampingContrast,
        backgroundInfo: {
            A1: 'trunk',
            B1: 'trunk',
            A2: 'trunk',
            B2: 'trunk',
            C2: 'branch',
            D2: 'branch',
            E2: 'branch',
            F2: 'branch',
            G2: 'branch',
            H2: 'branch',
            I2: 'ladder',
            J2: 'branch',
            A3: 'trunk',
            B3: 'trunk',
            I3: 'ladder',
            A4: 'trunk',
            B4: 'trunk',
            C4: 'bear',
            D4: 'bear',
            E4: 'lake',
            F4: 'lake',
            G4: 'lake',
            H4: 'lake',
            I4: 'ladder',
            J4: 'lake',
            A5: 'trunk',
            B5: 'bear',
            C5: 'bear',
            D5: 'bear',
            F5: 'fire',
            G5: 'fire',
            H5: 'fire',
            I5: 'ladder',
            K5: 'tentdoor',
            A6: 'trunk',
            B6: 'bear',
            C6: 'bear',
            D6: 'bear',
            E6: 'bear',
            F6: 'fire',
            G6: 'fire',
            H6: 'fire',
            I6: 'ladder',
            K6: 'tentdoor',
            A7: 'trunk',
            B7: 'trunk',
            C7: 'bear',
            D7: 'bear',
            E7: 'bear',
            F7: 'fire',
            G7: 'fire',
            H7: 'fire',
            I7: 'ladder',
            K7: 'tentdoor',
            L7: 'tentdoor',
            A8: 'trunk',
            B8: 'trunk',
            D8: 'bear',
            E8: 'bear',
            K8: 'tentdoor',
            L8: 'tentdoor'
        },
        thumbnail: CampingThumbnail,
        thumbnailDark: CampingThumbnail,
        thumbnailGray: CampingThumbnailGray,
        thumbnailContrast: CampingThumbnailContrast,
        character: Squirrel,
        characterGray: SquirrelGray,
        characterContrast: SquirrelContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'DeepOcean': {
        background: DeepOcean,
        backgroundGray: DeepOceanGray,
        backgroundContrast: DeepOceanContrast,
        backgroundInfo: {
            J2: 'fishGroup',
            K2: 'fishGroup',
            J3: 'fishGroup',
            K3: 'fishGroup',
            B4: 'babyJellyfish',
            C4: 'jellyfish',
            G4: 'shark',
            H4: 'shark',
            K4: 'shark',
            L4: 'coral',
            B5: 'babyJellyfish',
            C5: 'jellyfish',
            E5: 'shark',
            F5: 'shark',
            G5: 'shark',
            H5: 'shark',
            I5: 'shark',
            J5: 'shark',
            K5: 'shark',
            L5: 'coral',
            F6: 'shark',
            G6: 'shark',
            H6: 'shark',
            I6: 'shark',
            A7: 'fish',
            B7: 'coral',
            G7: 'treasure',
            H7: 'treasure',
            I7: 'treasure',
            A8: 'coral',
            B8: 'fish',
            G8: 'treasure',
            H8: 'treasure',
            I8: 'treasure'
        },
        thumbnail: DeepOceanThumbnail,
        thumbnailDark: DeepOceanThumbnail,
        thumbnailGray: DeepOceanThumbnailGray,
        thumbnailContrast: DeepOceanThumbnailContrast,
        character: Submarine,
        characterGray: SubmarineGray,
        characterContrast: SubmarineContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Haunted': {
        background: Haunted,
        backgroundGray: HauntedGray,
        backgroundContrast: HauntedContrast,
        backgroundInfo: {
            C1: 'painting',
            D1: 'painting',
            E1: 'painting',
            F1: 'deerSkull',
            G1: 'deerSkull',
            H1: 'painting',
            I1: 'painting',
            J1: 'painting',
            A2: 'stairs',
            B2: 'stairs',
            D2: 'painting',
            E2: 'painting',
            F2: 'painting',
            G2: 'painting',
            H2: 'painting',
            I2: 'painting',
            J2: 'mirror',
            A3: 'stairs',
            B3: 'stairs',
            C3: 'stairs',
            J3: 'mirror',
            A4: 'shelf',
            B4: 'shelf',
            C4: 'stairs',
            D4: 'stairs',
            E4: 'stairs',
            F4: 'stairs',
            G4: 'stairs',
            H4: 'stairs',
            A5: 'shelf',
            B5: 'shelf',
            C5: 'shelf',
            D5: 'stairs',
            E5: 'stairs',
            F5: 'stairs',
            G5: 'stairs',
            H5: 'stairs',
            I5: 'stairs',
            J5: 'stairs',
            K5: 'stairs',
            A6: 'shelf',
            B6: 'shelf',
            C6: 'shelf',
            E6: 'fireplace',
            F6: 'fireplace',
            G6: 'fireplace',
            H6: 'chair',
            I6: 'stairs',
            J6: 'stairs',
            K6: 'stairs',
            L6: 'stairs',
            A7: 'shelf',
            B7: 'shelf',
            C7: 'shelf',
            E7: 'fireplace',
            F7: 'fireplace',
            G7: 'fireplace',
            H7: 'chair',
            I7: 'stairs',
            J7: 'stairs',
            K7: 'stairs',
            L7: 'stairs',
            A8: 'shelf',
            B8: 'shelf',
            C8: 'shelf',
            J8: 'stairs',
            K8: 'stairs',
            L8: 'stairs'
        },
        thumbnail: HauntedThumbnail,
        thumbnailDark: HauntedThumbnail,
        thumbnailGray: HauntedThumbnailGray,
        thumbnailContrast: HauntedThumbnailContrast,
        character: Candle,
        characterGray: CandleGray,
        characterContrast: CandleContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Landmarks': {
        background: LandmarksWorld,
        backgroundGray: LandmarksWorldGray,
        backgroundContrast: LandmarksWorldContrast,
        backgroundInfo : {
            A1: 'plane',
            A4: 'easterIsland',
            A6: 'leaningTowerPisa',
            B3: 'greatSphinx',
            B8: 'stonehenge',
            C2: 'greatPyramid',
            C7: 'eiffelTower',
            D5: 'fairyChimneys',
            E2: 'colosseum',
            E7: 'tajMahal',
            F4: 'burAlArab',
            F8: 'statueLiberty',
            G1: 'floatingMarket',
            G6: 'greatWall',
            H3: 'windmill',
            H5: 'cnTower',
            I2: 'tableMountain',
            I8: 'tokyoTower',
            J4: 'niagaraFalls',
            J6: 'grandCanyon',
            K3: 'bigBen',
            K7: 'operaHouse',
            L1: 'machuPicchu',
            L5: 'stBasils',
            L8: 'train'
        },
        thumbnail: LandmarksThumbnail,
        thumbnailDark: LandmarksThumbnail,
        thumbnailGray: LandmarksThumbnailGray,
        thumbnailContrast: LandmarksThumbnailContrast,
        character: Bot,
        characterGray: BotGray,
        characterContrast: BotContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: false
    },
    'Marble': {
        background: MarbleWorld,
        backgroundGray: MarbleWorldGray,
        backgroundContrast: MarbleWorldContrast,
        backgroundInfo : {
            A1: 'bricks',
            B1: 'bricks',
            C1: 'bricks',
            E1: 'bricks',
            F1: 'bricks',
            G1: 'bricks',
            H1: 'bricks',
            I1: 'bricks',
            J1: 'bricks',
            K1: 'bricks',
            I2: 'bricks',
            J2: 'bricks',
            A3: 'bricks',
            C3: 'bricks',
            E3: 'bricks',
            F3: 'bricks',
            J3: 'bricks',
            L3: 'bricks',
            A4: 'bricks',
            C4: 'bricks',
            J4: 'bricks',
            L4: 'bricks',
            A5: 'bricks',
            C5: 'bricks',
            G5: 'bricks',
            H5: 'bricks',
            I5: 'bricks',
            J5: 'bricks',
            L5: 'bricks',
            A6: 'bricks',
            C6: 'bricks',
            D6: 'bricks',
            G6: 'bricks',
            H6: 'bricks',
            I6: 'bricks',
            J6: 'bricks',
            L6: 'bricks',
            A7: 'bricks',
            E7: 'bricks',
            L7: 'bricks',
            A8: 'bricks',
            B8: 'bricks',
            E8: 'bricks',
            F8: 'bricks',
            G8: 'bricks',
            H8: 'bricks',
            I8: 'bricks',
            K8: 'bricks',
            L8: 'bricks'
        },
        thumbnail: MarbleThumbnail,
        thumbnailDark: MarbleThumbnail,
        thumbnailGray: MarbleThumbnailGray,
        thumbnailContrast: MarbleThumbnailContrast,
        character: Marble,
        characterGray: MarbleGray,
        characterContrast: MarbleContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: false
    },
    'Savannah': {
        background: Savannah,
        backgroundGray: SavannahGray,
        backgroundContrast: SavannahContrast,
        backgroundInfo: {
            G1: 'giraffe',
            J1: 'lion',
            F2: 'giraffe',
            G2: 'babyGiraffe',
            A4: 'tree',
            B4: 'tree',
            C4: 'tree',
            E4: 'bush',
            F4: 'bush',
            K4: 'tree',
            L4: 'tree',
            A5: 'tree',
            B5: 'tree',
            H5: 'flamingo',
            E6: 'babyAlligator',
            F6: 'babyAlligator',
            G6: 'pond',
            H6: 'flamingo',
            I6: 'pond',
            J6: 'hippo',
            K6: 'hippo',
            C7: 'alligator',
            D7: 'alligator',
            E7: 'alligator',
            F7: 'alligator',
            G7: 'pond',
            H7: 'pond',
            I7: 'pond',
            J7: 'pond',
            A8: 'bush',
            B8: 'bush',
            L8: 'bush'
        },
        thumbnail: SavannahThumbnail,
        thumbnailDark: SavannahThumbnail,
        thumbnailGray: SavannahThumbnailGray,
        thumbnailContrast: SavannahThumbnailContrast,
        character: SavannahJeep,
        characterGray: SavannahJeepGray,
        characterContrast: SavannahJeepContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Sketchpad': {
        background: null,
        backgroundGray: null,
        backgroundContrast: null,
        backgroundInfo: null,
        thumbnail: SketchpadThumbnail,
        thumbnailDark: SketchpadThumbnailDark,
        thumbnailGray: SketchpadThumbnailGray,
        thumbnailContrast: SketchpadThumbnailContrast,
        character: Robot,
        characterGray: RobotGray,
        characterContrast: RobotContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    },
    'Space': {
        background: Space,
        backgroundGray: SpaceGray,
        backgroundContrast: SpaceContrast,
        backgroundInfo: {
            A1: 'earth',
            C1: 'moon',
            F1: 'meteor',
            L1: 'aliens',
            A2: 'earth',
            B2: 'earth',
            H2: 'saturn',
            I2: 'saturn',
            J2: 'saturn',
            A3: 'earth',
            F3: 'asteroid',
            G3: 'asteroid',
            I3: 'saturn',
            J3: 'saturn',
            L3: 'star',
            B4: 'meteor',
            I5: 'asteroid',
            J5: 'asteroid',
            D6: 'mars',
            G6: 'meteor',
            A7: 'asteroid',
            B7: 'asteroid',
            I7: 'satellite',
            E8: 'star'
        },
        thumbnail: SpaceThumbnail,
        thumbnailDark: SpaceThumbnail,
        thumbnailGray: SpaceThumbnailGray,
        thumbnailContrast: SpaceThumbnailContrast,
        character: SpaceShip,
        characterGray: SpaceShipGray,
        characterContrast: SpaceShipContrast,
        startingX: 1,
        startingY: 2,
        startingDirection: 2, // East
        enableFlipCharacter: true
    }
};

export type WorldName = $Keys<typeof worlds>;

export function isWorldName(str: ?string): boolean {
    return worlds.hasOwnProperty(str);
}

export function getWorldProperties(world: WorldName): WorldProperties {
    return worlds[world];
}

export function getBackgroundInfo(world: WorldName, columnLabel: string, rowLabel: string): ?string {
    const worldBackgroundInfo = worlds[world].backgroundInfo;
    if (worldBackgroundInfo) {
        const cellKey = columnLabel + rowLabel;
        if (worldBackgroundInfo.hasOwnProperty(cellKey)) {
            return worldBackgroundInfo[cellKey];
        } else {
            return null;
        }
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

export function getWorldThumbnail(theme: ThemeName, world: WorldName): React.ComponentType<{}> {
    const worldProperties = worlds[world];
    if (theme === 'gray') {
        return worldProperties.thumbnailGray;
    } else if (theme === 'contrast') {
        return worldProperties.thumbnailContrast;
    } else if (theme === 'dark') {
        return worldProperties.thumbnailDark;
    } else {
        return worldProperties.thumbnail;
    }
}
