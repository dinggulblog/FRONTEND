const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  outputDir: path.resolve('../backend/public'),
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import '@/scss/variables.scss';
          @import '@/scss/mixin.scss';
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    resolve: {
      fallback: {
        'fs': false,
        'net': false
      }
    }
  },
})
