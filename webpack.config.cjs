const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
    entry: {
        main: './src/index.ts'
    },
    target: 'node',
    mode: 'none',
    devtool: 'inline-source-map',
    // Fix for using sharp in this webpack
    externals: ['node_modules', {
        'sharp': 'commonjs sharp'
    }],
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: "node-loader",
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png)$/i,
                type: "asset",
            },
        ],
    },
    optimization: {
        minimizer: true,
        minimizer: [
            new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                // https://sharp.pixelplumbing.com/api-output#jpeg
                                quality: 100,
                            },
                            webp: {
                                // https://sharp.pixelplumbing.com/api-output#webp
                                lossless: true,
                            },
                            avif: {
                                // https://sharp.pixelplumbing.com/api-output#avif
                                lossless: true,
                            },

                            // png by default sets the quality to 100%, which is same as lossless
                            // https://sharp.pixelplumbing.com/api-output#png
                            png: {},

                            // gif does not support lossless compression at all
                            // https://sharp.pixelplumbing.com/api-output#gif
                            gif: {},
                        },
                    },
                },
            }),
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};