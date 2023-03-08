// Script to find mismatched messages keys in the application
// messages.json file.

/* eslint-disable no-console */

const fs = require('node:fs');
const process = require('node:process');

function checkMessages(messagesFilename) {
    const messages = JSON.parse(fs.readFileSync(messagesFilename, 'utf8'));

    console.log('In English, but not French:')
    checkKeysInAButNotB(messages.en, messages.fr);

    console.log();
    console.log('In French, but not English:')
    checkKeysInAButNotB(messages.fr, messages.en);
}

function checkKeysInAButNotB(messagesA, messagesB) {
    for (const key of Object.keys(messagesA).sort()) {
        if (!Object.hasOwn(messagesB, key)) {
            console.log(`${key}: "${messagesA[key]}"`);
        }
    }
}

if (process.argv.length !== 3) {
    console.error('Usage: node check_messages.js MESSAGES_FILE');
    process.exitCode = 1;
} else {
    checkMessages(process.argv[2]);
}
