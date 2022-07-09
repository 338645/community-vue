const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        entry: {}
    }, devServer: {
        proxy: {
            "/server": {
                target: 'http://localhost:8887',
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
