import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

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


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
