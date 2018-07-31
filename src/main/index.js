'use strict'

import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import {exec} from 'child_process'

import {readFile, writeFile, unzip} from './utils/utils'
import code from './utils/code'
// const fs = require('fs')

const path = require('path')
const kill = require('tree-kill')
const del = require('del')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 567,
    width: 375,
    frame: true,
    // useContentSize: false,
    // resizable: false,
    // maximizable: false,
    // icon: '../../build/icons/256x256.png',
    backgroundColor: '#fff'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
// 选择文件夹
ipcMain.on('open-file-dialog', function (event, type) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) {
      let filecode
      if (type === 'project') {
        filecode = code.selectSuccess
      } else if (type === 'work') {
        filecode = code.selectSpaceSuccess
      }
      return event.sender.send('notice', {code: filecode, msg: '选择成功', path: files[0]})
    }
  })
})
// 复制模板文件并解压
ipcMain.on('copy-file-unzip', (event, fullpath) => {
  // zip源路径
  let from = path.resolve(__static, './source/h5.zip')
  console.log(from)
  // 目标路径
  let toPath = fullpath.toString()
  // 目标路径zip
  let to = toPath + '\\h5.zip'
  // 读取压缩包
  readFile(from).then((data) => {
    // 写入压缩包到目标文件
    return writeFile(to, data)
  }).then(() => {
    // 解压压缩包到目标文件
    return unzip(to, toPath)
  }).then(() => {
    // 解压成功，消息返回给客户端
    event.sender.send('notice', {code: code.copySuccess, msg: '创建成功'})
    del(to, {force: true}).then((paths) => {
      console.log('Deleted files and folders:\n', paths.join('\n'))
      return false
    })
  }).catch((err) => {
    return event.sender.send('notice', {code: code.errorCode, msg: err})
  })
})
// 复制node_module文件并解压
ipcMain.on('copy-node-module', (event, obj) => {
  let from = path.resolve(__static, './source/node_modules.zip')
  let toPath = obj.dir.toString()
  let to = toPath + '\\node_modules.zip'
  // 读取压缩包
  readFile(from).then((data) => {
    return writeFile(to, data)
  }).then(() => {
    if (obj.type === '自动') {
      return unzip(to, toPath).then(() => {
        return event.sender.send('notice', {code: code.copyNodeSuccess, msg: '创建成功', type: obj.type})
      })
    } else if (obj.type === '手动') {
      return event.sender.send('notice', {code: code.copyNodeSuccess, msg: '复制成功，需打开工作空间手动解压node_module', type: obj.type})
    }
  }).catch(err => {
    return event.sender.send('notice', {code: code.errorCode, msg: err})
  })
})
// 启动服务
ipcMain.on('run-gulp-server', (event, obj) => {
  let child = exec(`gulp dev --path=${obj.dir} --gulpfile ${obj.workspace}\\gulpfile.js`)
  child.stderr.on('data', function (data) {
    let str = data.toString()
    console.error('exec error: ' + str)
  })
  child.stdout.on('data', function (data) {
    console.log(data.toString())
    if (data.toString().split(' ').indexOf('Serving') > -1) {
      return event.sender.send('notice', {code: code.serverSuccess, msg: '运行成功', pid: child.pid})
    }
  })
})
// 压缩
ipcMain.on('run-gulp-build', (event, obj) => {
  console.error('BUILD')
  let child = exec(`gulp build --path=${obj.dir} --gulpfile ${obj.workspace}\\gulpfile.js`)
  child.stderr.on('data', function (data) {
    let str = data.toString()
    console.error('exec error: ' + str)
  })
  child.stdout.on('data', function (data) {
    console.log(data.toString())
    if (data.toString().split("Finished 'build'").length > 1) {
      return event.sender.send('notice', {code: code.buildSuccess, msg: '压缩成功'})
    }
  })
})
// 打包
ipcMain.on('run-gulp-zip', (event, obj) => {
  console.error('ZIP')
  let child = exec(`gulp zip --path=${obj.dir} --gulpfile ${obj.workspace}\\gulpfile.js`)
  child.stderr.on('data', function (data) {
    let str = data.toString()
    console.error('exec error: ' + str)
  })
  child.stdout.on('data', function (data) {
    console.log(data.toString())
    if (data.toString().split(' ').indexOf('Finished') > -1) {
      return event.sender.send('notice', {code: code.zipSuccess, msg: '打包成功'})
    }
  })
})
// 杀死进程
ipcMain.on('kill', (event, pid) => {
  kill(pid, 'SIGKILL', (err) => {
    if (err) return event.sender.send('notice', {code: code.errorCode, msg: '进程结束失败'})
    return event.sender.send('notice', {code: code.killSuccess, msg: '进程结束成功'})
  })
})
// 读取配置
ipcMain.on('read-config', (event, path) => {
  readFile(path, 'utf8').then(data => {
    console.log(data)
    return event.sender.send('notice', {code: code.readConfigSuccess, msg: '配置读取成功', config: {data: data, path: path}})
  }).catch(err => {
    return event.sender.send('notice', {code: code.errorCode, msg: err})
  })
})
ipcMain.on('write-config', (event, config) => {
  console.log(config)
  writeFile(config.path, config.data).then(() => {
    return event.sender.send('notice', {code: code.writeConfigSuccess, msg: '保存成功'})
  }).catch(err => {
    return event.sender.send('notice', {code: code.errorCode, msg: err})
  })
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
