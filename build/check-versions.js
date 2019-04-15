//检查node，npm 版本
'use strict' //严格模式
const chalk = require('chalk') //导入chalk模块，const声明一个常量
const semver = require('semver') //同上
const packageConfig = require('../package.json') //导入package.json文件
const shell = require('shelljs') //shelljs插件，执行unix系统命令

function exec (cmd) {
  //脚本可以通过child_process模块新建子进程，从而执行unix命令
  return require('child_process').execSync(cmd).toString().trim() //将cmd参数传递的值转换成前后没有空格的字符串，也就是版本号
}

//声明常量数组，数组内容为有关node相关信息的对象
const versionRequirements = [
  {
    name: 'node', //对象名称为node
    currentVersion: semver.clean(process.version), //使用semver插件，把版本信息转换成规定格式
    versionRequirement: packageConfig.engines.node //规定package.json中engines选项的node版本信息
  }
]

if (shell.which('npm')) {//which为linux指令，在$path规定的路径下查找符合条件的文件
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), //调用npm --version命令，并且把参数返回给exec函数获取纯净版本
    versionRequirement: packageConfig.engines.npm //规定package.json中engines选项的node版本信息
  })
}

module.exports = function () {
  const warnings = []

  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    
    //如果版本号不符合package.json文件中指定的版本号，就执行warning.push...
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
        //当前版本号用红色标识，要求版本号用绿色标识
      )
    }
  }

  if (warnings.length) { //如果为真，则打印提示用户升级新版本
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
