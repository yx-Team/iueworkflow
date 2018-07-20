const state = {
  showCreate: false
}
const mutations = {
  setShowCreate (state, val) {
    return (state.showCreate = val)
  }
}
export default{
  state,
  mutations
}
