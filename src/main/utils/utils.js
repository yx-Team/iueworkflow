
const fs = require('fs')
const extract = require('extract-zip')

/**
 * 读取文件
 * @param {*} path 路径
 */
export function readFile (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}
/**
 * 写入文件
 * @param {*} to 路径
 * @param {*} data  buff 数据
 */
export function writeFile (to, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(to, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
/**
 * 解压文件
 * @param {*} to 文件路径
 * @param {*} dir 解压目录
 */
export function unzip (to, dir) {
  return new Promise((resolve, reject) => {
    extract(to, {dir: dir}, function (err) {
      if (err) {
        console.log(err)
        return reject(err)
      }
      return resolve()
    })
  })
}
