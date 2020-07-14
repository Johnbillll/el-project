<template>
 <div class="roles">
	 <!-- 面包屑导航区域 -->
	 <el-breadcrumb separator-class="el-icon-arrow-right">
		   <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		   <el-breadcrumb-item>角色列表</el-breadcrumb-item>	  
	 </el-breadcrumb>
	 <!-- 卡片视图 -->
	 <el-card>
		<!-- 添加角色按钮区域 -->
		<el-row>
			<el-col>
				<el-button type="primary" @click="addDialogVisible =true">添加角色</el-button>
			</el-col>			
		</el-row>
		<!-- 角色列表区域 -->
		<el-table :data="roleList" border stripe>
			<!-- 展开列 -->
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-row :class="['bdbottom',i1 === 0? 'bdtop' :'','vcenter']" 
							v-for="(item1,i1) in scope.row.children" 
							:key="item1.id"
							>
						<!-- 渲染一级权限 -->
						<el-col :span="5">
							<el-tag  :closable="true"
									 @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
							<i class="el-icon-caret-right"></i>
						</el-col>
						<!-- 渲染二级和三级权限 -->
						<el-col :span="19">
							<!-- 通过for循环嵌套渲染二级权限 -->							
							<el-row :class="[i2 === 0? '' :'bdtop','vcenter']"
									v-for="(item2,i2) in item1.children" 
									:key="item2.id">
								<el-col :span="6">
									<el-tag type="success"  :closable="true"
											@close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
									<i class="el-icon-caret-right"></i>									
								</el-col>
								<!-- 三级权限 -->
								<el-col :span="18">									
									<el-tag type="warning" 
											:class="[i3 === 0? '' :'bdtop']"
											v-for="(item3,i3) in item2.children" 
											:key="item3.id" :closable="true"
											@close="removeRightById(scope.row,item3.id)">
										{{item3.authName}}
									</el-tag>
								</el-col>
							</el-row>							
														
						</el-col>
						
					</el-row>
					<!-- <pre>
						{{scope.row}}
					</pre> -->
				</template>
			</el-table-column>
			<!-- 索引列 -->
			<el-table-column type="index"></el-table-column>
			<el-table-column label = "角色名称" prop="roleName"></el-table-column>
			<el-table-column label = "角色描述" prop="roleDesc"></el-table-column>
			<el-table-column label = "操作" width="300px">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" 
							   icon="el-icon-edit" 
							   @click="showEditDialog(scope.row.id)">编辑</el-button>
					<el-button size="mini" type="danger"
							   icon="el-icon-delete"  
							   @click="removeRoleById(scope.row.id)">删除</el-button>
					<el-button size="mini" type="warning" 
							   icon="el-icon-setting" 
							   @click="showSetRightDialog(scope.row)">分配权限</el-button>
				</template>
			</el-table-column>			
		</el-table>		
	 </el-card>
	<!-- 添加角色的对话框 -->
	<el-dialog
	  title="添加角色"
	  :visible.sync="addDialogVisible"
	  width="50%"
	  @close="addDialogClosed"
	  >	 
	  <!-- 内容主体区 -->
	 <el-form  :model="addRoles" 
				:rules="addRoleRules" 
				ref="addRoleRef" 
				label-width="80px" 
				>
			<el-form-item label="角色名称" prop="roleName">
			  <el-input v-model="addRoles.roleName"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDesc">
			  <el-input v-model="addRoles.roleDesc"></el-input>
			</el-form-item>			
	   </el-form>
	
	  <!-- 底部区 -->
	  <span slot="footer" class="dialog-footer">
			<el-button @click="addDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addRole">确 定</el-button>
	  </span>
	</el-dialog>
	<!-- 编辑角色的对话框 -->
	<el-dialog
		  title="修改角色"
		  :visible.sync="editDialogVisible"
		  width="50%"
		  >
		  <el-form  :model="editRoles"
		  				:rules="editRoleRules" 
		  				ref="editRoleRef" 
		  				label-width="80px"
						@close="editDialogClosed"
		  				>
		  			<el-form-item label="角色名称" prop="roleName">
		  			  <el-input v-model="editRoles.roleName"></el-input>
		  			</el-form-item>
		  			<el-form-item label="角色描述" prop="roleDesc">
		  			  <el-input v-model="editRoles.roleDesc"></el-input>
		  			</el-form-item>			
		    </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editRole">确 定</el-button>
		  </span>
	</el-dialog> 
	<!-- 添加权限的对话框 -->
	<el-dialog
	  title="提示"
	  :visible.sync="setRightDialogVisible"
	  width="50%"
	  @close="setRightDialogClosed">
	  <el-tree :data="rightsList" 
			   :props="treeProps" 
			   :show-checkbox="true"
			   node-key="id"
			   :default-expand-all="true"
			   :default-checked-keys="defKeys"
			   ref="treeRef">
	  </el-tree>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="setRightDialogVisible = false">取 消</el-button>
	    <el-button type="primary" @click="allotRights">确 定</el-button>
	  </span>
	</el-dialog>
 </div>
</template>

<script>
	export default {
		name:'roles',
		methods:{
			async getRolesList(){
				const {data:res} = await this.$http.get('roles')
				if(res.meta.status !==200){
					return this.$message.error('获取角色列表失败！')				
				}
				this.roleList = res.data
				this.$message.success('获取角色列表成功')
				//console.log(this.roleList)
				},
				//重置表格内容
				addDialogClosed(){
					this.$refs.addRoleRef.resetFields()
				},
			addRole(){
					this.$refs.addRoleRef.validate(async valid =>{
						
						if(!valid) return ;
						//发起添加用户的请求
					const{data:res} =await this.$http.post('roles',this.addRoles)
					if(res.meta.status !== 201){
						return this.$message.error('添加角色失败')
					}
					this.$message.success('添加角色成功')		
					//隐藏添加角色的对话框
					this.addDialogVisible = false
					//重新获取角色列表数据
					this.getRolesList()
					})
			},
			async showEditDialog(id){				
				 console.log(id)
				const{data:res} =  await	this.$http.get('roles/' + id)
				if(res.meta.status!==200)
				return this.$message.error('查询用户信息失败')
				
				this.editRoles = res.data
				this.editDialogVisible = true;
			},
			editDialogClosed(){
				this.$refs.editRoleRef.resetFields()
			},
			editRole(){
					this.$refs.editRoleRef.validate(async valid =>{
						
					if(!valid) return ;
					//发起修改角色的请求
					const{data:res} = await this.$http.put('roles/' + this.editRoles.roleId,{
						roleName:this.editRoles.roleName,
						roleDesc:this.editRoles.roleDesc						
					})					
					if(res.meta.status !== 200){
						console.log(this.editRoles.roleDesc)
						return this.$message.error('修改角色失败')
					}
					this.$message.success('修改角色成功')		
					//隐藏修改用户的对话框
					this.editDialogVisible = false
					//重新获取角色列表数据
					this.getRolesList()		
					})
			},
			//根据id删除对应的用户信息
			async	removeRoleById(id)	{
				//弹框询问是否需要删除
				const confirmResult =await  this.$confirm('此操作将永久删除该角色, 是否继续?',
				 '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
							}).catch(err => err)
				//如果用户点击确定，返回一个confirm字符串
				//如果用户取消删除，则返回cancel字符串		
					console.log(confirmResult)
				if(confirmResult !=='confirm'){
					return this.$message.info('已经取消删除')
				}
				
				const {data:res} = await this.$http.delete('roles/' + id)
				if(res.meta.status !== 200){
					return this.$message.error('删除用户失败')
				}
				
				this.$message.success('删除用户成功！')
				this.getRolesList()
			},
			//根据id删除对应的权限
			async removeRightById(role,rightId){
				//弹框提示用户是否要删除
				const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err=>err)
				if(confirmResult !== 'confirm'){
					return this.$message.info('取消了删除')
				}
				//console.log('确认删除！！')
				const {data:res} =await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status!==200){
					return this.$message.error('删除权限失败')
				}
				//this.getRolesList()
				//不关闭新展开的栏
				role.children = res.data
				this.$message.success('删除权限成功')
			},
			async showSetRightDialog(role){
				//获取所有权限的数据
				this.roleId = role.id
				const {data:res} = await this.$http.get('rights/tree')
				if(res.meta.status !== 200){
					return this.$message.error('获取权限数据失败')
				}
				//获取到的权限数据
				this.rightsList = res.data
				this.$message.success('获取权限数据成功')
				//递归获取三级节点的id
				this.getLeafKeys(role,this.defKeys)				
				this.setRightDialogVisible=true
			},
			//通过递归的形式，获取第三级权限的id，并保存到defKeys 数据中
			getLeafKeys(node,arr){
				//如果当前节点不包含node属性，则是三级节点
				if(!node.children){
					return arr.push(node.id)
					console.log('我已经结束了？？？')
				}				
				node.children.forEach(item =>{
					this.getLeafKeys(item,arr)
				})
			},
			//监听分配权限对话框关闭的事件
			setRightDialogClosed(){
				this.defKeys = []
			},
			//点击为角色分配权限
			async allotRights(){
				//拿到半选中和全选中的id
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				
				const idStr = keys.join(',')
				const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
				
				if(res.meta.status!==200){
					return this.$message.error('分配权限失败')
				}
				 this.$message.success('分配权限成功')
				 this.getRolesList()
				 this.setRightDialogVisible =false
			}
		},
		data() {
			return {
			//所有角色列表数据
				roleList:[],
				//展示添加角色的对话框
				addDialogVisible:false,
				//添加角色的表单数据
				addRoles:{
					roleName:'',
					roleDesc:''
				},
				//添加表单的验证规则对象
				addRoleRules:{
					roleName:[
							{required :true,message:'请输入角色名',trigger:'blur'},
							{min: 1, max: 10, message:'输入的角色名在1~10个字符之间',trigger:'blur'},					
							],
					 roleDesc:[{required :false,message:'请输入角色描述',trigger:'blur'}]		
				},
				//展示修改角色的对话框
				editDialogVisible:false	,
				editRoles:{
					roleName:'',
					roleDesc:'',
					roleId:''
				},
				editRoleRules:{
					roleName:[
							{required :true,message:'请输入角色名',trigger:'blur'},
							{min: 1, max: 10, message:'输入的角色名在1~10个字符之间',trigger:'blur'},					
							],
					 roleDesc:[{required :false,message:'请输入角色描述',trigger:'blur'}]		
				},
				
				setRightDialogVisible:false,
				//所有权限
				rightsList:[],
				//树形绑定的对象
				treeProps:{
					label:'authName',
					children:'children'
				},
				defKeys:[],
				//即将分配权限的id
				roleId:''
			}
		},
		created(){
			this.getRolesList()
			//console.log('Roles created')
		},
		destroyed(){
			//console.log('Roles destroyed')
		}
		
	}
</script>


<style scoped>
  .el-tag{
	  margin:7px;
  }
  
  .bdtop{
	  border-top:1px solid #eee;
  }
  
  .bdbottom{
	  border-bottom:1px solid #eee;
  }
  
  .vcenter {
	  display: flex;
	  align-items: center;
  }
</style>
