const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const getClientEnvironment = require('./config/env');
const paths = require('./config/paths');

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const postcssOptions = {
    ident: 'postcss',
    config: false,
    plugins: [
        'postcss-flexbugs-fixes',
        [
            'postcss-preset-env',
            {
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3
            }
        ],
        'postcss-normalize'
    ]
};

module.exports = {
    mode: 'production',
    target: ['browserslist'],
    stats: 'errors-warnings',
    performance: false,
    devtool: 'source-map',
    output: {
        pathinfo: false,
        filename: 'static/js/[name].[contenthash:8].js',
        assetModuleFilename: 'static/media/[name].[hash][ext]',
        publicPath: '/',
        clean: true
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                enforce: 'pre',
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                loader: 'source-map-loader'
            },
            {
                oneOf: [
                    {
                        test: [/\.avif$/],
                        type: 'asset',
                        mimetype: 'image/avif'
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        type: 'asset'
                    },
                    {
                        test: /\.svg$/,
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    prettier: false,
                                    svgo: false,
                                    svgoConfig: {
                                        plugins: [{ removeViewBox: false }]
                                    },
                                    titleProp: true,
                                    ref: true
                                }
                            },
                            {
                                loader: 'file-loader',
                                options: {
                                    name: 'static/media/[name].[hash].[ext]'
                                }
                            }
                        ],
                        issuer: {
                            and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
                        }
                    },
                    {
                        test: /\.js$/,
                        include: path.resolve(__dirname, 'src'),
                        loader: 'babel-loader',
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app'),
                                    {
                                        runtime: 'automatic'
                                    }
                                ]
                            ],
                            compact: true
                        }
                    },
                    {
                        test: /\.(js|mjs)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            compact: false,
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app/dependencies'),
                                    {
                                        helpers: true
                                    }
                                ]
                            ],
                            sourceMaps: true,
                            inputSourceMap: true
                        }
                    },
                    {
                        test: /\.css$/,
                        exclude: /\.module\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {}
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    sourceMap: true,
                                    modules: {
                                        mode: 'icss'
                                    }
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: postcssOptions,
                                    sourceMap: true
                                }
                            }
                        ],
                        sideEffects: true
                    },
                    {
                        test: /\.scss$/,
                        exclude: /\.module\.(scss|sass)$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {}
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 2,
                                    sourceMap: true,
                                    modules: {
                                        mode: 'icss'
                                    }
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: postcssOptions,
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ],
                        sideEffects: true
                    },
                    {
                        exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        type: 'asset/resource'
                    }
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2
                    },
                    mangle: {
                        safari10: true
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true
                    }
                }
            }),
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new ModuleNotFoundPlugin(paths.appPath),
        new webpack.DefinePlugin(env.stringified),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css'
        })
    ]
};
