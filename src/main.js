import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import axios from 'axios'
//配置请求的根路径,记住+s啊啊啊啊啊啊啊啊啊!！！！！！！！！！！！！！！！！
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'

//axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
	//console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
	
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

//全局注册表格树
Vue.component('tree-table',TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')




