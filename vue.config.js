const path = require('path')

module.exports = {
  outputDir: path.resolve('../backend/public'),
  devServer: {
    hot: true,
    proxy: {
      '/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  },
}
