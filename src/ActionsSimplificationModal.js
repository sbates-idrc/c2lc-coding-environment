// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import type {IntlShape} from 'react-intl';
import ModalWithFooter from './ModalWithFooter';

import ActionsMenuItem from './ActionsMenuItem';
import ProgramSequence from './ProgramSequence';

import type {ActionToggleRegister, CommandName} from './types';
import ModalHeader from './ModalHeader';
import {extend} from './Utils';
import {ReactComponent as SimplificationIcon} from './svg/Simplification.svg'

import './ActionsSimplificationModal.scss';

type ActionsSimplificationModalProps = {
    intl: IntlShape,
    onCancel: () => void,
    onConfirm: (allowedActions: ActionToggleRegister) => void,
    // TODO: Flesh this definition out.
    menuItems: {},
    programSequence: ProgramSequence,
    allowedActions: ActionToggleRegister,
    show: boolean
};

type ActionsSimplificationModalState = {
    allowedActions: ActionToggleRegister
}

class ActionsSimplificationModal extends React.Component<ActionsSimplificationModalProps, ActionsSimplificationModalState> {
    static defaultProps = {
        menuItems: {
            forward1: {
                isAllowed: true,
                labelKey: "Command.forward1"
            },
            forward2: {
                isAllowed: true,
                labelKey: "Command.forward2"
            },
            forward3: {
                isAllowed: true,
                labelKey: "Command.forward3"
            },
            backward1: {
                isAllowed: true,
                labelKey: "Command.backward1"
            },
            backward2: {
                isAllowed: true,
                labelKey: "Command.backward2"
            },
            backward3: {
                isAllowed: true,
                labelKey: "Command.backward3"
            },
            left45: {
                isAllowed: true,
                labelKey: "Command.left45"
            },
            left90: {
                isAllowed: true,
                labelKey: "Command.left90"
            },
            left180: {
                isAllowed: true,
                labelKey: "Command.left180"
            },
            right45: {
                isAllowed: true,
                labelKey: "Command.right45"
            },
            right90: {
                isAllowed: true,
                labelKey: "Command.right90"
            },
            right180: {
                isAllowed: true,
                labelKey: "Command.right180"
            }
        }
    }

    constructor(props: ActionsSimplificationModalProps) {
        super(props);
        this.state = {
            allowedActions: this.props.allowedActions
        }
    }

    render() {
        const cancelButtonProperties = {
            label: this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.cancel'} ),
            isPrimary: false,
            onClick: this.handleClickCancel
        };
        const saveButtonProperties = {
            id: 'ActionSimplificationModal-done',
            isPrimary: true,
            label: this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.save'},),
            onClick: this.saveChanges
        };
        return (
            <ModalWithFooter
                show={this.props.show}
                focusOnOpenSelector={'#actions-menu-item-forward1'}
                focusOnCloseSelector={'.App__ActionsMenu__toggle-button'}
                onClose={this.props.onCancel}
                buttonProperties={[cancelButtonProperties, saveButtonProperties]}
            >
                <ModalHeader
                    id='ActionsSimplificationModal'
                    title={this.props.intl.formatMessage({ id: 'ActionsSimplificationModal.title'})}
                >
                    <SimplificationIcon aria-hidden='true'/>
                </ModalHeader>

                {this.generateMenu()}
            </ModalWithFooter>

        );
    }

    handleClickCancel = () => {
        this.setState({
            allowedActions: this.props.allowedActions
        });
        this.props.onCancel();
    }

    saveChanges = () => {
        this.props.onConfirm(this.state.allowedActions);
    }

    toggleSingleItem = (itemKey: string) => {
        this.setState((prevState) => {
            const newAllowedActions = extend({}, prevState.allowedActions);
            newAllowedActions[itemKey] = !(newAllowedActions[itemKey])
            return { allowedActions: newAllowedActions};
        });
    }

    generateMenu = () => {
        const actionsMenuItems = [];
        // TODO: Discuss how to evolve this into a deeper structure when we add groups and things other than actions.
        Object.keys(this.props.menuItems).forEach((itemKey: CommandName) => {
            const isAllowed: boolean = !!this.state.allowedActions[itemKey];
            const isUsed: boolean = this.props.programSequence.usesAction(itemKey);
            const itemChangeHandler = () => {
                this.toggleSingleItem(itemKey);
            };
            actionsMenuItems.push(
                <ActionsMenuItem
                    intl={this.props.intl}
                    isAllowed={isAllowed}
                    isUsed={isUsed}
                    itemKey={itemKey}
                    key={itemKey}
                    onChange={itemChangeHandler}
                />
            );
        });

        return (<React.Fragment>
            <div
                id="ActionsSimplificationModal"
                className="ActionsSimplificationModal__menu"
            >
                {actionsMenuItems}
            </div>
        </React.Fragment>);
    }

    // Required to avoid a phantom state where we persist the defaults even after they are updated from local storage.
    componentDidUpdate (prevProps: ActionsSimplificationModalProps) {
        if (prevProps.allowedActions !== this.props.allowedActions) {
            this.setState({
                allowedActions: this.props.allowedActions
            });
        }
    }
}

export default injectIntl(ActionsSimplificationModal);
