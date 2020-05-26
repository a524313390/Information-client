<template>
	<div>
		<el-button type="primary" @click="back" icon="el-icon-arrow-left">返回</el-button>
		<el-row>
			<el-col :span="8">
				<table width="100%" border="1" cellpadding="0" cellspacing="0" class="tables">
					<tr>
						<td>公司名称</td>
						<td>{{dataDetail.companyname}}</td>
					</tr>
					<tr>
						<td>认证类型</td>
						<td>{{dataDetail.mode}}</td>
					</tr>
					<tr>
						<td>姓名</td>
						<td>{{dataDetail.names}}</td>
					</tr>
					<tr>
						<td>部门</td>
						<td>{{dataDetail.bumen}}</td>
					</tr>
					<tr>
						<td>职位</td>
						<td>{{dataDetail.zhiwei}}</td>
					</tr>
					<tr>
						<td>手机号码</td>
						<td>{{dataDetail.phone}}</td>
					</tr>

				</table>
			</el-col>
			<el-col :span="16">
				<div class="grid-content bg-purple-light">
					<el-row :gutter="20">
						<el-col :span="10" v-for="item in dataDetail.surl" style="overflow: hidden;max-height: 680px;">
							<img :src="hostname+item" @click="showImage(item)" alt="" style="cursor: pointer" />
						</el-col>

						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-row>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="4" :offset="10">
				<div class="main" v-if="dataDetail.states==0">
					<el-button type="primary" @click="success">通过</el-button>
					<el-button type="danger" @click="showLi = true">拒绝</el-button>
				</div>
				<div v-else-if="dataDetail.states==1">
					<el-button type="info">已认证</el-button>
				</div>
				<div v-else-if="dataDetail.states==2">
					<el-button type="info">审核失败</el-button>
				</div>
				<div v-else>
					<el-button type="info">状态未知</el-button>
				</div>
			</el-col>

			<el-col :offset="6" :span="4">
				<el-button type="info" @click="prev">上一页</el-button>
				<el-button type="info" @click="next">下一页</el-button>
			</el-col>
		</el-row>

		<!--//拒绝理由弹框-->
	

		<el-dialog title="请选择拒绝理由" :visible.sync="showLi" width="30%" >
			<el-select v-model="value" placeholder="请选择" style="width: 100%;">
		    <el-option
		      v-for="item in liYouData"
		      :key="item._id"
		      :label="item.title"
		      :value="item.title">
		    </el-option>
		  </el-select>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="showLi = false">取 消</el-button>
		    <el-button type="primary" @click="sendSuccess">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import host from '../utils/getHost';
	export default {
		name: 'detailCompany',
		data() {
			return {
				dialogVisible: false,
				dialogImageUrl: '',
				liyouList: '',
				showLi:false,
				value:'',
				hostname:host()+'/',
			}
		},
		computed: {
			indexs() {
				return this.dataDetail.index
			},
			...mapGetters(['users'])
		},
		props: {
			dataDetail: {
				type: Object,
				default() {
					return {};
				}
			},
			liYouData: {
				type: Array
			}
		},

		mounted() {
			
		},
		methods: {
			back() {
				this.$emit('backs', false)
			},
			showImage(item) {
				this.dialogVisible = true;
				
				this.dialogImageUrl =this.hostname + item;
			},
			next() {
				this.$emit('next', this.indexs)
			},
			prev() {
				this.$emit('prev', this.indexs)
			},
			success() {
				this.$axios.post('/api/company/success', {
					sname: this.users.name,
					id: this.dataDetail._id
				}).then(res => {
					if(res.data.status == 0) {
						this.$emit('next', (this.indexs + 1))
					}
				})
			},
			sendSuccess(){
			
				if(this.value==''){
					this.$message.error('请选择拒绝理由')
					return false;
				}
				this.showLi = false
				this.$axios.post('/api/company/refuse',{
					id:this.dataDetail._id,
					opers:this.value,
					name:this.users.name,
				}).then(res=>{
					if(res.data.status==0){
						this.$message.success('拒绝成功');
						this.value='';
						this.$emit('next', (this.indexs + 1))
					}else{
						this.$message.error('拒绝失败，请重新尝试')
					}
				})
			},
		},
	}
</script>

<style>
	.tables {
		margin: 20px 0;
	}
	
	.el-dialog {
		width: 85%;
	}
</style>