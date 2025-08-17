const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3002,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
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
        filename: '[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: "public/favicon.ico",
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "public/styles.css"), },
                { from: path.resolve(__dirname, "public/logo-center.png"), },
                { from: path.resolve(__dirname, "public/logo.png"), },
            ],
        }),
        new CleanWebpackPlugin()
    ]
};