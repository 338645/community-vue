const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        entry: {}
    }, devServer: {
        proxy: {
            "/server": {
                target: 'http://1.14.206.60:8887',
                changeOrigin: true,
                allowCredentials: true,
                ws: true,
                pathRewrite: {
                    "^/server": "",
                },
            }
        }
    }
})
