<template>
	

	<el-dialog
	  title="提示"
	  :visible.sync="dialogVisible"
	  width="30%"
	  :before-close="handleClose">
	   <el-select v-model="value" placeholder="请选择">
	    <el-option
		v-for="item in refDatas"
		:key="item.id"
		:label="item.id"
		:value="item.title">
	    </el-option>
	  </el-select>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="cancel">取 消</el-button>
	    <el-button type="primary" @click="sure">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default{
		name:'jujue',
		props:{
			refDatas:{
				type:Array,
				default:function(){
					return []
				}
			}
		},
		data(){
			return {
				 dialogVisible: false,
				 value:''
			}
		},
		methods:{
			 handleClose(done) {
			
				done();
			  
			},
			sure(){
				this.dialogVisible=true;
				this.$emit('suerData',this.value)
			},
			cancel(){
				this.dialogVisible=false;
				this.$emit('cancels',true)
			}
		}
	}
</script>

<style>
	.el-select{
		width: 100%;
	}
</style>
