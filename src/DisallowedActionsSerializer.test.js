// @flow
// These are just a rudimentary sanity check of the DisallowedActionsSerializer,
// the underlying serializer is tested in depth elsewhere.
import DisallowedActionsSerializer from './DisallowedActionsSerializer';

test("Serialize disallowed actions", () => {
    const serializer = new DisallowedActionsSerializer();

    expect(serializer.serialize({})).toStrictEqual('');
    expect(serializer.serialize({ forward1: true })).toStrictEqual('1');
    expect(serializer.serialize({ forward2: false})).toStrictEqual('');
});

test("Deserialize disallowed actions.", () => {
    const serializer = new DisallowedActionsSerializer();
    expect(serializer.deserialize('')).toStrictEqual({});
    expect(serializer.deserialize('2')).toStrictEqual({ forward2: true });
});
