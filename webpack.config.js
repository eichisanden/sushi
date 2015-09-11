module.exports = {
//    cache: true,
    entry: "./main.js",
    output: {
        path: "./public/js/",
        filename: "main.js"
    },
    module: {
        loaders: [
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.jade$/, loader: 'jade' },
            { test: /main.js$/, loader: 'expose?initMap' },
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff2" },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml"},
            { test: /main.js$/, exclude: /node_modules/, loader: '6to5-loader' },
        ]
    }
};
