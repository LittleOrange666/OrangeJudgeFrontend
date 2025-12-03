import {defineConfig} from "@vue/cli-service";

module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].titleBase = process.env.VUE_APP_TITLE || 'OrangeJudge';
                return args;
            })
    }
})
