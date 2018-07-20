import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
const {ipcRenderer} = require('electron')
Vue.use(Vuex)
Vue.prototype.$ipcRenderer = ipcRenderer
export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
