module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 0,
    'no-mixed-spaces-and-tabs': 0,
    'vetur.validation.template': false,
    'vetur.validation.script': false,
    'vetur.validation.style': false,
    /*
    indent: ['off'],
    semi: ['off'],
    'vue/no-multiple-template-root': 'off',
    'no-multi-spaces': 0,
    'no-useless-escape': 0,
    'no-trailing-spaces': 0,
    'no-multiple-empty-lines': 0,
    'eol-last': 0,
    'keyword-spacing': 0,
    'space-before-function-paren': 0,
    */
  },
}
