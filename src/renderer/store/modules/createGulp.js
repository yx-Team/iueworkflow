import {storage} from '@/lib/utils'
const state = {
  projectData: []
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
  }
}
const actions = {
  firstProjectData ({commit}) {
    let data = storage.get('projectData')
    if (data) {
      return commit('concatProjectData', data)
    }
  },
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
  getData () {
    return storage.get('projectData')
  },
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
