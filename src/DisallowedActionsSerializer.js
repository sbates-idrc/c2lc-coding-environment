// @flow
/*

    We use the same conventions as the program to store a register of "allowed actions" in the URL, so that the choices
    made in the "simplification" menu are persisted.
*/
import type {ActionToggleRegister, Program} from './types';
import ProgramSerializer from './ProgramSerializer';

export default class DisallowedActionsSerializer {
    programSerializer: ProgramSerializer;

    constructor() {
        this.programSerializer = new ProgramSerializer();
    }

    serialize(actionToggleRegister: ActionToggleRegister): string {
        const registerAsProgram: Program = [];
        for (const [actionKey, isAllowed] of Object.entries(actionToggleRegister)) {
            if (isAllowed) {
                registerAsProgram.push(actionKey);
            }
        }
        return this.programSerializer.serialize(registerAsProgram);
    }

    deserialize(disallowedActionsText: string): ActionToggleRegister {
        const program = this.programSerializer.deserialize(disallowedActionsText);
        const actionToggleRegister = {};
        program.forEach((disallowedActionKey) => {
            actionToggleRegister[disallowedActionKey] = true;
        });
        return actionToggleRegister;
    }
}