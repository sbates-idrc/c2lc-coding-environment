// Generates the keyboard Markdown document
//
// Note: this file assumes that the working directory is the project directory.
//
// To generate the keyboard Markdown document file:
//
// - Set 'generateDoc' to true below
// - Run this test with: npm test GenerateKeyboardDoc

import {KeyboardInputSchemes} from './KeyboardInputSchemes';
const fs = require('fs');

// Change to true to generate the keyboard Markdown doc
const generateDoc = false;

const filename = "docs/keyboard2.md";
const boardImgsPath = "../src/board-imgs/";

function processSingleLevel(singleLevel, accumulatedSequence) {
    let levelSequences = [];
    const levelAccumulatedSequence = accumulatedSequence.concat([singleLevel.keyDef]);
    if (singleLevel.actionName) {
        const actionInfo = {
            description : singleLevel.description
        };
        if (singleLevel.icon) {
            actionInfo.iconPath = boardImgsPath + singleLevel.icon;
            actionInfo.altText = singleLevel.altText;
        }

        levelAccumulatedSequence.push(actionInfo);
        levelSequences.push(levelAccumulatedSequence);
    }
    else {
        for (const [subEntryKey, subEntryValue] of Object.entries(singleLevel)) {
            if (subEntryKey !== "keyDef" && subEntryKey !== "commandName") {
                const subSequences = processSingleLevel(subEntryValue, levelAccumulatedSequence);
                levelSequences = levelSequences.concat(subSequences);
            }
        }
    }
    return levelSequences;
}

function displayKeyBindings() {
    let markdown = "";
    for (const [schemeName, keyboardInputScheme] of Object.entries(KeyboardInputSchemes)) {
        markdown += '## ' + schemeName + ' Key Bindings\n\n';
        markdown += '| Action | Keyboard Shortcut | Icon |\n'
        markdown += '| ---- | ------- | ----- |\n'
        for (const topLevelBinding of Object.values(keyboardInputScheme)) {
            const allSequences = processSingleLevel(topLevelBinding, []);
            const bindingEntries = [];
            for (const sequence of allSequences) {
                const keys = sequence.slice(0, sequence.length - 1);
                const actionInfo = sequence[sequence.length - 1];
                const iconLink = actionInfo.iconPath ? "![" + actionInfo.altText + "](" + actionInfo.iconPath + ")" : "Not available"
                let bindingText = "";
                for (const keyDef of keys) {
                    if (bindingText.length) {
                        bindingText += ", ";
                    }
                    if (keyDef.ctrlKey) {
                        bindingText += "Ctrl + ";
                    }
                    if (keyDef.altKey) {
                        bindingText += "Alt + "
                    }
                    bindingText += keyDef.key || (keyDef.code && keyDef.code.replace("Key", ""));
                }
                bindingEntries.push('| ' + actionInfo.description + ' | ' + bindingText + ' | ' + iconLink + ' |');
            }
            markdown += bindingEntries.sort().join('\n') + '\n';
        }
        markdown += "\n";
    }
    return markdown;
}

function generateKeyboardDoc() {
    let markdown =
`# Key Bindings

A keyboard shortcut provides fast access to a range of Weavly's features using
one or more key presses.  Keyboard shortcuts are disabled by default, and can be
turned on using the keyboard input menu, which is displayed when the keyboard
icon is clicked.  Once key bindings are enabled, the keyboard input menu can
also be opened using the question mark key.

Weavly supports two sets of keyboard shortcuts.  The most basic shortcuts are
activated by holding a key like alt, or holding control and alt at the same
time, and then pressing a particular letter.  Longer shortcuts involve hitting a
combination of keys to start a sequence, and then entering additional letters.

In the instructions below, keys that need to be held at the same time are
indicated using plus signs, and keys that need to be entered separately are
divided using commas. For example, the shortcut \`Ctrl + Alt + x, x\` is
activated by holding control, alt, and x at the same time, releasing all keys,
and then hitting the x key again by itself.

`;
    markdown += displayKeyBindings();

    fs.writeFileSync(filename, markdown);
}

test('Generate keyboard Markdown doc', () => {
    if (generateDoc) {
        generateKeyboardDoc();
    }
});
