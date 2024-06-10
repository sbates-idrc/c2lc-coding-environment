const spawn = require('child_process').spawn;

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

spawn(
    'node',
    ['node_modules/webpack/bin/webpack.js'],
    {
        stdio: "inherit"
    }
).on('exit', (code) => {
    process.exit(code);
});
