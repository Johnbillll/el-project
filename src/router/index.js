import Vue from 'vue'
import VueRouter from 'vue-router'


// import Login from '../components/login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/rights.vue'
// import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

//解决连续点击同一个路由报错问题
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

//换成路由懒加载模式
const Login =() => import('../components/login.vue')
const Home =() => import('../components/Home.vue')
const Welcome =() => import('../components/Welcome.vue')
const Users =() => import('../components/user/Users.vue')
const Rights =() =>import('../components/power/rights.vue')
const Roles =() => import('../components/power/Roles.vue')	
const Cate =() => import('../components/goods/Cate.vue')
const Params=() => import('../components/goods/Params.vue')
const List =() => import('../components/goods/List.vue')
const Add =() => import('../components/goods/Add.vue')
	
  const routes = [
	  {
		  path:'/',
		  redirect:'/login'
	  },
	  {
		  path:'/login',
		  component:Login
	  },
	  {
		  path:'/home',
		  component:Home,
		  redirect:'/welcome',
		  children:[
			 {
			  path:'/welcome',
			  component:Welcome
			},
			{
			  path:'/users',
			  component:Users
			},
			{
			  path:'/rights',
			  component:Rights
			},
			{
			  path:'/roles',
			  component:Roles
			},
			{
				path:'/categories',
				component:Cate
			},
			{
				path:'/params',
				component:Params
			},
			{
				path:'/goods',
				component:List,				
			},
			{
				path:'/goods/add',
				component:Add
			}
			]
	  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=> {
	// to 将要访问的路径
	// from 代表从哪个路径跳转而来
	//next是一个函数，表示放行
	
	if(to.path === '/login') return next();
	//获取token
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('./login')
	next()
})

export default router
