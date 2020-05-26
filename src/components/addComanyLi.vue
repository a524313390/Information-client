<template>
	<div>
		<el-button type="primary" @click="dialogVisible = true">新增企业认证拒绝理由</el-button>
		<!--新增-->

		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-form :model="addInfo" status-icon :rules="rules" ref="addInfo" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="pass">
					<el-input type="text" :value="users.name" readonly autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="理由" prop="title">
					<el-input type="text" v-model="addInfo.title" autocomplete="off"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('addInfo')">确 定</el-button>
		  </span>
		</el-dialog>

		<!--编辑-->
		<el-dialog title="提示" :visible.sync="editFlag" width="30%">
			<el-form :model="editInfo" status-icon :rules="rules" ref="editInfo" label-width="100px" class="demo-ruleForm">
				<el-form-item label="用户名" prop="pass">
					<el-input type="text" :value="users.name" readonly autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="理由" prop="title">
					<el-input type="text" v-model="editInfo.title" autocomplete="off"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="editFlag = false">取 消</el-button>
		    <el-button type="primary" @click="editForm('editInfo')">确 定</el-button>
		  </span>
		</el-dialog>

		<el-table :data="tableData" stripe style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column prop="uid" label="uid" width="180">
			</el-table-column>
			<el-table-column prop="date" label="日期" width="180">
				<template slot-scope="scope">{{ scope.row.date|fromTime }}</template>
			</el-table-column>
			<el-table-column prop="name" label="添加者" width="180">
			</el-table-column>
			<el-table-column prop="title" label="企业认证拒绝理由">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background layout="prev, pager, next" @current-change="changePage" :page-size="pageSize" :total="total">
		</el-pagination>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		name: 'addCompanyLi',
		data() {
			return {
				page: 1,
				pageSize: 10,
				tableData: [],
				total: 0,
				dialogVisible: false,
				editFlag: false,
				addInfo: {

					title: ''
				},
				editInfo: {
					title: ''
				},
				rules: {
					name: [{
						required: true,
						msg: '请输入姓名',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						msg: '请输入拒绝理由',
						trigger: 'blur'
					}],

				}
			}
		},
		computed: {
			...mapGetters(['users'])
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.$axios.get('/api/companys', {
					params: {
						page: this.page,
						pageSize: this.pageSize
					}
				}).then(res => {
					if(res.data.status == 0) {
						this.tableData = res.data.result.docs;
						console.log()
						this.total = res.data.result.total
					}
				})
			},
			handleEdit(index, row) {
				console.log(index, row);
				this.editInfo.id=row._id;
				this.editInfo.title=row.title;
				this.editFlag = true;
			},
			handleDelete(index, row) {
				if(this.users.istatus!=0){
					this.$message.error('没有权限操作');
					return false;
				}
				this.$confirm('是否删除此条数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.$axios.get('/api/companys/delete', {
						params: {
							id: row._id
						}
					}).then(res => {

						if(res.data.staus == 0) {
							this.$message.success('删除成功')
							this.getList();
						} else {
							this.$message.success('删除失败')
						}
					})
				}).catch((err) => {
					this.$message.success(err + '删除失败')
				});
			},
			changePage(index) {
				this.page = index;
				this.getList()
			},
			handleClose(done) {
				done();
			},
			submitForm(formName) {
				//				
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.addInfo.name = this.users.name;
						this.$axios.post('/api/companys/add', this.addInfo).then(res => {

							if(res.data.status == 0) {
								this.dialogVisible = false;
								this.$message.success('添加成功');
								this.getList();
							} else {
								this.$message.error('添加失败');
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			editForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.editInfo.name = this.users.name;
						console.log(this.editInfo)
						this.$axios.post('/api/companys/update', this.editInfo).then(res => {

							if(res.data.status == 0) {
								this.editFlag = false;
								this.$message.success('修改成功');
								this.getList();
							} else {
								this.$message.error('修改失败');
							}
						})
					}else{
						
						console.log('error submit!!');
						return false;
					
					}
				})
			}
		}
	}
</script>

<style>
	.el-pagination {
		float: right;
		margin: 20px 0;
	}
</style>