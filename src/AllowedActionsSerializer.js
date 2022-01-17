// @flow
/*

    We use the same conventions as the program to store a register of "allowed actions" in the URL, so that the choices
    made in the "simplification" menu are persisted.
*/
import type { ActionToggleRegister } from './types';

export default class AllowedActionsSerializer {

    serialize(actionToggleRegister: ActionToggleRegister): string {
        let serializedAllowedActions = '';
        for (const [actionKey, isAllowed] of Object.entries(actionToggleRegister)) {
            if (isAllowed) {
                switch (actionKey) {
                    case ('forward1') :
                        serializedAllowedActions += '1';
                        break;
                    case ('forward2') :
                        serializedAllowedActions += '2';
                        break;
                    case ('forward3') :
                        serializedAllowedActions += '3';
                        break;
                    case ('backward1') :
                        serializedAllowedActions += '4';
                        break;
                    case ('backward2') :
                        serializedAllowedActions += '5';
                        break;
                    case ('backward3') :
                        serializedAllowedActions += '6';
                        break;
                    case ('left45') :
                        serializedAllowedActions += 'A';
                        break;
                    case ('left90') :
                        serializedAllowedActions += 'B';
                        break;
                    case ('left180') :
                        serializedAllowedActions += 'D';
                        break;
                    case ('right45') :
                        serializedAllowedActions += 'a';
                        break;
                    case ('right90') :
                        serializedAllowedActions += 'b';
                        break;
                    case ('right180') :
                        serializedAllowedActions += 'd';
                        break;
                    default:
                        throw new Error(`Unrecognized actionKey when serializing actionKey: ${actionKey}`);
                }
            }
        }
        return serializedAllowedActions;
    }

    deserialize(allowedActionsText: string): ActionToggleRegister {
        const actionToggleRegister = {};
        for (let i=0; i<allowedActionsText.length; i++) {
            switch(allowedActionsText.charAt(i)) {
                case '1':
                    actionToggleRegister['forward1'] = true;
                    break;
                case '2':
                    actionToggleRegister['forward2'] = true;
                    break;
                case '3':
                    actionToggleRegister['forward3'] = true;
                    break;
                case '4':
                    actionToggleRegister['backward1'] = true;
                    break;
                case '5':
                    actionToggleRegister['backward2'] = true;
                    break;
                case '6':
                    actionToggleRegister['backward3'] = true;
                    break;
                case 'A':
                    actionToggleRegister['left45'] = true;
                    break;
                case 'B':
                    actionToggleRegister['left90'] = true;
                    break;
                case 'D':
                    actionToggleRegister['left180'] = true;
                    break;
                case 'a':
                    actionToggleRegister['right45'] = true;
                    break;
                case 'b':
                    actionToggleRegister['right90'] = true;
                    break;
                case 'd':
                    actionToggleRegister['right180'] = true;
                    break;
                default:
                    throw new Error(`Unrecognized allowedActions text when deserialize text: ${allowedActionsText.charAt(i)}`);
            }
        }
        return actionToggleRegister;
    }
}