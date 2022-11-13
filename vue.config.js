const path = require('path')

module.exports = {
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
}
