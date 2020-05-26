<template>
	<div>
		<el-button type="primary" @click="dialogVisible = true" size="small">新增拒绝理由</el-button>

		<!-- //新增 -->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="管理员名" prop="name">
					<el-input readonly v-model="users.name"></el-input>
				</el-form-item>
				<el-form-item label="拒绝理由" prop="title">
					<el-input v-model="ruleForm.title"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="dialogVisible = false">取 消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>
		<!-- 修改 -->

		<el-dialog title="修改信息" :visible.sync="update" width="30%" :before-close="handleClose">
			<el-form :model="updateData" status-icon :rules="rules" ref="updateData" label-width="100px" class="demo-ruleForm">
				<el-form-item label="管理员名" prop="name">
					<el-input readonly v-model="users.name"></el-input>
				</el-form-item>
				<el-form-item label="拒绝理由" prop="title">
					<el-input v-model="updateData.title"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitFormUpdate('updateData')">提交</el-button>
					<el-button @click="update = false">取 消</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>






		<el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column property="uids" label="uids" width="200">

			</el-table-column>
			<el-table-column property="date" label="日期" width="200">
				<template slot-scope="scope">{{ scope.row.date|fromTime }}</template>
			</el-table-column>
			<el-table-column property="name" label="添加者姓名" width="120">
			</el-table-column>
			<el-table-column property="title" label="拒绝理由">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>

		</el-table>
		<el-pagination background @current-change="changePage" layout="prev, pager, next" :total="total">
		</el-pagination>
	</div>

</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				tableData: [],
				page: 0,
				pageSize: 10,
				total: 0,
				dialogVisible: false,
				update: false,
				ruleForm: {

					title: ''
				},
				updateData: {},
				oldDate: {},
				rules: {

					liyou: [{
						required: true,
						message: '请输入拒绝理由',
						trigger: 'blur'
					}, ]
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

			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
			},
			handleCurrentChange(val) {
				this.currentRow = val;
			},
			handleEdit(index, row) {
				this.update = true;

				this.updateData = Object.assign({}, row);
				this.oldDate = row.title;
				console.log(this.oldDate)
			},
			handleDelete(index, row) {
				if (this.users.istatus != 0) {
					this.$message.error('没有权限操作')
					return false;
				} else {
					this.$confirm('是否删除该条数据?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$axios.get('/api/infoli/delete', {
							params: {
								_id: row._id
							}
						}).then(res => {
							if (res.data.status == 0) {
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								this.getList();
							} else {
								this.$message({
									type: 'error',
									message: '删除失败!'
								});
							}
						})

					}).catch(() => {

					});
				}

			},
			getList() {
				this.$axios.get('/api/infoli', {
					params: {
						page: this.page,
						pageSize: this.pageSize
					}
				}).then(res => {
					if (res.data.status == 0) {
						this.tableData = res.data.result.docs;
						this.total = res.data.result.total;
					}
				}).catch(error => {
					console.log(error)
				})
			},
			changePage(index) {
				this.page = index;
				this.getList();
			},
			handleClose(done) {

				done();

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {

						this.ruleForm.name = this.users.name;
						this.$axios.post('/api/infoli/add', this.ruleForm).then(res => {
							if (res.data.status == 0) {
								this.dialogVisible = false
								this.$message({
									message: '添加成功',
									type: 'success'
								})
								this.getList();
							} else {
								this.$message({
									message: '添加失败',
									type: '接口出错'
								})
							}
						})

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			submitFormUpdate(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {

						if (this.updateData.title != this.oldDate) {

							this.$axios.post('/api/infoli/update', this.updateData).then(infos => {

								if (infos.data.status == 0) {
									this.update = false;
									this.$message({
										message: '修改成功',
										type: 'success'
									})
									this.getList()
								}
							}).catch(error => {
								console.log(error)
							})
						} else {
							console.log(this.updateData)
							console.log(this.oldDate)
						}

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		}
	}
</script>

<style scoped>
	.el-pagination {
		float: right;
		margin-top: 30px;
	}
</style>
