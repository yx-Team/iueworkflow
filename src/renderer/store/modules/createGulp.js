import {storage} from '@/lib/utils'
const state = {
  projectData: [],
  workspace: '',
  // 0-工作空间  1-创建项目  2-设置项目
  projectSettingType: 0,
  // 浏览器运行进程号pid
  pid: -1,
  // 运行的项目id
  projectId: ''
}
const mutations = {
  addProjectData (state, obj) {
    return state.projectData.unshift(obj)
  },
  delProjectData (state, index) {
    return state.projectData.splice(index, 1)
  },
  concatProjectData (state, data) {
    return (state.projectData = data)
  },
  setWorkSpace (state, val) {
    return (state.workspace = val)
  },
  setProjectSettingType (state, type) {
    return (state.projectSettingType = type)
  },
  setPid (state, val) {
    return (state.pid = val)
  },
  setProjectId (state, val) {
    return (state.projectId = val)
  }
}
const actions = {
  // 第一次获取数据
  firstProjectData ({commit}) {
    let data = storage.get('projectData') || []
    let workspace = storage.get('workspace')

    if (data) {
      commit('concatProjectData', data)
    }
    // 如果存在workspace，就设置workspace得值，不存在，就显示设置工作空间界面
    if (workspace) {
      commit('setWorkSpace', workspace)
    } else {
      commit('setProjectSettingType', 0)
    }
  },
  // 添加项目数据
  addProjectData ({commit, dispatch, state}, obj) {
    return new Promise((resolve, reject) => {
      commit('addProjectData', obj)
      setTimeout(() => {
        dispatch('setData').then(() => {
          resolve(true)
        })
      }, 100)
    })
  },
  // 删除项目数据
  delProjectData ({commit, dispatch}, index) {
    return new Promise((resolve, reject) => {
      commit('delProjectData', index)
      setTimeout(() => {
        dispatch('setData').then(() => {
          resolve(true)
        })
      }, 100)
    })
  },
  // 设置workspace到localstroage
  setWorkSpace ({commit}, val) {
    commit('setWorkSpace', val)
    storage.set('workspace', val)
  },
  // 获取localstorage存储的项目数据
  getData () {
    return storage.get('projectData')
  },
  // 设置项目数据
  setData ({state}, val) {
    return new Promise((resolve, reject) => {
      storage.set('projectData', state.projectData)
      resolve()
    })
  }
}
export default{
  state,
  mutations,
  actions
}
