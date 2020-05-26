<template>
	<div>
		  
		  
		<!-- //新增 -->
		<el-dialog
		  title="新增信息"
		  :visible.sync="dialogVisible"
		  width="30%"
		  :before-close="handleClose">
		  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
		  <el-form-item label="管理员名">
		 			<el-input readonly :value="user.name"></el-input>
		 </el-form-item>
		  <el-form-item label="公司名称" prop="company">
			<el-input v-model="ruleForm.company"></el-input>
		  </el-form-item>
			<el-form-item label="职位" prop="zhiwei">
			<el-input v-model="ruleForm.zhiwei"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
			<el-input v-model="ruleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="部门" prop="depar">
			<el-input v-model="ruleForm.depar"></el-input>
			</el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
			<el-button @click="dialogVisible = false">取 消</el-button>
		  </el-form-item>
		</el-form>
		  
		</el-dialog>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default{
		name:'addData',
		props:{
			
			user:{
				type:Object,
				default:{}
			}
		},
		computed:{
			...mapGetters(['users'])
		},
		data(){
			return {
				dialogVisible:false,
				ruleForm:{
					company:'',
					name:'',
					zhiwei:'',
					depar:''
				},
				rules: {
				 name: [
				   { required: true, message: '请输入姓名', trigger: 'blur' },
				 ],
				  zhiwei: [
				    { required: true, message: '请输入职位', trigger: 'blur' },
				  ],
					company: [
					  { required: true, message: '请输入公司名称', trigger: 'blur' },
					],
					 depar: [
					  { required: true, message: '请输入部门', trigger: 'blur' },
					],
					
				}
			}
		},
		methods:{
			 submitForm(formName) {
			  this.$refs[formName].validate((valid) => {
			    if (valid) {
				    if(!this.ruleForm.shenname){
					    this.ruleForm.shenname=this.users.name;
				    }
				    this.$emit('addDatas',this.ruleForm)
				  console.log(this.ruleForm)
					
			    } else {
			      console.log('error submit!!');
			      return false;
			    }
			  });
			},
			handleClose(done) {
			 
			      done();
			   
			},
		}
	}
</script>

<style>
</style>
