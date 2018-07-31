<template>
    <div class="create-gulp page-move"
    v-loading="loading"
    element-loading-text="拼命解压中..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <i-header :title="title">
            <div class="back" @click="hideCreateGulp"><i class="el-icon-back"></i> 返回</div>
        </i-header>
		<div v-show="projectSettingType!=2">
			<div class="logo">
				<img src="../../assets/gulp-big-icon.png" alt="">
			</div>
			<div class="text" >
				<H1>Gulp Mini项目</H1>
				<H5>支持postss px2rem flexibel</H5>
			</div>
		</div>
        <!-- 工作空间 -->
        <div class="form" v-if="projectSettingType===0">
          <div class="form-item">
                <div class="label">工作空间</div>
                <div class="con">
                    <el-input disabled v-model="work.dir" placeholder="请选择工作空间目录"></el-input>
                    <div class="arrow" @click="opendir('work')"><i class="el-icon-arrow-down"></i></div>
                </div>
            </div>
            <div class="form-item">
                <div class="label">解压类型</div>
                <div class="con radio-con">
                    <el-radio v-model="work.type" label="手动">手动</el-radio>
                    <el-radio v-model="work.type" label="自动">自动（速度较慢）</el-radio>
                </div>
            </div>
            <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
        <!-- 项目设置 -->
        <div class="form" v-if="projectSettingType===1">
            <div class="form-item">
                <div class="label">项目目录</div>
                <div class="con">
                    <el-input disabled v-model="form.dir" placeholder="请选择项目目录"></el-input>
                    <div class="arrow" @click="opendir('project')"><i class="el-icon-arrow-down"></i></div>
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
            <el-button type="primary" @click="createFile">立即创建</el-button>
        </div>
        <!-- 项目配置 -->
        <div class="form project-setting" v-if="projectSettingType===2">
			<div class="line"></div>
          <div class="form-item">
                <div class="label">html压缩</div>
                <div class="con">
                    <el-switch
                      v-model="project.htmlmin"
                      active-color="#13ce66"
                      inactive-color="#999">
                    </el-switch>
                </div>
            </div>
			<div class="form-item">
                <div class="label">js压缩</div>
                <div class="con">
                    <el-switch
                      v-model="project.jsmin"
                      active-color="#13ce66"
                      inactive-color="#999">
                    </el-switch>
                </div>
            </div>
			<div class="form-item">
                <div class="label">css压缩</div>
                <div class="con">
                    <el-switch
                      v-model="project.cssmin"
                      active-color="#13ce66"
                      inactive-color="#999">
                    </el-switch>
                </div>
            </div>
			<div class="form-item">
                <div class="label">px2rem</div>
                <div class="con">
                    <el-switch
                      v-model="project.rem"
                      active-color="#13ce66"
                      inactive-color="#999">
                    </el-switch>
                </div>
            </div>
			<div class="line"></div>
			<div class="form-item multiple" v-show="project.jsmin">
                <div class="label">js压缩过滤</div>
                <div class="con">
                    <el-input type="textarea" v-model="project.jsfilter" :rows="2" placeholder="例如：!build/assets/js/lib/*.js"></el-input>
                </div>
            </div>
			<div class="form-item multiple">
              <div class="label">base64设置</div>
              <div class="con">
                  <el-input  v-model="project.base64" placeholder="例如：8000"></el-input>
              </div>
          </div>
			<div class="form-item save-btn">
				<el-button type="primary" @click="saveProject">保存</el-button>
			</div>
		
        </div>
    </div>
</template>

<script>
import iHeader from '@/components/Header/Header'
import projectDataTpl from './projectDataTpl'
import { mapState } from 'vuex'
import { tips, storage } from '@/lib/utils'
import code from '../../../main/utils/code'
import { shell, ipcRenderer } from 'electron'
const uuidv1 = require('uuid/v1')
export default {
  name: 'CreateGulp',
  data () {
    return {
      loading: false,
      title: '设置工作空间',
      work: {
        title: '设置工作空间',
        dir: '',
        type: '手动'
      },
      form: {
        title: '创建项目',
        id: '',
        dir: '',
        name: '',
        type: '1'
      },
      project: {
        title: '项目设置',
        path: '',
        htmlmin: true,
        jsmin: true,
        cssmin: true,
        rem: true,
        jsfilter: '',
        base64: 8000
      },

      config: {}
    }
  },
  computed: {
    ...mapState({
      projectData: state => state.createGulp.projectData,
      workspaceFlag: state => state.createGulp.workspaceFlag,
      workspace: state => state.createGulp.workspace || '',
      projectSettingType: state => state.createGulp.projectSettingType || 0
    })
  },
  watch: {
    workspaceFlag (val) {
      if (val === true) {
        this.work.dir = this.workspace
      }
    },
    projectSettingType: {
      handler: function (val) {
        switch (val) {
          case 0:
            this.title = this.work.title
            let workspace = storage.get('workspace')
            if (workspace.trim()) {
              this.work.dir = workspace
            }
            break
          case 1:
            this.title = this.form.title
            break
          case 2:
            this.title = this.project.title
            break
          default:
            this.title = ''
            break
        }
      },
      immediate: true
    }
  },
  mounted () {
    let _this = this
    ipcRenderer.on('notice', function (event, data) {
      switch (data.code) {
        case code.errorCode:
          tips(data.msg, 'warning')
          break
        case code.copySuccess:
          _this.toList(data.msg)
          break
        case code.copyNodeSuccess:
          _this.loading = false
          _this.$store.dispatch('setWorkSpace', _this.work.dir)

          if (data.type === '手动') {
            tips('请在工作空间解压node_module', 'warning')
            setTimeout(() => {
              shell.openItem(_this.work.dir)
            }, 500)
          } else if (data.type === '自动') {
          }
          if (_this.projectData.length) {
            _this.$router.push({ name: 'List' })
            _this.$store.commit('setShowCreate', false)
          }
          break
        case code.selectSuccess:
          _this.form.dir = data.path.toString()
          break
        case code.selectSpaceSuccess:
          _this.work.dir = data.path.toString()
          break
        case code.readConfigSuccess:
          let config = JSON.parse(data.config.data)
          console.log(config)
          _this.config = config
          _this.project.path = data.config.path

          _this.project.htmlmin = config.htmlminify.compress
          _this.project.jsmin = config.uglify.compress
          _this.project.cssmin = config.cleanCss.compress
          _this.project.rem = config.px2rem.open
          _this.project.jsfilter = JSON.stringify(config.uglify.filter)
          _this.project.base64 = config.cleanCss.base64.maxImageSize

          break
        case code.writeConfigSuccess:
          tips(data.msg)
          _this.$store.commit('setShowCreate', false)
          break
      }
    })
  },
  methods: {
    nextStep () {
      if (this.work.dir.trim() === '') {
        tips('工作空间不能为空！', 'warning')
        return false
      }
      this.loading = true
      ipcRenderer.send('copy-node-module', this.work)
    },
    createFile () {
      //   let stroageData = []
      if (this.form.dir.trim() === '') {
        tips('目录不能为空！', 'warning')
        return false
      }
      if (this.form.name.trim() === '') {
        tips('名称不能为空！', 'warning')
        return false
      }
      ipcRenderer.send('copy-file-unzip', this.form.dir)
    },
    toList (msg) {
      let _this = this
      _this.form.id = uuidv1()
      _this.$store.dispatch('addProjectData', _this.form).then(() => {
        tips(msg, 'success')
        _this.$router.push({ name: 'List' })
        setTimeout(() => {
          _this.form = Object.assign({}, projectDataTpl)
          _this.$store.commit('setShowCreate', false)
        }, 400)
      })
    },
    hideCreateGulp () {
      //   this.$store.commit('setWorkSpaceFlag', false)
      //   this.$store.commit('setProjectSettingType', 1)
      this.$store.commit('setShowCreate', false)
    },
    opendir (type) {
      ipcRenderer.send('open-file-dialog', type)
    },
    saveProject () {
      let config = `
        {
          "dev": {
            "baseDir": "src/",
            "less": "src/assets/less/",
            "css": "src/assets/css/",
            "images": "src/assets/images/",
            "js": "src/assets/js/",
            "html": "src/html/"
          },
          "build": {
            "baseDir": "build/",
            "css": "build/assets/css/",
            "images": "build/assets/images/",
            "js": "build/assets/js/",
            "html": "build/html/"
          },
          "htmlminify": {
            "compress": ${this.project.htmlmin}
          },
          "uglify": {
            "compress": ${this.project.jsmin},
            "filter": ["${JSON.parse(this.project.jsfilter)}"]
          },
          "babel": {
            "options": {
              "presets": ["env"]
            },
            "filter": ["!src/assets/js/lib/*.js"]
          },
          "cleanCss": {
            "compress": ${this.project.cssmin},
            "options": { "compatibility": "ie8" },
            "base64": {
              "maxImageSize": ${this.project.base64},
              "debug": true
            }
          },
          "autoprefixer": {
            "options": { "browsers": ["iOS >= 7","Android >= 4"] }
          },
          "px2rem": {
            "open": ${this.project.rem},
            "options": {
              "baseDpr": 2,
              "threeVersion": false,
              "remVersion": true,
              "remUnit": 75,
              "remPrecision": 6
            }
          },
          "zip": {
            "name": "minisite.zip"
          }
        }
`
      ipcRenderer.send('write-config', {
        path: this.project.path,
        data: config
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
  .text {
    text-align: center;
    h1 {
      font-size: 24px;

      color: #333333;
    }
    h5 {
      font-size: 12px;

      color: #999999;
    }
  }
  .form {
    padding: 35px 20px 0;
    &-item {
      display: flex;
      flex-direction: row;
      margin-bottom: 10px;
      box-sizing: border-box;
      .label {
        width: 70px;
        line-height: 32px;
        font-size: 15px;
        color: #333333;
      }
      .con {
        flex: 1;
        display: flex;
        flex-direction: row;
        &.radio-con {
          padding-top: 9px;
        }
      }
      .arrow {
        height: 30px;
        width: 30px;
        margin-left: 5px;
        text-align: center;
        line-height: 30px;
        border: 1px solid #dcdfe6;
      }
      .el-input__inner {
        flex: 1;
        height: 32px;
        line-height: 32px;
        font-family: "Microsoft YaHei", Helvetica, STHeiTi, Arial, sans-serif;
      }
    }
    .el-button {
      width: 100%;
    }
  }
  .project-setting {
    padding: 50px 0 0;
    .line {
      height: 10px;
      background: #e7e7e7;
    }
    .con {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .label {
      line-height: 50px;
    }
    .form-item {
      margin-bottom: 0;
      height: 50px;
      border-bottom: 1px solid #eee;
      padding: 0 20px;
      &.multiple {
        height: auto;
        flex-direction: column;
        border-bottom: none;
        .label {
          width: 100%;
        }
        .con {
          width: 100%;
          height: auto;
        }
      }
      &.save-btn {
        padding-top: 10px;
      }
    }
  }
}
</style>
