const {resolve} = require("node:path");
module.exports = {
    devServer: {
        port: 8090,
        proxy: {
            "/api": {
                target: "http://localhost:8781",
                changeOrigin: true,
            },
            "/swaggerui": {
                target: "http://localhost:8781",
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
    },
    transpileDependencies: [
        'vue-timer-hook' // 強制 Babel 處理這個套件
    ]
}
