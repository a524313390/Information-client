<template>

		<section class="from-container">
			<el-container>
			  <el-header><headers></headers></el-header>
			  <el-container>
				<el-aside :width="menuFlag?'80px':'200px'"><left-menu></left-menu></el-aside>
				<el-main>
					
					<keep-alive exclude="companylist">
						<router-view/>
					</keep-alive>
				</el-main>
			  </el-container>
			</el-container>
		</section>
	
</template>
<script>
	import headers from '../components/headers'
	import jwt_decode from 'jwt-decode';
	import {mapActions,mapGetters} from 'vuex';
	import leftMenu from '../components/left'
	
	export default{
		nam:"app",
		computed: {
			...mapGetters(['menuFlag'])
		},
		
		created(){
			let tokens=localStorage.Admintokens;
			
			if(tokens){
				let users=jwt_decode(tokens);
					this.setAuth(tokens)
					this.setUser(users);
			}else{
				this.$router.push('/login')
			}
		},
		methods:{
			...mapActions(['setAuth','setUser']),
		},
		components:{
			headers,
			leftMenu
		}
	}
</script>
<style scoped>
	.from-container{
		width: 100%;
		height: 100%;
	}
	.el-row{
		height: 100%;
	}
	.main{
		margin-top: 60px;
	}
	.el-header{
		padding: 0;
	}
	.el-container{
		min-height: 100%;
	}
	.mb{
		margin: 20px 0;
	}
</style>