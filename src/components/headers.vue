<template>
	<header class="header">
		<el-row>
			<el-col :span="6" class="logo">
				<img src="../assets/images/logo.png" alt="" style="cursor: pointerw;" @click="changeMenu">
				<span>XX公司后台管理系统</span>
			</el-col>
			<el-col :span="6" :offset="12" class="user">
				<div class="userinfo">
					<img :src="users.avatar" alt="">
				</div>
				<div class="welcome">
					<el-dropdown @command="handleCommand">
						<p class="name avatar">{{users.name}}<i class="el-icon-arrow-down el-icon--right"></i></p>
						<el-dropdown-menu slot="dropdown">

							<el-dropdown-item command="info">个人信息</el-dropdown-item>
							<el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
							<el-dropdown-item command="logOut">退出登陆</el-dropdown-item>


						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-col>
		</el-row>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
				<el-form-item label="用户ID">
					<el-input readonly :value="users.id"></el-input>
				</el-form-item>
				<el-form-item label="用户名">
					<el-input readonly :value="users.name"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input readonly :value="users.email"></el-input>
				</el-form-item>
				<el-form-item label="用户身份">
					<el-input readonly :value="users.istatus==0?'管理员':'普通用户'"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">关闭</el-button>

			</span>
		</el-dialog>

		//修改密码
		<el-dialog title="提示" :visible.sync="pwdFlag" width="30%">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="原密码" prop="oldpwd">
					<el-input type="password" v-model="ruleForm.oldpwd"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>


			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="pwdFlag = false">取 消</el-button>
				<el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
	</header>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex';
	var bcrypt = require('bcryptjs');

	export default {
		name: 'headers',
		computed: {
			...mapGetters(['isAuth', 'users', 'menuFlag'])
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				dialogVisible: false,
				labelPosition: 'right',
				formLabelAlign: {
					name: '',
					region: '',
					type: ''
				},
				isCollapse: true,
				pwdFlag: false,
				ruleForm: {
					pass: '',
					checkPass: '',
					oldpwd: ''
				},
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					},{
						min:5,max:20,message:'密码长度5-20个字符',trigger:'blur'
					}],
					checkPass: [{
						validator: validatePass2,
						trigger: 'blur'
					},{
						min:5,max:20,message:'密码长度5-20个字符',trigger:'blur'
					}],
					oldpwd:[{
						required:true,message:'请输入原始密码',trigger:'blur'
					},{
						min:5,max:20,message:'密码长度5-20个字符',trigger:'blur'
					}],

				}
			}
		},
		methods: {
			...mapActions(['clearToken', 'setMenu']),
			handleCommand(command) {
				if (command == 'info') {
					this.showInfo();
					return;
				} else if (command == 'logOut') {
					this.logOut();
					return;
				} else if (command == 'updatePwd') {
					this.upPwd()
					return
				}
			},
			showInfo() {
				this.dialogVisible = true;

			},
			logOut() {
				this.clearToken();
				this.$message({
					message: '退出成功',
					type: 'success'
				})
				this.$router.push('/login')
			},
			handleClose(done) {

				done();

			},
			changeMenu() {

				this.setMenu(!this.menuFlag)

			},
			upPwd() {
				this.pwdFlag = true;
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//如果输入的新密码和原始密码一致，抛出错误
						if(this.ruleForm.oldpwd==this.ruleForm.checkPass){
							this.$message.error('新密码不能与旧密码一致');
							return;
						}
						this.ruleForm.id=this.users.id;
						console.log(this.ruleForm)
						this.$axios.post('/api/users/changepwd',this.ruleForm).then(res=>{
							if(res.data.status==0){
								this.pwdFlag=true;
								this.$message.success('密码修改成功，请重新登陆');
								localStorage.removeItem('Admintokens')
								this.$router.push('/login')
							}else{
								this.$message.error('原始密码不正确，请重新输入');
							}
						})
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
	.header {
		width: 100%;
		height: 100%;
		height: 60px;
		background: #324057;
		border-bottom: 1px solid #1f2d3d;


	}

	.el-row {
		height: 100%;
	}

	.logo {
		height: 100%;
		display: flex;
		align-items: center;
		color: #fff;
		padding-left: 30px;
		box-sizing: border-box;
	}

	.logo img {
		height: 80%;
		margin-right: 20px;
	}

	.user {
		display: flex;
		height: 100%;
		justify-content: flex-end;
		align-items: center;
		padding-right: 100px;
		box-sizing: border-box;
		color: #fff;
		font-size: 14px;
	}

	.userinfo {
		height: 60%;
		overflow: hidden;
	}

	.userinfo img {
		height: 100%;

		border-radius: 50%;
		margin-right: 20px;
	}

	.name {
		line-height: 20px;
		cursor: pointer;
		color: #fff;
	}
</style>
