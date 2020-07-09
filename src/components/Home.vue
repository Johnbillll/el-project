<template>
  <div class="home">
		<el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
	export default {
		name:'home',
		methods:{
			logout(){
				window.sessionStorage.clear()
				this.$router.push('/login')
				 this.$message.success('退出成功')
			}
			
		},
		data() {
			return {
				
			}
		}
	}
</script>


<style scoped>

</style>
