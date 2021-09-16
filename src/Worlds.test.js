import { getWorldCharacter, getWorldProperties, isWorldName } from './Worlds';

test('isWorldName', () => {
    expect.assertions(6);
    expect(isWorldName('DeepOcean')).toBe(true);
    expect(isWorldName('Jungle')).toBe(true);
    expect(isWorldName('Sketchpad')).toBe(true)
    expect(isWorldName('Space')).toBe(true);
    expect(isWorldName('worldX')).toBe(false);
    expect(isWorldName('')).toBe(false);
});

test('getWorldProperties', () => {
    expect.assertions(5);
    expect(getWorldProperties('DeepOcean')).not.toBeUndefined();
    expect(getWorldProperties('Jungle')).not.toBeUndefined();
    expect(getWorldProperties('Sketchpad')).not.toBeUndefined();
    expect(getWorldProperties('Space')).not.toBeUndefined();
    expect(getWorldProperties('worldX')).toBeUndefined();
});

test('getWorldCharacter', () => {
    expect.assertions(14);
    // Sketchpad world character
    expect(getWorldCharacter('light', 'Sketchpad').type.render().props.children).toBe('Robot.svg');
    expect(getWorldCharacter('gray', 'Sketchpad').type.render().props.children).toBe('Robot.svg');
    expect(getWorldCharacter('contrast', 'Sketchpad').type.render().props.children).toBe('Robot.svg');
    // DeepOcean world character
    expect(getWorldCharacter('light', 'DeepOcean').type.render().props.children).toBe('Submarine.svg');
    expect(getWorldCharacter('gray', 'DeepOcean').type.render().props.children).toBe('Submarine-gray.svg');
    expect(getWorldCharacter('contrast', 'DeepOcean').type.render().props.children).toBe('Submarine-contrast.svg');
    // Jungle world character
    expect(getWorldCharacter('light', 'Jungle').type.render().props.children).toBe('SafariJeep.svg');
    expect(getWorldCharacter('gray', 'Jungle').type.render().props.children).toBe('SafariJeep-gray.svg');
    expect(getWorldCharacter('contrast', 'Jungle').type.render().props.children).toBe('SafariJeep-contrast.svg');
    // Space world character
    expect(getWorldCharacter('light', 'Space').type.render().props.children).toBe('SpaceShip.svg');
    expect(getWorldCharacter('gray', 'Space').type.render().props.children).toBe('SpaceShip-gray.svg');
    expect(getWorldCharacter('contrast', 'Space').type.render().props.children).toBe('SpaceShip-contrast.svg');
    // getWorldCharacter API also takes additional properties
    expect(getWorldCharacter('contrast', 'Sketchpad', {width: 10}).props.width).toBe(10);
    expect(getWorldCharacter('contrast', 'Sketchpad', {x: 5}).props.x).toBe(5);
});
