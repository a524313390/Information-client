<template>

	<div>
		<el-row>
			<el-col :span="12">
				<v-chart :options="polar" />
			</el-col>
			<el-col :span="12">
				<v-chart :options="companyPolar" />
			</el-col>
		</el-row>


	</div>
</template>

<script>
	import 'echarts/lib/chart/pie'
	import echarts from 'vue-echarts'
	
	let arr = [];
	//不规范饼状图表配置
	var option = {

		title: {
			text: '不规范个人信息统计',
			left: 'left',
			textStyle: {
				color: '#000'
			}
		},

		legend: {
			bottom: 10,

		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		series: [{
			name: '不规范个人信息',
			type: 'pie',
			radius: '65%',
			center: ['50%', '50%'],
			selectedMode: 'single',
			data: [
			],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	//公司信息认证图表配置
	var companyOption = {
		backgroundColor: '#2c343c',

		title: {
			text: '企业认证信息处理',
			left: 'left',
			top: 20,
			textStyle: {
				color: '#fff'
			}
		},

		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},

		
		series: [{
			name: '企业认证信息处理',
			type: 'pie',
			radius: '55%',
			center: ['50%', '50%'],
			data: [

			],
			roseType: 'radius',
			label: {
				normal: {
					textStyle: {
						color: 'rgba(255, 255, 255, 0.3)'
					}
				}
			},
			labelLine: {
				normal: {
					lineStyle: {
						color: 'rgba(255, 255, 255, 0.3)'
					},
					smooth: 0.2,
					length: 10,
					length2: 20
				}
			},
			itemStyle: {
				normal: {
					color: '#c23531',
					shadowBlur: 200,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			},

			animationType: 'scale',
			animationEasing: 'elasticOut',
			animationDelay: function(idx) {
				return Math.random() * 200;
			}
		}]
	};
	export default {
		components: {
			'v-chart': echarts
		},
		data() {
			return {
				polar: option,
				companyPolar: companyOption,
				arrList: [],
				companyData: []
			}
		},
		watch: {
			arrList(newVal, oldVal) {
				option.series[0].data = newVal
			},
			companyData(newVal, oldVal) {
					
				companyOption.series[0].data=newVal
				
			}
		},
		created() {
			this.getPeoInfo();
			this.getCompany();
		},
		methods: {
			getPeoInfo() {
				this.$axios.get('/api/info').then(res => {
					if (res.data.status == 0) {
						let data = res.data.result;
						data.forEach(item => {
							if (item._id == 0) {
								this.arrList.push({
									value: item.total_num,
									name: '已审核'
								})
							} else if (item._id == 1) {
								this.arrList.push({
									value: item.total_num,
									name: '未处理'
								})
							} else if (item._id == 3) {
								this.arrList.push({
									value: item.total_num,
									name: '已拒绝'
								})
							}
						})

					}
				}).catch(error => {
					this.$message.error('error')
				})
			},
			getCompany() {
				this.$axios.get('/api/company').then(res => {
					if (res.data.status == 0) {
						let datas = res.data.result;

						datas.forEach(item => {
							if (item._id == 0) {
								this.companyData.push({
									value: item.total_num,
									name: '未认证'
								})
							} else if (item._id == 1) {
								this.companyData.push({
									value: item.total_num,
									name: '已认证'
								})
							} else if (item._id == 2) {
								this.companyData.push({
									value: item.total_num,
									name: '认证失败'
								})
							}
						})


					}
				}).catch(error => {
					this.$message.error(error)
				})
			},
		}
	}
</script>

<style>

</style>
