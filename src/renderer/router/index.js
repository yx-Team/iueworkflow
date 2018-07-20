import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('@/pages/Home/Home')
const List = () => import('@/pages/Gulp/List')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        level: 1
      }
    },
    {
      path: '/list',
      name: 'List',
      component: List,
      meta: {
        level: 3
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
