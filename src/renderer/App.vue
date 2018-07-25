<template>
  <div class="app">
    
    <transition :name="page">
        <router-view></router-view>
    </transition>
    <div class="page-move-top" :class="{'is-active':showCreate}">
        <create-gulp></create-gulp>
    </div>
  </div>
</template>

<script>
import CreateGulp from './pages/Gulp/CreateGulp'
import {mapState} from 'vuex'
export default {
  name: 'iue',
  data () {
    return {
      page: ''
    }
  },
  computed: {
    ...mapState({
      'showCreate': state => state.global.showCreate
    })
  },
  watch: {
    $route (to, from) {
      // 第一次进入，不执行动画
      if (from.name === null) {
        this.page = ''
        return false
      }
      if (to.meta.level < from.meta.level) {
        this.page = 'page-right'
        return false
      } else {
        this.page = 'page-left'
        return false
      }
    }
  },
  components: {
    CreateGulp
  }
}
</script>

<style lang='less'>
html,body,#app,.app{
 height: 100%;
 overflow: hidden;
}
// left
.page-left-enter{
  opacity: 0;
  transform: translate3d(100%,0,0);
}
.page-left-enter-active,.page-left-leave-active{
  transition: all .3s;
}
.page-left-enter-to{
  opacity: 1;
  transform: translate3d(0,0,0);
}

.page-left-leave{
  opacity: 1;
  transform: translate3d(0,0,0);
}
.page-left-leave-to{
  opacity: 0;
  transform: translate3d(-100%,0,0);
}

// right
.page-right-enter{
  opacity: 0;
  transform: translate3d(-100%,0,0);
}
.page-right-enter-active,.page-right-leave-active{
  transition: all .3s;
}
.page-right-enter-to{
  opacity: 1;
  transform: translate3d(0,0,0);
}
.page-right-leave{
  opacity: 1;
  transform: translate3d(0,0,0);
}
.page-right-leave-to{
  opacity: 0;
  transform: translate3d(100%,0,0);
}

// top
.page-top-enter,.page-top-leave-to{
  opacity: 0;
  transform: translate3d(0,100%,0);
}
.page-top-enter-active,.page-top-leave-active{
  transition: all .3s;
}
.page-top-enter-to,.page-top-leave{
  opacity: 1;
  transform: translate3d(0,0,0);
}
// bottom
.page-bottom-enter,.page-bottom-leave-to{
  opacity: 0;
  transform: translate3d(0,100%,0);
}
.page-bottom-enter-active,.page-bottom-leave-active{
  transition: all .3s;
}
.page-bottom-enter-to,.page-bottom-leave{
  opacity: 1;
  transform: translate3d(0,0,0);
}
</style>
