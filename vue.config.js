/*
 * OrangeJudge, a competitive programming platform
 *
 * Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 */

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
    chainWebpack: config => {
        config.plugin('eslint').tap(args => {
            if (args[0] && args[0].extensions) {
                delete args[0].extensions;
            }
            return args;
        });
    }
}
