const fs = require('fs');

exports.loadMessages = function(filename) {
    return JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
};

exports.getLangCodes = function(messages) {
    return Object.keys(messages).sort();
};

exports.getAllMessageKeys = function(messages, langCodes) {
    const messageKeys = new Set();
    for (const lang of langCodes) {
        for (const key of Object.keys(messages[lang])) {
            messageKeys.add(key);
        }
    }
    return Array.from(messageKeys).sort();
};
