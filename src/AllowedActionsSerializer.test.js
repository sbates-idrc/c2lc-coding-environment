// @flow
// These are just a rudimentary sanity check of the AllowedActionsSerializer, the underlying serializer is tested in
// depth elsewhere.
import AllowedActionsSerializer from './AllowedActionsSerializer';

test("Serialize allowed actions", () => {
    const serializer = new AllowedActionsSerializer();

    expect(serializer.serialize({})).toStrictEqual('');
    expect(serializer.serialize({ forward1: true })).toStrictEqual('1');
    expect(serializer.serialize({ forward2: true})).toStrictEqual('2');
    expect(serializer.serialize({ forward3: true})).toStrictEqual('3');
    expect(serializer.serialize({ backward1: true})).toStrictEqual('4');
    expect(serializer.serialize({ backward2: true})).toStrictEqual('5');
    expect(serializer.serialize({ backward3: true})).toStrictEqual('6');
    expect(serializer.serialize({ left45: true})).toStrictEqual('A');
    expect(serializer.serialize({ left90: true})).toStrictEqual('B');
    expect(serializer.serialize({ left180: true})).toStrictEqual('D');
    expect(serializer.serialize({ right45: true})).toStrictEqual('a');
    expect(serializer.serialize({ right90: true})).toStrictEqual('b');
    expect(serializer.serialize({ right180: true})).toStrictEqual('d');
    expect(serializer.serialize({
        forward1: false,
        forward2: true,
        forward3: false,
        backward1: true,
        backward2: false,
        backward3: true,
        left45: false,
        left90: true,
        left180: false,
        right45: true,
        right90: false,
        right180: true
    })).toStrictEqual('246Bad');
});

test('Serializing an unsupported actionKey should throw an Error', () => {
    expect(() => {
        (new AllowedActionsSerializer()).serialize({ unknownCommand: true });
    }).toThrowError(/^Unrecognized actionKey when serializing actionKey: unknownCommand$/);
});

test("Deserialize allowed actions.", () => {
    const serializer = new AllowedActionsSerializer();
    expect(serializer.deserialize('')).toStrictEqual({});
    expect(serializer.deserialize('1')).toStrictEqual({ forward1: true });
    expect(serializer.deserialize('2')).toStrictEqual({ forward2: true });
    expect(serializer.deserialize('3')).toStrictEqual({ forward3: true });
    expect(serializer.deserialize('4')).toStrictEqual({ backward1: true });
    expect(serializer.deserialize('5')).toStrictEqual({ backward2: true });
    expect(serializer.deserialize('6')).toStrictEqual({ backward3: true });
    expect(serializer.deserialize('A')).toStrictEqual({ left45: true });
    expect(serializer.deserialize('B')).toStrictEqual({ left90: true });
    expect(serializer.deserialize('D')).toStrictEqual({ left180: true });
    expect(serializer.deserialize('a')).toStrictEqual({ right45: true });
    expect(serializer.deserialize('b')).toStrictEqual({ right90: true });
    expect(serializer.deserialize('d')).toStrictEqual({ right180: true });
    expect(serializer.deserialize('123456ABDabd')).toStrictEqual({
        forward1: true,
        forward2: true,
        forward3: true,
        backward1: true,
        backward2: true,
        backward3: true,
        left45: true,
        left90: true,
        left180: true,
        right45: true,
        right90: true,
        right180: true
    })
});

test('Deserializing an unsupported actionKey should throw an Error', () => {
    expect(() => {
        (new AllowedActionsSerializer()).deserialize('9');
    }).toThrowError(/^Unrecognized allowedActions text when deserialize text: 9$/);
});
