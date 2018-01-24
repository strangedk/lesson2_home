let path = require('path');

module.exports = {

    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader',
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};