const messagesUtils = require('./messagesUtils.js');

function checkMessages(messages) {
    const langCodes = messagesUtils.getLangCodes(messages);
    const messageKeys = messagesUtils.getAllMessageKeys(messages, langCodes);
    let ok = true;
    for (const lang of langCodes) {
        for (const key of messageKeys) {
            if (!Object.hasOwn(messages[lang], key)) {
                process.stderr.write(`Missing: ${lang}.${key}\n`);
                ok = false;
            }
        }
    }
    return ok;
}

if (process.argv.length !== 3) {
    process.stderr.write("usage: check_messages.js file\n");
    process.exit(2);
}

const filename = process.argv[2];

const messages = messagesUtils.loadMessages(filename);

const ok = checkMessages(messages);
if (!ok) {
    process.exit(1);
}
