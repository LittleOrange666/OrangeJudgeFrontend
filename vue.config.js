module.exports = {
    devServer: {
        port: 8090,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
            "/swaggerui": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        }
    }
}
