<template> 
  <el-container class="home-container">
	
		<!-- 头部区域 -->
    <el-header>
		<div class="left">
			<img src="../assets/img/dnf.jpg" alt="">
			<span>电商后台管理系统</span>
		</div>
		<el-button type="info" @click="logout">退出</el-button>
	</el-header>
		<!-- 页面主题区 -->
    <el-container>
		<!-- 侧边栏 -->
	
      <el-aside :width="isCollapse ? '64px':'200px'" >
		  <div class="toggle-button" @click="toggleCollapse" >|||</div>
		  <!-- 侧边栏菜单区域 -->
		   <el-menu	background-color="#333744"
		        text-color="#fff"
		        active-text-color="#409EFF"
				:unique-opened="true"
				:collapse="isCollapse"
				:collapse-transition="false"
				:router="true"
				:default-active="activePath"
				>
				<!-- 一级菜单 -->
		        <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
					<!-- 一级菜单的模板区域 -->
		          <template slot="title">
					 <!-- 图标 -->
					
		            <i :class="iconsObj[item.id]"></i>
					<!-- 文本 -->
		            <span>{{item.authName}}</span>
		          </template>
				  
				 <!-- 二级菜单 -->
		         <el-menu-item :index="'/' + subItem.path " 
								v-for="subItem in item.children" 
								:key="subItem.id"
								@click="saveNavState('/' + subItem.path)">
					 <template slot="title">
						<!-- 图标 -->
					   <i class="el-icon-menu"></i>
						<!-- 文本 -->
					   <span>{{subItem.authName}}</span>
					 </template>
				 </el-menu-item>
		          
		        </el-submenu>		       
		      </el-menu>
	  </el-aside>
	    <!-- 右侧内容主体 -->
      <el-main>
		  <!-- 一个路由占位符 -->
		  <router-view></router-view>
	  </el-main>
    </el-container>
  </el-container>
</template>

<script>


	export default {
		name:'home',
		methods:{
			logout(){
				window.sessionStorage.clear()
				this.$router.push('/login')
				 this.$message.success('退出成功')
			},
			async getMenuList(){
			const {data:res} =await this.$http.get('menus')
			if(res.meta.status !== 200)
			return this.$message.error(res.meta.msg)
			
			this.menulist = res.data
			// console.log(res)
			},
			toggleCollapse(){
				this.isCollapse = !this.isCollapse

			},
			saveNavState(activePath){
			  window.sessionStorage.setItem('activePath',activePath)
			  this.activePath = activePath
			}
			// getMenuList(){
			// 	this.$http.get('menus')
			// }.then{
			// 	const {data:res} = await this.$http.get('menus')
			// 	console.log(res)
			// }
			
		},
		data() {
			return {
				//左侧菜单数据
				menulist:[],
				iconsObj:{
					'125':'iconfont icon-user',
					'103':'iconfont icon-tijikongjian',
					'102':'iconfont icon-shangpin',
					'101':'iconfont icon-danju',
					'145':'iconfont icon-baobiao'					
				},
				//是否折叠
				isCollapse:false,
				
				//被激活的地址
				activePath:''
				
			}
		},
		created(){
			this.getMenuList()
			this.activePath  = window.sessionStorage.getItem('activePath')
		}
	}
</script>


<style scoped>
  .home-container{
	  height:100%;
  }
  .el-header{
	  background-color: #373D41;
	  display: flex;
	  justify-content: space-between;
	  padding-left:0;
	  align-items: center;
	  color:#fff;
	  font-size:20px;
  }
  .left {
	  display: flex;
	  align-items: center;
  }
  
  .left img{
  	  width:96.5px;    /*193 / 116*/
  	  height:58px;
      opacity: 0.5;
	  margin-right: 15px;
  }
  
  .el-aside{
	  background-color: #333744;
  }
  
  .el-main {
	  background-color: #EAEDF1;
  }
  
  .iconfont{
	  margin-right: 10px;;
  }
  
  .el-menu{
	  border:none;
  }
  .toggle-button{
	  background-color: #4A5064;
	  font-size: 10px;
	  line-height:24px;
	  text-align: center;
	  letter-spacing: 0.2em;
	  color:#fff;
	  cursor:pointer ;
  }

</style>
