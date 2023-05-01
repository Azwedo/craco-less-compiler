const { throwUnexpectedConfigError } = require('@craco/craco')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssNormalize = require('postcss-normalize')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const throwError = (message, githubIssueQuery) => {
  throwUnexpectedConfigError({
    packageName: 'craco-less-plugin',
    githubRepo: 'jaskang/craco-less-plugin',
    message,
    githubIssueQuery
  })
}

module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions, context: { env, paths } }) => {
    const isEnvDevelopment = env === 'development'
    const isEnvProduction = env === 'production'
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

    const lessRegex = /\.less$/
    const lessModuleRegex = /\.module\.less$/

    const getStyleLoaders = cssOptions => {
      const loaders = [
        isEnvDevelopment && require.resolve('style-loader'),
        isEnvProduction && {
          loader: MiniCssExtractPlugin.loader,
          options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {}
        },
        {
          loader: require.resolve('css-loader'),
          options: cssOptions
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              }),
              postcssNormalize()
            ],
            sourceMap: isEnvProduction && shouldUseSourceMap
          }
        },
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap
          }
        },
        {
          loader: require.resolve('less-loader'),
          options: pluginOptions
        }
      ].filter(Boolean)
      return loaders
    }

    const oneOfRuleIndex = webpackConfig.module.rules.findIndex((rule, index) => rule.oneOf)
    if (oneOfRuleIndex === -1) {
      throwError(`Can't find 'oneOf' rule  in the ${context.env} webpack config!`, 'oneOf')
    }

    webpackConfig.module.rules[oneOfRuleIndex]['oneOf'].splice(
      -1,
      0,
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: getStyleLoaders({
          importLoaders: 3,
          sourceMap: isEnvProduction && shouldUseSourceMap
        }),
        sideEffects: true
      },
      {
        test: lessModuleRegex,
        use: getStyleLoaders({
          importLoaders: 3,
          sourceMap: isEnvProduction && shouldUseSourceMap,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent
          }
        })
      }
    )
    return webpackConfig
  }
}
