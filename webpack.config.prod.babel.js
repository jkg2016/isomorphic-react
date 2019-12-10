const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        /**
         * babel-regenerator-runtime lets us use generators and yield
         */
        'babel-regenerator-runtime',
        /**
         * The entry point of the main application
         */
        path.resolve(__dirname, 'src/')
    ],
    /**
     * Output contains detailed information about the bundle.js
     * In this case, bundle.js is never created but server by webpack-dev-middleware in ./server
     */
    output: {
        path: path.resolve(__dirname, 'dist'),
        /**
         * Public path is necessary for webpack HMR to reload correctly when on a path other than '/'
         */
        publicPath: '/',
        filename: 'bundle.js',
    },
    plugins: [
        /**
         * Defines the env as 'development', which triggers different behaviors in some scripts
         * To see more, search project for 'development'
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                WEBPACK: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    /**
     * Resolve allows files to be imported without specifying an extension as long as they match one specified, i.e.
     * import component from './component'
     */
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
    },
    module: {
        loaders: [
            {
                /**
                 * Babel loader is used for any JS or JSX files in the src directory
                 */
                test: /\.jsx?/,
                use: {
                    loader: 'babel-loader'
                },
                include: path.resolve(__dirname, 'src'),
            },
        ]
    }
};