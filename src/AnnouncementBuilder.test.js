// @flow

import AnnouncementBuilder from './AnnouncementBuilder';
import {createIntl} from 'react-intl';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

function createAnnouncementBuilder() {
    return new AnnouncementBuilder(intl);
}

test('Test buildSelectActionAnnouncement()', () => {
    expect.assertions(2);

    const announcementBuilder = createAnnouncementBuilder();

    expect(announcementBuilder.buildSelectActionAnnouncement('loop')).toStrictEqual({
        messageIdSuffix: 'actionSelected',
        values: {
            actionType: 'control',
            actionName: 'loop'
        }
    });

    expect(announcementBuilder.buildSelectActionAnnouncement('forward1')).toStrictEqual({
        messageIdSuffix: 'actionSelected',
        values: {
            actionType: 'movement',
            actionName: 'forward 1 square'
        }
    });
});

test('Test buildAddStepAnnouncement()', () => {
    expect.assertions(2);

    const announcementBuilder = createAnnouncementBuilder();

    expect(announcementBuilder.buildAddStepAnnouncement('loop')).toStrictEqual({
        messageIdSuffix: 'add',
        values: {
            actionType: 'control',
            actionName: 'loop'
        }
    });

    expect(announcementBuilder.buildAddStepAnnouncement('forward1')).toStrictEqual({
        messageIdSuffix: 'add',
        values: {
            actionType: 'movement',
            actionName: 'forward 1 square'
        }
    });
});

describe('Test buildDeleteStepAnnouncement()', () => {
    test('startLoop', () => {
        const announcementBuilder = createAnnouncementBuilder();

        const startLoopBlock = {
            block: 'startLoop',
            label: 'A',
            iterations: 1
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(startLoopBlock)).toStrictEqual({
            messageIdSuffix: 'delete',
            values: {
                actionType: 'control',
                actionName: 'loop A'
            }
        });
    });

    test('endLoop', () => {
        const announcementBuilder = createAnnouncementBuilder();

        const endLoopBlock = {
            block: 'endLoop',
            label: 'A'
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(endLoopBlock)).toStrictEqual({
            messageIdSuffix: 'delete',
            values: {
                actionType: 'control',
                actionName: 'loop A'
            }
        });
    });

    test('forward1', () => {
        const announcementBuilder = createAnnouncementBuilder();

        const forwardBlock = {
            block: 'forward1'
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(forwardBlock)).toStrictEqual({
            messageIdSuffix: 'delete',
            values: {
                actionType: 'movement',
                actionName: 'forward 1 square'
            }
        });
    });
});

test('Test buildReplaceStepAnnouncement()', () => {
    expect.assertions(1);

    const announcementBuilder = createAnnouncementBuilder();

    const forwardBlock = {
        block: 'forward1'
    };

    expect(announcementBuilder.buildReplaceStepAnnouncement(forwardBlock, 'right45')).toStrictEqual({
        messageIdSuffix: 'replace',
        values: {
            oldActionName: 'forward 1 square',
            newActionName: 'turn right 45 degrees'
        }
    });
});
