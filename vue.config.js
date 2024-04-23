const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/ovd/'
  : '/',
  transpileDependencies: true, 
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.module
      .rule('mov')
      .test(/\.mov$/)
      .use('file-loader')
        .loader('file-loader')
        .end()
  }
})