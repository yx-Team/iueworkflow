<template>
    <div class="gulp-list page-move"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <i-header>
            <router-link tag="div" :to="{name:'Home'}" class="back"><i class="el-icon-back"></i> 返回</router-link>
        </i-header>
        <div class="search">
            <el-input
                placeholder="请输入项目名称"
                prefix-icon="el-icon-search"
                clearable
                v-model="search">
            </el-input>
        </div>
        <el-scrollbar style="height:467px;">
            <div class="list">
                <div class="list-item" :class="{'is-active':projectId===item.id}" v-for="(item,index) in searchList" :key="index">
                    <div class="list-item-top">
                        <a v-if="projectId===item.id" :class="{'open':projectId===item.id}" href="javascript:;" @click="stop(item)">
                            <i class="el-icon-loading"></i>
                            <span>运行中</span>
                        </a>
                        <a v-else href="javascript:;" @click="run(item)">
                            <i class="el-icon-caret-right"></i>
                            <span>运行</span>
                        </a>
                        <a href="javascript:;" @click="build(item)">
                            <i class="el-icon-sort"></i>
                            <span>压缩</span>
                        </a>
                        <a href="javascript:;" @click="zip(item)">
                            <i class="el-icon-menu"></i>
                            <span>打包</span>
                        </a>
                    </div>
                    <div class="list-item-bottom">
                        <h2>{{item.name}}</h2>
                        <p :title="item.dir">{{item.dir}}</p>
                        <div class="tool">
                            <el-button size="mini" title="删除" @click="del(index)"><i class="el-icon-delete"></i></el-button>
                            <el-button size="mini" title="打开目录" @click="open(item.dir)"><i class="el-icon-view"></i></el-button>
                            <el-button size="mini" title="项目设置" @click="handleSetting(item)"><i class="el-icon-setting"></i></el-button>
                        </div>
                    </div>
                </div>
                <div class="list-item add-item" @click="handleCreateGulp" v-if="!search.length && listCount<4">
                    <i class="el-icon-circle-plus-outline"></i>
                    <span>新增项目</span>
                </div>
            </div>
            <div class="search-tips" v-if="search.length>0 && searchList.length===0">
                <i-abnor height="400px">没有搜到相关项目</i-abnor>
            </div>
        </el-scrollbar>
        <div class="fixed-btn" @click="handleCreateGulp" v-if="listCount>3" title="新增项目">
            <i class="el-icon-plus"></i>
        </div>
        <div class="fixed-btn fixed-btn-setting" @click="handleWorkspace" title="设置工作空间">
            <i class="el-icon-setting"></i>
        </div>
    </div>
</template>

<script>

import iHeader from '@/components/Header/Header'
import iAbnor from '@/components/Abnor/Abnor'
import {mapState} from 'vuex'
import {shell, ipcRenderer} from 'electron'
import code from '../../../main/utils/code'
import {Confirm, tips} from '@/lib/utils'
export default {
  name: 'List',
  data () {
    return {
      loading: false,
      loadingText: '',
      search: '',
      searchList: []
    //   listAcitve: ''
    }
  },
  watch: {
    search (val, oldval) {
      if (!val) {
        this.searchList = this.list
      }

      if (val !== oldval) {
        var searchArr = this.list.filter(item => {
          return item.name.split(this.search).length > 1
        })
        return (this.searchList = searchArr)
      }
    },
    list (val) {
      this.searchList = val
    }
  },
  computed: {
    ...mapState({
      'list': state => state.createGulp.projectData,
      'listCount': state => state.createGulp.projectData.length,
      'pid': state => state.createGulp.pid,
      'projectId': state => state.createGulp.projectId
    })
  },
  created () {
    // 加载strage的数据
    this.$store.dispatch('firstProjectData')
  },
  mounted () {
    var _this = this
    ipcRenderer.on('notice', (event, data) => {
      switch (data.code) {
        case code.serverSuccess:
          _this.loading = false
          _this.loadingText = ''
          // 监听子进程pid
          _this.$store.commit('setPid', data.pid)
          tips(data.msg)
          break
        case code.buildSuccess:
        case code.zipSuccess:
          _this.loading = false
          _this.loadingText = ''
          tips(data.msg)
          break
        case code.killSuccess:
        //   _this.pid = -1
          break
      }
    })
    ipcRenderer.on('log', (event, data) => {
      console.log(data.msg)
    })
  },
  methods: {
    handleCreateGulp () {
      this.$store.commit('setShowCreate', true)
      this.$store.commit('setProjectSettingType', 1)
    },
    handleWorkspace () {
      this.$store.commit('setShowCreate', true)
      this.$store.commit('setProjectSettingType', 0)
    },
    handleSetting (item) {
      this.$store.commit('setShowCreate', true)
      this.$store.commit('setProjectSettingType', 2)
      ipcRenderer.send('read-config', item.dir + '\\config.json')
    },
    run (item) {
      this.kill()
      this.loading = true
      this.loadingText = '运行中...'
      this.$store.commit('setProjectId', item.id)
      let obj = {dir: item.dir, workspace: this.$store.state.createGulp.workspace}
      ipcRenderer.send('run-gulp-server', obj)
    },
    stop (item) {
      this.kill()
    },
    build (item) {
      this.kill()
      this.loading = true
      this.loadingText = '压缩中...'
      let obj = {dir: item.dir, workspace: this.$store.state.createGulp.workspace}
      ipcRenderer.send('run-gulp-build', obj)
    },
    zip (item) {
      this.kill()
      this.loading = true
      this.loadingText = '打包中...'
      let obj = {dir: item.dir, workspace: this.$store.state.createGulp.workspace}
      ipcRenderer.send('run-gulp-zip', obj)
    },
    del (index) {
      Confirm('此项目将被删除，是否继续', () => {
        this.kill()
        this.$store.dispatch('delProjectData', index)
      })
    //   this.$confirm('此项目将被删除，是否继续', '提示', {
    //     customClass: 'iue-confirm',
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.kill()
    //     this.$store.dispatch('delProjectData', index)
    //   })
    },

    kill () {
      let pid = this.pid
      if (pid > 0) {
        ipcRenderer.send('kill', pid)
        this.$store.commit('setPid', -1)
      }
      this.$store.commit('setProjectId', '')
    },
    open (path) {
      // 打开文件夹
      shell.openItem(path)
    }
  },
  components: {
    iHeader,
    iAbnor
  }
}
</script>

<style lang="less">
.gulp-list{
    padding-top: 50px;
    .el-scrollbar__wrap{
        overflow: hidden;
        overflow-y: auto;
    }
    .search{
        padding: 0 20px;
        .el-input__inner{
            height: 35px;
            background-color: #f8f8f8;
            border-radius: 17px;
            border: solid 0px #eeeeee;
            font-family: "Microsoft YaHei", Helvetica, STHeiTi, Arial, sans-serif;
            font-size: 14px;
        }
        .el-input__icon{
            line-height: 30px;
        }
    }
    .el-scrollbar__view{
        padding: 0 17px 0 0;
    }
    .list{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        box-sizing: border-box;
        padding:10px 20px;
        justify-content: space-between;
        overflow: hidden;
        width: 375px;
        &-item{
            width: 155px;
            height: 180px;
            background-color: #43cc99;
            box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.15);
            border-radius: 2px;
            margin-bottom: 20px;
            
            &.is-active{
                background-color: #3999ff;
                .open{
                    i{
                        border-radius: 50%;
                        background-color: #ffffff;
                        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
                        color: #43cc99;
                        font-size: 16px;
                    }
                }
            }
            &-top{
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                height: 110px;
                
                a{
                    display: block;
                    font-size: 12px;
                    color: #fff;
                    width: 40px;
                    text-align: center;
                    text-decoration: none;
                    i{
                        display: block;
                        width: 26px;
                        height: 26px;
                        line-height: 26px;
                        background-color: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        margin: 0 auto;
                        transition: all .3s;
                    }
                    span{
                        font-size: 10px;
                        color: #ffffff;
                    }
                    &:hover{
                        i{
                            border-radius: 50%;
                            background-color: #ffffff;
                            box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
                            color: #43cc99;
                            font-size: 16px;
                        }
                    }
                }
            }
            &-bottom{
                height: 70px;
                background-color: #ffffff;
                box-sizing: border-box;
                padding: 8px 10px;
                
                h2{
                    padding: 0;
                    margin: 0;
                    font-size: 12px;
                    color: #545454;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                p{
                    font-size: 8px;
                    color: #545454;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    padding: 5px 0;
                }
                .tool{
                    display: flex;
                    flex-direction: row;
                }
                .el-button--mini{
                    padding:0 2px 2px;
                    display: block;
                    margin-left: 0;
                    margin-right: 5px;
                    i{
                        font-size: 8px;
                    }
                }
            }
        }
        .list-item.add-item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 155px;
            height: 180px;
            background-color: #ffffff;
            box-shadow: 0px 3px 8px 0px 
                rgba(0, 0, 0, 0.15);
            border-radius: 2px;
            cursor:pointer;
            transition: all .3s;
            &:hover{
                background: rgba(67,204,153,1);
                i,span {
                    color:#fff;
                }
            }
            i{
                font-size: 32px;
                color: #e0e0e0;
            }
            span{
                padding-top: 10px;
                font-size: 14px;
                color: #999999;
            }
        }
    }
    .fixed-btn{
        position: fixed;
        z-index: 99;
        right: 20px;
        bottom: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background-color: #3999ff;
        box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.3);
        transition: all .3s;
        cursor: pointer;
        &-setting{
            background: #545454;
            bottom: 70px;
        }
        &:hover{
            transform: scale(1.2);
            i{
                transform:rotate(180deg);
            }
        }
        i{
            text-align: center;
            color: #fff;
            transition: all .3s;
        }
    }
}
</style>

