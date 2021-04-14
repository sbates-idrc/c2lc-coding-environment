// @flow
/*

    We use the same conventions as the program to store a register of "allowed actions" in the URL, so that the choices
    made in the "simplification" menu are persisted.
*/
import type {ActionToggleRegister, Program} from './types';
import ProgramSerializer from './ProgramSerializer';

export default class AllowedActionsSerializer {
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

    deserialize(allowedActionsText: string): ActionToggleRegister {
        const program = this.programSerializer.deserialize(allowedActionsText);
        const actionToggleRegister = {};
        program.forEach((allowedActionKey) => {
            actionToggleRegister[allowedActionKey] = true;
        });
        return actionToggleRegister;
    }
}