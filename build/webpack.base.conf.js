//webpack基础配置
'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) { //返回当前目录的平行目录的路径
  return path.join(__dirname, '..', dir)
}



module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js' //入口文件
  },
  //出口文件
  output: {
    path: config.build.assetsRoot,//打包后文件输出路径
    filename: '[name].js', 
    publicPath: process.env.NODE_ENV === 'production' //真正的文件引用路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],//省略扩展名，也就是说当使用.js .vue .json文件导入可以省略后缀名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',//$符号指精确匹配，路径和文件名要详细
      '@': resolve('src'),//resolve('src')指的是项目根目录中的src文件夹目录，导入文件的时候路径可以这样简写 import somejs from "@/some.js"就可以导入指定文件
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/, //书写匹配文件的正则表达式 ，表示当前loader能检测.vue类型的文件/标记正则表达式的开始和结束，指的是在开始和结尾处哦，否则要使用/就得转义\/;\.表示.,此处的\将.标记为原意字符；$是正则表达式的结束
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',//对js文件使用babel-loader转码，该插件用来解析es6等代码
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')] //指明src文件夹 test文件夹 client文件夹下的js文件要使用该loader
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, //这些格式结尾的图片文件
        loader: 'url-loader', //图片文件使用url-loader插件，将图片转为base64格式字符串
        options: {
          limit: 10000, //10000个字节以下的文件才用来转为dataUrl
          name: utils.assetsPath('img/[name].[hash:7].[ext]') //超过10000字节的图片，就按照制定规则设置生成的图片名称，可以看到用了7位hash码来标记，.ext文件是一种索引式文件系统
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,//音频 视频类文件
        loader: 'url-loader', //也是用url-loader
        options: {
          limit: 10000, //10000个字节以下的文件才进行转换
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, //处理字体相关
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {//一个对象，每个属性都是node.js全局变量或模块的名称，value为empty表示提供空对象
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,//false表示什么都不提供，话说参数setImmediate表示异步递归
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
