//生产环境构建代码
'use strict'
require('./check-versions')()//node和npm版本检查

process.env.NODE_ENV = 'production'  //设置环境变量为生产模式

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

//开启转圈圈动画
const spinner = ora('building for production...') //实现loading的模板
spinner.start()
// 调用rm方法，第一个参数的结果就是 绝对/工程名/dist/static，表示删除这个路径下面的所有文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err //如果删除有错误就抛出异常并终止程序
  webpack(webpackConfig, (err, stats) => {
    spinner.stop() //停止转圈圈动画
    if (err) throw err //如果有异常就抛出
    process.stdout.write(stats.toString({
      colors: true, //增加控制台颜色开关
      modules: false, //不增加内置模块信息
      children: false, //不增加子集信息 If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false, //允许较少的输出
      chunkModules: false //不将内置模块的信息加到包信息
    }) + '\n\n') //编译过程中，持续打印消息

    //编译失败
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    //编译成功的信息
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
