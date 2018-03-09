const babel = require("rollup-plugin-babel");
const filesize = require("rollup-plugin-filesize");
const pkg = require("./package.json");

module.exports = {
  input: "src/index.js",
  external: [
    "funcadelic",
    "object.getownpropertydescriptors",
    "is-symbol",
    "shallowequal",
    "react"
  ],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" }
  ],
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
      ],
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false
          }
        ],
        "@babel/preset-react"
      ]
    }),
    filesize({
      render(opt, size, gzip, bundle) {
        return `Built: ${bundle.file} ( size: ${size}, gzip: ${gzip})`;
      }
    })
  ]
};
