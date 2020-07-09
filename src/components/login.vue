<template>
  <div class="login_container">
	<div class="login_box">
	<!-- 	头像区 -->
		<div class="avatar_box">
			<img src="../assets/logo.png" alt="">
		</div>
	<!-- 登录表单区域 -->
	<el-form  label-width="0px" 
			  class="login_form" 
			  :model="loginForm" 
			  :rules="loginFormRules"
			  ref="loginFormRef">
	<!-- 	username -->
	  <el-form-item prop="username">
	    <el-input prefix-icon="el-icon-user" class="" v-model="loginForm.username"></el-input>
	  </el-form-item>
	 <!-- password -->
	  <el-form-item prop="password">
	    <el-input  prefix-icon="el-icon-search" v-model="loginForm.password"
		type="password"></el-input>
	  </el-form-item>
	  <!-- button -->
	  <el-form-item class="btns">
	    <el-button type="primary" @click="login">登录</el-button>
		<el-button type="info" @click="resetLoginForm">重置</el-button>
	</el-form-item>
	</el-form>
	</div>
  </div>
</template>

<script>
	export default {
		// const Qs = require('qs')
		
		// info = Qs.stringify(info)
		name:'login',
		// methods:{
		// 	resetLoginForm(){
		// 		 this.$refs.loginFormRef.resetFields();
				
		// 	},
		// 	login(){
		// 		this.$refs.loginFormRef.validate(async valid =>{
		// 			if(!valid) return;					
		// 			//console.log('发起请求');
		// 			console.log(this.loginForm)
		// 			const { data:res } = await this.$http.post("login",this.loginForm);
		// 			// if(res.meta.status !== 200) return console.log('登录失败')
		// 			// console.log('登录成功')
		// 		})
		// 	}
			
		// },
		  methods: {
		    // 表单重置按钮
		    resetLoginForm () {
		      // console.log(this)
		      // resetFields：element-ui提供的表单方法
		      this.$refs.loginFormRef.resetFields()
		    },
		    login () {
		      // 表单预验证
		      // valid：bool类型
		      this.$refs.loginFormRef.validate(async valid => {
		        // console.log(valid)
		        if (!valid) return false
		        // this.$http.post('login', this.loginForm): 返回值为promise
		        // 返回值为promise，可加await简化操作 相应的也要加async
		        const { data: res } = await this.$http.post('login', this.loginForm)
		         console.log(res)
		        if (res.meta.status !== 200) return this.$message.error('登录失败')
		         this.$message.success('登录成功')
		        // // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
		        // //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
		        // //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
		         window.sessionStorage.setItem('token', res.data.token)
				
		        // // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
		         this.$router.push('/home')
				
		      })
		    }
		  },
		data() {
			return {
				//这是登录表单的数据绑定对象
				loginForm:{
					username:'admin',
					password:'123456'
				},
				
				//表单验证规则对象
				loginFormRules:{
					//验证用户名是否合法
					username:[{required: true, message: '请输入登录用户名', trigger: 'blur' },
							  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
							],
					//验证密码是否合法
					password:[{required: true, message: '请输入登录密码', trigger: 'blur' },
							  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
				}
			}
		}
	}
</script>


<style lang="less" scoped>
	.login_container{
		background-color: #2b4b6b;
		height:100%;
	}
	.login_box{
		width:450px;
		height:300px;
		background-color: #fff;
		border-radius: 3px;
		position:absolute;
		left:50%;
		top:50%;
		transform: translate(-50%,-50%);
	}
	
	.avatar_box{
		height:130px;
		width:130px;
		border:1px solid #eee;
		border-radius: 50%;
		padding:10px;
		box-shadow: 0 0 10px #ddd;
		position:absolute;
		left:50%;
		transform: translate(-50%,-50%);
		background-color: #fff;
		img{
			height:100%;
			width:100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}

	.btns{
		display: flex;
		justify-content:flex-end ;
	}
	
	.login_form{
		position:absolute;
		bottom:0;
		width:100%;
		padding:0 20px;
		box-sizing: border-box;
	}
</style>
