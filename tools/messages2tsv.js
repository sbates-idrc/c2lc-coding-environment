const fs = require('fs');

function writeTSV(messages, stream) {
    const langCodes = getLangCodes(messages);
    const messageKeys = getAllMessageKeys(messages, langCodes);
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

function getLangCodes(messages) {
    return Object.keys(messages).sort();
}

function getAllMessageKeys(messages, langCodes) {
    const messageKeys = new Set();
    for (const lang of langCodes) {
        for (const key of Object.keys(messages[lang])) {
            messageKeys.add(key);
        }
    }
    return Array.from(messageKeys).sort();
}

if (process.argv.length !== 4) {
    process.stderr.write("usage: messages2tsv.js output-file input-file\n");
    process.exit(2);
}

const outputFilename = process.argv[2];
const inputFilename = process.argv[3];

const messages = JSON.parse(fs.readFileSync(inputFilename, {encoding: 'utf8'}));
const outStream = fs.createWriteStream(outputFilename, {encoding: 'utf8'});

writeTSV(messages, outStream);
