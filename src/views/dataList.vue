<template>
 <div>
	
		<el-button type="primary"  @click="adopt" size="small">批量通过</el-button>
		<el-button type="danger"  @click="refuse" size="small">批量拒绝</el-button>
		<el-button type="primary"  v-if="users.istatus==0" @click="$refs.childData.dialogVisible = true" size="small">新增信息</el-button>
		<el-button type="danger" v-if="users.istatus==0"  @click="deletes" size="small">批量删除</el-button>
		<el-button type="primary"  @click="seeAll" size="small">全部</el-button>
		<el-button type="primary"  @click="see" size="small">查看已审核</el-button>
		<el-button type="danger" @click="getList"  size="small">查看未审核</el-button>
		<el-button type="danger" @click="refuSee"  size="small">查看已拒绝</el-button>
		<add-data  ref="childData" :user="users" @addDatas="addInfo" ></add-data>
		
	  <el-table
	   ref="multipleTable"
	   :data="tableData"
	   tooltip-effect="dark"
	     @selection-change="handleSelectionChange"
	   style="width: 100%">
	   <el-table-column key="3"    v-if="!showModel"
	     type="selection"
	     width="55">
	   </el-table-column>
	   <el-table-column
	    prop="uid"
	    label="UID"
		 sortable
	    width="120">
	  </el-table-column>
	   <el-table-column
	  
	     label="日期"
	     width="200">
	     <template slot-scope="scope">{{ scope.row.date|fromTime }}</template>
	   </el-table-column>
	   <el-table-column
	     prop="company"
	     label="公司名称"
	     width="120">
	   </el-table-column>
	   <el-table-column
	     prop="depar"
	     label="部门"
	     show-overflow-tooltip>
	   </el-table-column>
	    <el-table-column
	     prop="name"
	     label="姓名"
	     width="120">
	   </el-table-column>
	   <el-table-column
	     prop="zhiwei"
	     label="职位"
	     
	     show-overflow-tooltip>
	   </el-table-column>
	    <el-table-column
	     prop="company"
	     label="公司名称"
	     width="120">
	   </el-table-column>
	   <el-table-column
	     prop="state"
	     v-if="showModel"
	     label="审核状态"
	     key="1"
	    >
	     <template  slot-scope="scope">
		     <el-button type="success"  size="mini"  plain v-if="scope.row.state==0">已审核</el-button>
			  <el-button type="info"  size="mini"  plain v-if="scope.row.state==1">未处理</el-button>
			  <el-button type="warning"  size="mini"  plain v-if="scope.row.state==3">{{scope.row.operation}}</el-button>
		    
	     </template>
	   </el-table-column>
	  <el-table-column label="操作" key="2"  v-if="!showModel">
		<template slot-scope="scope">
				<el-button
				   size="mini" 
				   @click="handleTong(scope.$index, scope.row)">通过</el-button>
				<el-button
				   size="mini"
				   type="danger"
				   @click="handleRef(scope.$index, scope.row)">拒绝</el-button>
				   <!-- 拒绝理由	 -->
				   <refuses v-if="refData.length>0" @cancels="cancels" :refDatas="refData" ref="refuseFlag" @suerData="refuseVal"></refuses>

		</template>
	
    </el-table-column>
	 </el-table>
	<el-pagination
  background
  @current-change="change"
  layout="prev, pager, next"
  :total="total">
</el-pagination>
 </div>
</template>

<script>
import {mapGetters} from 'vuex'
import addData from '../components/addInfoData'
import refuses from  '../components/jujue'
  export default {
	  name:'infoList',
		computed:{
			...mapGetters(['users'])
		},
    data() {
      return {
		tableData: [],
		multipleSelection: [],
		dialogVisible:false,
		total:0,
		page:0,
		pageSize:10,
		dagFlag:false,
		adoptData:[],
		istatus:1,
		refData:'',
		juData:[],
		showModel:false,
		
				
      }
    },
	created(){
		this.getInfo();
		this.refuseData();
	},
	components:{
		addData,
		refuses
	},
    methods: {
      //查看已审核
	see(){
		this.page=0;
		this.istatus=0;
		this.showModel=true;
		this.getInfo();
	},
	//查看全部
	seeAll(){
		
		
		this.showModel=true;
		this.istatus=null;
		this.getInfo();
	},
	// 查看未审核
	getList(){
		
		this.showModel=false;
		this.istatus=1;
		this.getInfo();
	},
	//查看拒绝
	refuSee(){
		
		this.showModel=true;
		this.istatus=3;
		this.getInfo();
	},
	  getInfo(){
		
		  this.$axios.get('/api/info',{
			  params:{
				  page:this.page,
				  pageSize:this.pageSize,
				  istatus:this.istatus
			  }
		  }).then(res=>{
			 
			  if(res.data.status==0){
				  this.total=res.data.result.total
				  this.tableData=res.data.result.docs
			  }else{
				  this.$message({
					  mseeage:'接口出错',
					  type:'error'
				  })
			  }
		  })
	  },
	// 单个通过	 
	  handleTong(index,row){
		this.adoptData=row._id;
		this.adopt();
		  console.log(index,row)
	  },
	  //单个拒绝
	  handleRef(index,row){
		 this.adoptData=row;
		  console.log(this.$refs.refuseFlag.dialogVisible)
		 this.$refs.refuseFlag.dialogVisible=true;
		
		  console.log(index,row)
	  },
	  //拒绝
	  notRefuse(){
		  this.$axios.post('/api/info/refuse',{
			 id: this.adoptData,
			 shenname:this.users.name,
			 operation:this.refusVal
		  }).then(res=>{
			  if(res.data.status==0){
				  this.$message({
					  type:'success',
					  message:'拒绝成功'
				  })
				  this.adoptData=[];
				  this.getInfo();
			  }else{
				  this.$message({
				  				  type:'error',
				  				  message:err+'接口出错'
				  })
			  }
		  }).catch(err=>{
			  this.$message({
				  type:'error',
				  message:err+'接口出错'
			  })
		  })
	  },
	  change(index){
		  this.page=index;
		  this.getInfo();
	  },
	  addInfo(obj){
		 console.log()
		  this.$axios.post('/api/info/add',obj).then(res=>{
			  console.log(res)
			  if(res.data.status==0){
				  this.$refs.childData.dialogVisible=false
				  this.$message({
					  message:'添加成功',
					  type:'success'
				  });
				 this.$refs.childData.ruleForm={};
				   this.getInfo();
			  }else{
				   this.$message({
				  	 message:'添加失败',
				  	 type:'error'
				  });
			  }
		  })
	  },
	  // 点击批量拒绝
	  refuse(){
		  let data=this.adoptData;
		 
		 if(data.length==0){
			this.$message('请选择信息')
		 } else{
			 this.$refs.refuseFlag.dialogVisible=true;
			
		 }
	  },
	  refuseVal(val){
		  let data= this.adoptData;
		  let userName=this.users.name;
		  if(val==''){
			  this.$message({
				  type:'error',
				  message:'请选择拒绝理由'
			  })
			  return;
		  }
		   this.$refs.refuseFlag.dialogVisible=false;
		   this.refusVal=val
		  
// 判断点击了确定拒绝理由后是批量拒绝，还是单个拒绝
// 			
// 		   if( data.length){
// 			   //批量拒绝
// 			
// 			 data.forEach(item=>{
// 				if(!item.operation){
// 					item.operation=val;
// 				}
// 			 })
// 		   }else{
// 			   
// 			   // 单个拒绝
// 			   data.operation=val;
// 			   data.shenname=userName;
// 		   }
		 
		
		  this.notRefuse();
	  },
	  // 通过
	  adopt(){
		if(this.adoptData.length==0){
			 this.$message({
				type:'error',
				message:'请选择信息'
			})
			return;
		}
		  this.$axios.post('/api/info/adopt',{
			  id:this.adoptData,
			  shenname:this.users.name
		  }).then(res=>{
			 if(res.data.status==0){
				 this.$message({
					 type:'success',
					 message:'操作成功'
				 })
				 this.adoptData=[];
				 this.getInfo();
			 }else{
				  this.$message({
				 		type:'error',
				 		message:'操作失败'
				 })
			 }
		  })
	  },
	  // 批量删除
	  deletes(){
		  
	  },
	  //选择的信息
	  handleSelectionChange(arr){
		  this.adoptData=[];
		 let data=this.adoptData
		  if(arr.length>0){
			  arr.forEach(item=>{
			  	data.push({_id:item._id,shenname:this.users.name});
			  })
		  }else{
			this.adoptData=[];
			return
		  }
		
		 
		
	  },
	//请求拒绝理由
	refuseData(){
		this.$axios.get('/api/infoli/').then(res=>{
			if(res.data.status==0){
				this.refData=res.data.result
				
				
			}else{
				this.$message(res.data.msg+'请求出错')
			}
			
		})
	},
	 // 点击了取消选择理由的按钮
	 cancels(val){
		 if(val){
			 this.adoptData=[];
		 }
	 }
    }
  }
</script>
<style scoped>
	.el-pagination{
		float: right;
		margin-top: 50px;
	}
</style>