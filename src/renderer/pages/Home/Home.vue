<template>
    <div class="home page-move">
        <i-header>
        </i-header>
        <div class="logo"><img src="../../assets/logo.png" alt="" srcset=""></div>
        <div class="desc">一个高效的前端开发工作流工具</div>
        <div class="project">
            <div class="project-item" @click="showCreateGulp">
                <div class="project-icon"><img src="../../assets/gulp-icon.png" alt=""></div>
                <div class="project-name">Gulp Mini项目</div>
                <div class="project-desc">mini活动、专题</div>
            </div>
             <div class="project-item">
                <div class="project-icon"><img src="../../assets/avatar-icon.png" alt=""></div>
                <div class="project-name">用户中心</div>
                <div class="project-desc">收藏夹/各种工具</div>
            </div>
        </div>
        <div class="version">当前iue版本：<span>{{version}}</span></div>
    </div>
    
</template>

<script>
import iHeader from '@/components/Header/Header'
import {storage} from '@/lib/utils'
export default {
  name: 'Home',
  data () {
    return {
      version: require('../../../../package.json').version
    }
  },
  methods: {

    showCreateGulp () {
      if (storage.get('projectData')) {
        this.$router.push({name: 'List'})
        return
      }
      this.$store.commit('setShowCreate', true)
    }
  },
  components: {
    iHeader
  }
}
</script>

<style lang="less">
    .home{
        background: #fff;
        padding-top: 100px;
        .logo{
            width: 124px;
            margin: 0 auto 25px;
            
            img{
                display: block;
                width: 100%;
            }
        }
        .desc{
            font-size: 20px;
            color: #545454;
            text-align: center;
            
        }
        .project{
            display: flex;
            flex-direction: row;
            justify-content: center;
            padding-top: 100px;
            &-item{
                width: 150px;
                height: 150px;
                padding: 15px 20px;
                box-sizing: border-box;
                background: #3999ff;
                color: #fff;
                font-size: 14px;
                border-radius: 4px;
                cursor: pointer;
                transition: all .3s;
                &:hover{
                    box-shadow: 0 0 20px rgba(57,153,255,0.8)
                }
                &:last-child{
                    margin-left: 10px;
                    background: #43cc99;
                    &:hover{
                        box-shadow: 0 0 20px rgba(67,204,153,0.8)
                    }
                }
            }
            &-icon{
                width: 20px;
                height: 28px;
                margin-bottom: 45px;
                img{
                    display: block;
                    width: 100%;
                }
            }
            &-name{
                font-weight: bold;
            }   
            &-desc{
                opacity: 0.6;
            }
        }
        .version{
            padding-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #333;
            span{
                color: #3999ff;
            }
        }
    }
</style>
