const fs = require('fs');
const readline = require('readline');

function readMessagesFromTSV(stream, callback) {
    let langCodes = [];
    const messages = {};

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let firstLine = true;
    rl.on('line', (line) => {
        const cols = line.split("\t");
        if (firstLine) {
            langCodes = cols.slice(1);
            for (const lang of langCodes) {
                messages[lang] = {};
            }
            firstLine = false;
        } else {
            if (cols.length > 0) {
                const key = cols[0];
                for (let i = 0; i < langCodes.length; i++) {
                    messages[langCodes[i]][key] = cols[i+1];
                }
            }
        }
    });

    rl.on('close', () => {
        callback(messages);
    });
}

if (process.argv.length !== 4) {
    process.stderr.write("usage: tsv2messages.js output-file input-file\n");
    process.exit(2);
}

const outputFilename = process.argv[2];
const inputFilename = process.argv[3];

const inStream = fs.createReadStream(inputFilename, {encoding: 'utf8'});

readMessagesFromTSV(inStream, (messages) => {
    fs.writeFileSync(outputFilename, JSON.stringify(messages, null, 4), {encoding: 'utf8'});
});
