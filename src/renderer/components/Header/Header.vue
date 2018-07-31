<template>
    <div class="iue-title-bar header">
        <slot></slot>
        <div class="iue-title-bar-title">{{title}}</div>
        <div class="handle-bar">
        <i class="el-icon-minus" @click="minimizeWindow"></i>
        <i class="el-icon-close" @click="closeWindow"></i>
        </div>
    </div>
</template>

<script>
// 渲染进程通过 remote 可以获取当前窗口
import { remote } from 'electron'
const { BrowserWindow } = remote
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    minimizeWindow () {
      const win = BrowserWindow.getFocusedWindow()
      // 窗口缩小
      win.minimize()
    },
    closeWindow () {
      const win = BrowserWindow.getFocusedWindow()
      // 窗口关闭
      win.close()
    }
  }
}
</script>

<style lang="less">
/* 自定义titlebar可拖动 */
.iue-title-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  height: 50px;
  -webkit-app-region: drag;
  &-title{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    user-select: none;
    cursor: move;
  }
  /* 关闭返回等按钮不能拖动 */
.back {
  position: fixed;
  left: 20px;
  top: 0;
  height: 50px;
  line-height: 50px;
  z-index: 999;
  -webkit-app-region: no-drag;
  color: #333;
  cursor: pointer;
}
.handle-bar {
  display: flex;
  z-index: 999;
  align-items: center;
  height: 50px;
  line-height: 50px;
  position: fixed;
  right: 20px;
  top: 0;
  -webkit-app-region: no-drag;
}
.handle-bar i {
  position: relative;
  display: block;
  width: 25px;
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  text-align: center;
}
.handle-bar .el-icon-close:after {
  position: absolute;
  z-index: -1;
  content: "";
  left: 0;
  top: 0;
  right: 0;
  height: 50px;
  transform: translateY(-110%);
  transition: all 0.3s;
  opacity: 0;
  background: rgb(255, 120, 120);
}
.handle-bar .el-icon-close:hover {
  color: #fff;
}
.handle-bar .el-icon-close:hover:after {
  opacity: 1;
  transform: translateY(0);
}
}

</style>
