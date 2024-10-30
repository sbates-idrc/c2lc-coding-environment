// @flow

import type {IntlShape} from 'react-intl';
import type {ProgramBlock} from './types';

type AnnouncementData = {|
    messageIdSuffix: string,
    values: any
|};

export default class AnnouncementBuilder {
    buildSelectActionAnnouncement(action: string, intl: IntlShape): AnnouncementData {
        let commandType = null;
        if (action === 'loop') {
            commandType = intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            commandType = intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'actionSelected',
            values: {
                commandType: commandType,
                command: intl.formatMessage({
                    id: `Announcement.${action}`
                }),
            }
        };
    }

    buildAddStepAnnouncement(action: string, intl: IntlShape): AnnouncementData {
        let commandType = null;
        if (action === 'loop') {
            commandType = intl.formatMessage({
                id: 'Announcement.control'
            });
        } else {
            commandType = intl.formatMessage({
                id: 'Announcement.movement'
            });
        }
        return {
            messageIdSuffix: 'add',
            values: {
                commandType: commandType,
                command: intl.formatMessage({
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
                    commandType: intl.formatMessage({
                        id: "Announcement.control"
                    }),
                    command: intl.formatMessage(
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
                    commandType: intl.formatMessage({
                        id: "Announcement.movement"
                    }),
                    command: intl.formatMessage(
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
                oldCommand: intl.formatMessage({
                    id: `Announcement.${programBlock.block}`
                }),
                newCommand: intl.formatMessage({
                    id: `Announcement.${selectedAction}`
                })
            }
        };
    }
};
