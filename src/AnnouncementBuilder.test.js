// @flow

import AnnouncementBuilder from './AnnouncementBuilder';
import {createIntl} from 'react-intl';
import messages from './messages.json';

const intl = createIntl({
    locale: 'en',
    defaultLocale: 'en',
    messages: messages.en
});

test('Test buildSelectActionAnnouncement()', () => {
    expect.assertions(2);

    const announcementBuilder = new AnnouncementBuilder();

    expect(announcementBuilder.buildSelectActionAnnouncement('loop', intl)).toStrictEqual({
        messageIdSuffix: 'actionSelected',
        values: {
            actionType: 'control',
            actionName: 'loop'
        }
    });

    expect(announcementBuilder.buildSelectActionAnnouncement('forward1', intl)).toStrictEqual({
        messageIdSuffix: 'actionSelected',
        values: {
            actionType: 'movement',
            actionName: 'forward 1 square'
        }
    });
});

test('Test buildAddStepAnnouncement()', () => {
    expect.assertions(2);

    const announcementBuilder = new AnnouncementBuilder();

    expect(announcementBuilder.buildAddStepAnnouncement('loop', intl)).toStrictEqual({
        messageIdSuffix: 'add',
        values: {
            actionType: 'control',
            actionName: 'loop'
        }
    });

    expect(announcementBuilder.buildAddStepAnnouncement('forward1', intl)).toStrictEqual({
        messageIdSuffix: 'add',
        values: {
            actionType: 'movement',
            actionName: 'forward 1 square'
        }
    });
});

describe('Test buildDeleteStepAnnouncement()', () => {
    test('startLoop', () => {
        const announcementBuilder = new AnnouncementBuilder();

        const startLoopBlock = {
            block: 'startLoop',
            label: 'A',
            iterations: 1
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(startLoopBlock, intl)).toStrictEqual({
            messageIdSuffix: 'delete',
            values: {
                actionType: 'control',
                actionName: 'loop A'
            }
        });
    });

    test('endLoop', () => {
        const announcementBuilder = new AnnouncementBuilder();

        const endLoopBlock = {
            block: 'endLoop',
            label: 'A'
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(endLoopBlock, intl)).toStrictEqual({
            messageIdSuffix: 'delete',
            values: {
                actionType: 'control',
                actionName: 'loop A'
            }
        });
    });

    test('forward1', () => {
        const announcementBuilder = new AnnouncementBuilder();

        const forwardBlock = {
            block: 'forward1'
        };

        expect(announcementBuilder.buildDeleteStepAnnouncement(forwardBlock, intl)).toStrictEqual({
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

    const announcementBuilder = new AnnouncementBuilder();

    const forwardBlock = {
        block: 'forward1'
    };

    expect(announcementBuilder.buildReplaceStepAnnouncement(forwardBlock, 'right45', intl)).toStrictEqual({
        messageIdSuffix: 'replace',
        values: {
            oldActionName: 'forward 1 square',
            newActionName: 'turn right 45 degrees'
        }
    });
});
