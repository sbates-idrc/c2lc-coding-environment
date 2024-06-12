// This script runs 'eslint' with the BABEL_ENV environment variable
// set, as needed by babel-preset-react-app

const spawn = require('child_process').spawn;

process.env.BABEL_ENV = 'development';

spawn(
    'node',
    ['node_modules/eslint/bin/eslint.js', '--', '.'],
    {
        stdio: "inherit"
    }
).on('exit', (code) => {
    process.exit(code);
});
