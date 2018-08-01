var path = require('path');
module.exports = {
    entry: ['./public/app.js', './public/style.scss'],
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
    },
    devServer: {
        before: function(app) {
            app.get('/login.json', function(req, res) {
                const login = require('../../login.json');
                res.json(login);
            });
        },
    },
};