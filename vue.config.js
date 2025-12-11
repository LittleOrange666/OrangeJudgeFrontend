const {resolve} = require("node:path");
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
    },
    configureWebpack: {
        resolve: {
            alias: {
                // 強制所有 @codemirror/state 的引用都指向專案根目錄下的 node_modules
                '@codemirror/state': resolve(__dirname, 'node_modules/@codemirror/state')
            }
        }
    }
}
