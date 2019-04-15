'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')//一个插件，抽离css样式，防止将样式打包在js中引起样式加载错乱
const packageConfig = require('../package.json')

//导出assetsPath
exports.assetsPath = function (_path) {
  //如果是生产环境，则assetsSubDirectory的值为index.js文件中的assetsSubDirectory的值，否则...
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path) //path.join返回绝对路径（在电脑上的实际位置）；path.posix.join返回相对路径
}

//cssloaders相关配置
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader', //处理css文件
    options: {//传递参数给loader
      sourceMap: options.sourceMap  //是否开启cssmap,默认为false
    }
  }

//postcss-loader相关
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader] //是否使用postCss

    if (loader) {
      loaders.push({
        loader: loader + '-loader', //加载对应loader
        options: Object.assign({}, loaderOptions, { //object.assign浅拷贝合并对象
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
    //返回最终读取和导入loader
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(), //css对应vue-style-loader和css-loader
    postcss: generateLoaders(), //postcss对应vue-style-loader和less-loader
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  //生成的各种css文件的loader对象
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')//导入模块，用于node.js模块发送跨平台系统通知

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,//发生错误时的通知标题
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png') //发生错误时的通知图标
    })
  }
}
