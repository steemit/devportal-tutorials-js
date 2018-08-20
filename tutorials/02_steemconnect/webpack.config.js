var path = require('path');
module.exports = {
    entry: './public/app.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
};
