# Craco Less Plugin

This is a [craco](https://github.com/sharegate/craco) Less & Less Modules plugin, support [create-react-app](https://facebook.github.io/create-react-app/) version >= 3.

## Installation

Then install `craco-less-plugin`:

```bash
$ yarn add craco-less-plugin
```

## Usage

Here is a complete `craco.config.js` configuration file that adds Less compilation to `create-react-app`:

```js
const CracoLessPlugin = require('craco-less-plugin')
module.exports = {
  plugins: [{ plugin: CracoLessPlugin }]
}
```

## Options

[View the `less-loader` documentation](https://webpack.js.org/loaders/less-loader/)

For example:

```js
const CracoLessPlugin = require('craco-less-plugin')

module.exports = {
  plugins: [
    {
      plugin: cracoLessPlugin,
      options: {
        modifyVars: {
          hack: `true;@import "${require.resolve('./src/theme.less')}";`
        },
        javascriptEnabled: true
      }
    }
  ]
}
```

## CSS Modules

using the [name].module.less file naming convention

For example:

> Button.module.less

```less
.button {
  background-color: red;
}
```