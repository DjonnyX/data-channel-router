const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this',
        library: {
            name: 'dcRouter',
            type: 'umd',
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "LICENSE"), },
                { from: path.resolve(__dirname, "README.md"), },
                { from: path.resolve(__dirname, "package.json"), },
                { from: path.resolve(__dirname, "index.d.ts"), }
            ],
        }),
        new CleanWebpackPlugin()
    ]
};