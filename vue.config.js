module.exports = {
  devServer: {
    hot: true,
    proxy: {
      '/v1': {
        target: 'http://3.38.49.221:80',
        changeOrigin: true,
      },
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
}
