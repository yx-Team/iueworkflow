import Vue from 'vue'
import {
  Scrollbar,
  Radio,
  Input,
  Button,
  Dialog,
  Message,
  MessageBox,
  Loading
} from 'element-ui'

Vue.use(Scrollbar)
Vue.use(Radio)
Vue.use(Input)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
