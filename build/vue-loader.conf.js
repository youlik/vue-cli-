//css加载器配置
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production' //是否是生产模式
const sourceMapEnabled = isProduction //设置是否允许开启资源map
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({ //载入utils中的cssloaders返回配置好的css-loader和vue-style-loader
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled, //是否开启css资源map
  cacheBusting: config.dev.cacheBusting, //是否开启cacheBusting
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
