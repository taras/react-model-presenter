const babel = require('rollup-plugin-babel');
const filesize = require('rollup-plugin-filesize');
const pkg = require('./package.json');

let globals = {
  funcadelic: 'Funcadelic',
  'object.getownpropertydescriptors': 'Object.getOwnPropertyDescriptors',
  'is-symbol': 'isSymbol',
  'fast-memoize': 'fastMemoize',
  shallowequal: 'shallowequal',
  react: 'React',
  'lodash.omit': '_.omit'
};

module.exports = {
  input: 'src/index.js',
  external: Object.keys(globals),
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named' },
    { file: pkg.module, format: 'es' },
    { file: pkg.browser, format: 'umd', name: 'RMP', globals, exports: 'named' }
  ],
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ],
        '@babel/preset-react'
      ]
    }),
    filesize({
      render(opt, size, gzip, bundle) {
        return `Built: ${bundle.file} ( size: ${size}, gzip: ${gzip})`;
      }
    })
  ]
};
