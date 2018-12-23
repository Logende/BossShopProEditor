module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.txt$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.ya?ml$/,
                    use: 'raw-loader'
                }
            ]
        }
    }
}