const fs = require('fs');
const messagesUtils = require('./messagesUtils.js');

function writeTSV(messages, stream) {
    const langCodes = messagesUtils.getLangCodes(messages);
    const messageKeys = messagesUtils.getAllMessageKeys(messages, langCodes);
    // Header
    stream.write("keys");
    for (const lang of langCodes) {
        stream.write(`\t${lang}`);
    }
    stream.write("\n");
    // Messages
    for (const key of messageKeys) {
        stream.write(key);
        for (const lang of langCodes) {
            stream.write("\t");
            if (Object.hasOwn(messages[lang], key)) {
                stream.write(messages[lang][key]);
            } else {
                stream.write("MISSING");
            }
        }
        stream.write("\n");
    }
}

if (process.argv.length !== 4) {
    process.stderr.write("usage: messages2tsv.js output-file input-file\n");
    process.exit(2);
}

const outputFilename = process.argv[2];
const inputFilename = process.argv[3];

const messages = messagesUtils.loadMessages(inputFilename);
const outStream = fs.createWriteStream(outputFilename, {encoding: 'utf8'});

writeTSV(messages, outStream);
