// @flow

import type { ThemeName, WorldName } from './types';

let idCounter: number = 0;

/* istanbul ignore next */
function generateId(prefix: string): string {
    const id = `${prefix}-${idCounter}`;
    idCounter += 1;
    return id;
}

/* istanbul ignore next */
function makeDelayedPromise(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs);
    });
}

function generateEncodedProgramURL(versionString: string, themeString: string, worldString: string, programString: string, characterStateString: string, allowedActionsString: string): string {
    return `?v=${encodeURIComponent(versionString)}&t=${themeString}&w=${worldString}&p=${encodeURIComponent(programString)}&c=${encodeURIComponent(characterStateString)}&a=${encodeURIComponent(allowedActionsString)}`;
}


/*
    "mixed"    => A mixture of light and dark elements, with colour.
    "light"    => A light theme, with colour.
    "dark"     => A dark theme, with colour.
    "gray"     => A grayscale theme, without colour.
    "contrast" => A high-contrast black and white theme.
*/
function getThemeFromString(themeQuery: ?string, defaultThemeName: ThemeName): ThemeName {
    switch (themeQuery) {
        case('mixed'): return 'mixed';
        case('dark'): return 'dark';
        case('light'): return 'light';
        case('gray'): return 'gray';
        case('contrast'): return 'contrast';
        default: return defaultThemeName;
    }
}

function getWorldFromString(worldQuery: ?string, defaultWorldName: WorldName): WorldName {
    // TODO: Instead of listing the known worlds here, check with Worlds.js
    switch (worldQuery) {
        // Convert old world names to the new world names
        case('space'): return 'Space';
        case('forest'): return 'Jungle';
        // New world names
        case('Space'): return 'Space';
        case('Jungle'): return 'Jungle';
        case('DeepOcean'): return 'DeepOcean';
        default: return defaultWorldName;
    }
}

/**
 * A simplified pure JS equivalent of jQuery.extend that always performs a
 * "deep" merge.
 *
 * @param  {...Object} toMerge - One or more objects to be merged together from left to right.
 * @returns {Object} - The merged object.
 *
 */
function extend(...toMerge:Object) {
    const merged = {};
    for (const singleEntryToMerge of toMerge) {
        for (const [key, value] of Object.entries(singleEntryToMerge)) {
            if (typeof value === "object" && !Array.isArray(value) && (typeof merged[key] === "object" && !Array.isArray(merged[key]) && merged[key] !== null)) {
                merged[key] = extend(merged[key], value);
            }
            else {
                merged[key] = value;
            }
        }
    }
    return merged;
}


export { extend, generateId, makeDelayedPromise, generateEncodedProgramURL, getThemeFromString, getWorldFromString };
