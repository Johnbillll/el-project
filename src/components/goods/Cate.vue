<template>
  <div class="cate">
	 <!-- 面包屑导航区域 -->
	 <el-breadcrumb separator-class="el-icon-arrow-right">
	   <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	   <el-breadcrumb-item>商品管理</el-breadcrumb-item>
	   <el-breadcrumb-item>商品分类</el-breadcrumb-item>	  
	 </el-breadcrumb>
	 
	<!-- 卡片视图区域 -->
	 <el-card>
		 <el-row>
			 <el-col>
				 <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
			 </el-col>
		 </el-row>
		 <!-- 表格 -->
		 <tree-table class="treeTable"
					 :data="cateList"
					 :columns="columns"
					 :selection-type="false"
					 :expand-type="false"
					 :show-index="true"
					 index-text="#"
					 border
					 :show-row-hover="false"> 
			 <!-- 是否有效 -->
			 <template slot="isok" slot-scope="scope">
					<i class="el-icon-success" 
					v-if="scope.row.cat_deleted === false"
					style="color:lightgreen"></i> 
					<i class="el-icon-error" v-else  style="color:red"></i>
			 </template>
			 <!-- 排序 -->
			 <template slot="order" slot-scope="scope">
				 <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
				 <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
				 <el-tag size="mini" type="warning" v-else>三级</el-tag>
			 </template>
			<!-- 操作 -->
			<template slot="opt" slot-scope="scope">
				<el-button size="mini" type="primary" icon = "el-icon-edit">编辑</el-button>
				<el-button size="mini" type="danger" icon = "el-icon-delete">删除</el-button>
			</template>
		 </tree-table>
		 <!-- 分页区域 -->
		  <el-pagination
		       @size-change="handleSizeChange"
		       @current-change="handleCurrentChange"
		       :current-page="queryInfo.pagenum"
		       :page-sizes="[ 3, 5, 10,15]"
		       :page-size="queryInfo.pagesize"
		       layout="total, sizes, prev, pager, next, jumper"
		       :total="total">
		     </el-pagination>
	 </el-card>
	<!-- 添加分类的对话框 -->

	<el-dialog
	  title="添加分类"
	  :visible.sync="addCartDialogVisible"
	  width="50%"
	  @close="addCateDialogClosed"
	  >	 
	  <!-- 添加内容的表单 -->
	 <el-form  :model="addCartForm" 
				:rules="addCartFormRules" 
				ref="addCartFormRef" 
				label-width="100px" 
				>
			<el-form-item label="分类名称:" prop="cat_name">
			  <el-input v-model="addCartForm.cat_name"></el-input>
			</el-form-item>
			<el-form-item label="父级分类" >
			 <el-cascader
			     v-model="selectedKeys"
			     :options="parentCateList"
			     :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
			     @change="parentCateChange"
				 :clearable="true"
				 :change-on-select="true"></el-cascader>
			</el-form-item>

		
	   </el-form>
	  <!-- 底部区 -->
	  <span slot="footer" class="dialog-footer">
			<el-button @click="addCartDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addCate">确 定</el-button>
	  </span>
	  </el-dialog>
  </div>
</template>

<script>
	export default {
		name:'cate',
		methods:{
			async getCateList(){
				const {data:res} = await this.$http.get('categories',{params : this.queryInfo})
				if(res.meta.status !== 200){
					return this.$message.error('请求商品分类失败')
				}
				
				//把数据列表保存在cateList中
				this.cateList = res.data.result
				
				//为总数据条数赋值
				this.total = res.data.total
				console.log(this.cateList)
				this.$message.success('请求商品分类成功')
			},
			//监听pagesize改变的事件
			handleSizeChange(newSize){
				this.queryInfo.pagesize= newSize
				this.getCateList()
			},
			//监听pagenum的改变
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
			},
			showAddCateDialog(){
				 this.getParentCateList()
				this.addCartDialogVisible = true
			},
			//获取父级分类的数据列表
			async getParentCateList(){
				const {data:res} = await this.$http.get('categories',{params :{type:2}})
				if(res.meta.status !== 200){
					return this.$message.error('获取父级分类数据列表失败')
				}
				this.parentCateList = res.data
				console.log(res.data)
				this.$message.success('获取父级分类列表数据成功')
			},
			//选择项发生变化触发这个函数
			parentCateChange(){
				console.log(this.selectedKeys)
			
				//如果selectKeys数组中的length大于0
				if(this.selectedKeys.length > 0){
					//父级分类的id
					this.addCartForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
					//为当前分类的等级赋值
					this.addCartForm.cat_level = this.selectedKeys.length
					return
				}
				else {
					//父级分类的id
					this.addCartForm.cat_pid = 0
					//为当前分类的等级赋值
					this.addCartForm.cat_level = 0
				}
			},
		
			addCate(){
				this.$refs.addCartFormRef.validate(async valid =>{
					
					if(!valid) return ;
					//发起添加分类的请求
				const {data:res} = await this.$http.post('categories',this.addCartForm)
				if(res.meta.status !== 201){
					return this.$message.error('添加分类失败！！')
				}
				this.$message.success('添加分类成功')		
				
				this.getCateList()
				//隐藏添加用户的对话框
				this.addCartDialogVisible = false
						
				})												
			},

			//监听对话框的关闭事件，重置内容
			
			addCateDialogClosed(){
				this.$refs.addCartFormRef.resetFields()
				this.selectedKeys = []
				this.addCartForm.cat_level = 0
				this.addCartForm.cat_pid = 0
			}
				
			
		},
		data() {
			return {
				//查询条件
				queryInfo:{
					type:3,
					pagenum:1,
					pagesize:5
				},
				//商品分类的数据列表，默认为空
				cateList:[],
				total:0,
				//为table指定列的定义
				columns:[
					{
						label:'分类名称',
						prop:'cat_name',
					},
					{
						label:'是否有效',
						//表示将当前列定义为模板列
						type:'template',
						//表示这一列使用的模板名称
						template:'isok'
					},
					{
						label:'排序',
						//表示将当前列定义为模板列
						type:'template',
						//表示这一列使用的模板名称
						template:'order'
					},
					{
						label:'操作',
						//表示将当前列定义为模板列
						type:'template',
						//表示这一列使用的模板名称
						template:'opt'
					},
				],
				//控制添加分类对话框的展示
				addCartDialogVisible:false,
				//添加分类的表单数据对象
				addCartForm:{
					//将要添加的分类的名称
					cat_name:'',
					cat_pid:0,
					cat_level:0
				},
				addCartFormRules:{
					cat_name:[{required:true,message:'请输入分类名称',trigger:'blur'}],
					
				},
				//父级商品分类的数据列表，默认为空
				parentCateList:[],
				//选中的父级分类的ID数组
				selectedKeys:[]
				
			}
		},
		created(){
			this.getCateList()
		}
	}
</script>


<style scoped>
 .treeTable{
	 margin-top:15px;
 }
 
 .el-cascader{
	 width:100%;
 }
</style>
