<template>
    <div class="create-gulp page-move">
        <i-header>
            <div class="back" @click="hideCreateGulp"><i class="el-icon-back"></i> 返回</div>
        </i-header>
        <div class="logo">
            <img src="../../assets/gulp-big-icon.png" alt="">
        </div>
        <div class="text">
            <H1>Gulp Mini项目</H1>
            <H5>支持postss px2rem flexibel</H5>
        </div>
        <div class="form">
            <div class="form-item">
                <div class="label">项目目录</div>
                <div class="con">
                    <el-input disabled v-model="form.dir" placeholder="请选择项目目录"></el-input>
                    <div class="arrow" @click="opendir"><i class="el-icon-arrow-down"></i></div>
                </div>
            </div>
            <div class="form-item">
                <div class="label">项目名称</div>
                <div class="con">
                    <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
                </div>
            </div>
            <div class="form-item">
                <div class="label">项目类型</div>
                <div class="con radio-con">
                    <el-radio v-model="form.type" label="1">移动端</el-radio>
                    <el-radio v-model="form.type" label="2">PC端</el-radio>
                </div>
            </div>
            <el-button type="primary" @click="toList">立即创建</el-button>
        </div>
    </div>
</template>

<script>
import iHeader from '@/components/Header/Header'
// import {storage} from '@/lib/utils'
import projectDataTpl from './projectDataTpl'
import {mapState} from 'vuex'
const ipc = require('electron').ipcRenderer

export default {
  name: 'CreateGulp',
  data () {
    return {
      form: {
        dir: '',
        name: '',
        type: '1'
      }
    }
  },
  computed: {
    ...mapState({
      'projectData': state => state.createGulp.projectData
    })
  },
  mounted () {
    let _this = this
    ipc.on('selected-directory', function (event, path) {
      _this.form.dir = path.toString()
    })
  },
  methods: {
    toList () {
      let _this = this
      //   let stroageData = []
      if (this.form.dir.trim() === '') {
        this.tips('目录不能为空！')
        return false
      }
      if (this.form.name.trim() === '') {
        this.tips('名称不能为空！')
        return false
      }
      this.$store.dispatch('addProjectData', this.form).then(() => {
        _this.tips('添加成功！')
        _this.$router.push({name: 'List'})
        setTimeout(() => {
        // 清空form数据
          _this.form = Object.assign({}, projectDataTpl)
          _this.$store.commit('setShowCreate', false)
        }, 400)
      })
    },
    hideCreateGulp () {
      this.$store.commit('setShowCreate', false)
    },
    opendir () {
      ipc.send('open-file-dialog')
    },
    tips (val) {
      this.$message({
        message: val,
        type: 'warning',
        customClass: 'iue-message-tips',
        center: true
      })
    }
  },
  components: {
    iHeader
  }
}
</script>

<style lang="less">
.create-gulp {
  .logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    margin: 110px auto 30px;
    background-color: #3999ff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.13);
    border-radius: 2px;
    img {
        display: block;
      width: 12px;
      height: 27px;
    }
  }
  .text{
      text-align: center;
      H1{
          font-size: 24px;
            
            color: #333333;
      }
      h5{
          font-size: 12px;
	
	color: #999999;
      }
  }
  .form{
      padding:35px 20px 0;
      &-item{
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          box-sizing: border-box;
          .label{
              width: 70px;
              line-height: 32px;
              font-size: 15px;
	          color: #333333;
          }
          .con{
              flex:1;
              display: flex;
              flex-direction: row;
              &.radio-con{
                  padding-top: 9px;
              }
          }
          .arrow{
              height: 30px;
              width: 30px;
              margin-left: 5px;
              text-align: center;
              line-height: 30px;
              border:1px solid #dcdfe6;
          }
          .el-input__inner{
              flex: 1;
              height: 32px;
              line-height: 32px;
              font-family: "Microsoft YaHei", Helvetica, STHeiTi, Arial, sans-serif;
          }
      }
      .el-button{
          width: 100%
      }
  }
}
</style>
