//import axios from 'axios';
import { Message ,Loading } from 'element-ui';
import router from '../router';
import store from '../store.js';
// 请求拦截
let loading   

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中...',
      
    })
}

function endLoading() {   
	 //使用Element loading-close 方法
    loading.close()
}
axios.interceptors.request.use(config=>{
	  startLoading()
	  // 请求前的拦截 设置统一的headers
	
	  
	  // let token=store.getters.isAuth
	
	  if(localStorage.getItem("Admintokens")){
		  config.headers.Authorization=localStorage.getItem("Admintokens");
	  }
	return config;
},err=>{
	console.log(err)
	return Promise.reject(err);
})




axios.interceptors.response.use(response=>{
	endLoading();
	
	return response;
},error=>{
	//关闭加载
	endLoading()
	if (error.response) {
		
		//弹出错误信息
		Message.error(error.response.data.msg);
		//如果是401和404的话就跳转登陆页面
            if (error.response.status==401 || error.response.status==404 ) {
			//清除token信息
			localStorage.removeItem('Admintokens');
			router.push('/login')
                
                   
            }
        }
        return Promise.reject(error.response.data)
})
// 相应拦截

export default axios;