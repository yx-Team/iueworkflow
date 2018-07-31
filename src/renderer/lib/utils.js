import {Message, MessageBox} from 'element-ui'
/**
 * localStorage
 */
export const storage = {
  // 存储
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  // 取出数据
  get (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  // 删除数据
  remove (key) {
    localStorage.removeItem(key)
  }

}

/**
 * 提示
 * @param {*} type 类型
 * @param {*} val 文本
 */
export function tips (val, type = 'success') {
  Message({
    message: val,
    type: type,
    customClass: 'iue-message-tips',
    center: true
  })
}

export function Confirm (val, callback, cancelCallback, type = 'warning') {
  MessageBox.confirm(val, '提示', {
    customClass: 'iue-confirm',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callback && callback()
  }).catch(() => {
    cancelCallback && cancelCallback()
  })
}
