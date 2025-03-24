// @flow

import type {IntlShape} from 'react-intl';
import type {ProgramBlock} from './types';

type AnnouncementData = {|
    messageIdSuffix: string,
    values: any
|};

export default class AnnouncementBuilder {
    buildSelectActionAnnouncement(action: string, intl: IntlShape): AnnouncementData {
        let actionType = null;
        if (action === 'loop') {
            actionType = intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            actionType = intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'actionSelected',
            values: {
                actionType,
                actionName: intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildAddStepAnnouncement(action: string, intl: IntlShape): AnnouncementData {
        let actionType = null;
        if (action === 'loop') {
            actionType = intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            actionType = intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'add',
            values: {
                actionType,
                actionName: intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildDeleteStepAnnouncement(programBlock: ProgramBlock, intl: IntlShape): AnnouncementData {
        if (programBlock.block === 'startLoop' || programBlock.block === 'endLoop') {
            return {
                messageIdSuffix: 'delete',
                values: {
                    actionType: intl.formatMessage({
                        id: "Announcement.control"
                    }),
                    actionName: intl.formatMessage(
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
                    actionType: intl.formatMessage({
                        id: "Announcement.movement"
                    }),
                    actionName: intl.formatMessage(
                        {
                            id: `Announcement.${programBlock.block}`
                        }
                    )
                }
            };
        }
    }

    buildReplaceStepAnnouncement(programBlock: ProgramBlock,
        selectedAction: string, intl: IntlShape): AnnouncementData {

        return {
            messageIdSuffix: 'replace',
            values: {
                oldActionName: intl.formatMessage({
                    id: `Announcement.${programBlock.block}`
                }),
                newActionName: intl.formatMessage({
                    id: `Announcement.${selectedAction}`
                })
            }
        };
    }
};
