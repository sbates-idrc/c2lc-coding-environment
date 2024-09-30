// @flow

import type {IntlShape} from 'react-intl';
import type {ProgramBlock} from './types';

type AnnouncementData = {|
    messageIdSuffix: string,
    values: any
|};

export default class AnnouncementBuilder {
    intl: IntlShape;

    constructor(intl: IntlShape) {
        this.intl = intl;
    }

    buildSelectActionAnnouncement(action: string): AnnouncementData {
        let actionType = null;
        if (action === 'loop') {
            actionType = this.intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            actionType = this.intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'actionSelected',
            values: {
                actionType,
                actionName: this.intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildAddStepAnnouncement(action: string): AnnouncementData {
        let actionType = null;
        if (action === 'loop') {
            actionType = this.intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            actionType = this.intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'add',
            values: {
                actionType,
                actionName: this.intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildDeleteStepAnnouncement(programBlock: ProgramBlock): AnnouncementData {
        if (programBlock.block === 'startLoop' || programBlock.block === 'endLoop') {
            return {
                messageIdSuffix: 'delete',
                values: {
                    actionType: this.intl.formatMessage({
                        id: "Announcement.control"
                    }),
                    actionName: this.intl.formatMessage(
                        {
                            id: `Announcement.${programBlock.block}`
                        },
                        {
                            loopLabel: programBlock.label
                        }
                    )
                }
            };
        } else {
            return {
                messageIdSuffix: 'delete',
                values: {
                    actionType: this.intl.formatMessage({
                        id: "Announcement.movement"
                    }),
                    actionName: this.intl.formatMessage(
                        {
                            id: `Announcement.${programBlock.block}`
                        }
                    )
                }
            };
        }
    }

    buildReplaceStepAnnouncement(programBlock: ProgramBlock,
        selectedAction: string): AnnouncementData {

        return {
            messageIdSuffix: 'replace',
            values: {
                oldActionName: this.intl.formatMessage({
                    id: `Announcement.${programBlock.block}`
                }),
                newActionName: this.intl.formatMessage({
                    id: `Announcement.${selectedAction}`
                })
            }
        };
    }
};
