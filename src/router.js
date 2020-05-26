//import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
import store from './store'
import { mapGetters } from 'vuex'
import jwt_decode from "jwt-decode";
Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			redirect: '/home',
			hidden: true,
			component: () => import('./views/index.vue'),
			children: [
				{
					path: 'home',
					icon: 'fa-money',
					name: '首页',
					hidden: true,
					meta: {
						title: '首页',
						istatus: 2,

					},
					component: () => import('./views/home.vue'),

				},
			]

		},
		{
			path: '/home',
			icon: 'fa-money',
			name: '首页',
			hidden: true,
			meta: {
				title: '首页',
				istatus: 2,
				auth: [0, 1]
			},
			component: () => import('./views/home.vue'),

		},
		{
			path: '/guifan',
			icon: 'fa-asterisk',
			name: '不规范个人信息',
			component: () => import('./views/index.vue'),
			meta: {
				title: '不规范个人信息',
				istatus: 1,
				auth: [0, 1]
			},
			children: [
				{
					path: 'info',
					name: '不规范个人信息处理',
					component: () => import('./views/dataList.vue'),
					meta: {
						title: '不规范个人信息处理',
						istatus: 1,
						auth: [0, 1]
					}
				},
				{
					path: 'liyou',
					name: '添加拒绝理由',
					component: () => import('./views/liyou.vue'),
					meta: {
						title: '添加拒绝理由',
						istatus: 0,
						auth: [0]
					},
				},
			]
		},
		{
			path: '/renzheng',
			name: '企业认证信息处理',
			component: () => import('./views/index.vue'),
			meta: {
				title: '企业认证信息处理',
				istatus: 1,
				auth: [0, 1]
			},
			children: [
				{
					path: 'company',
					name: '企业认证信息处理',
					component: () => import('./views/company.vue'),
					meta: {
						title: '企业认证信息处理',
						istatus: 1,
						auth: [0, 1]
					},
				},
				{
					path: 'companys',
					name: '添加企业认证拒绝理由',
					component: () => import('./components/addComanyLi.vue'),
					meta: {
						title: '添加企业认证拒绝理由',
						istatus: 0,
						auth: [0]
					},
				},
				{
					path: 'addCompany',
					component: () => import('./views/addCompany.vue'),
					name: '添加企业认证信息',
					meta: {
						title: '添加企业认证信息',
						istatus: 0,
						auth: [0]
					},
				},
			]
		},


		{
			path: '/admins',
			icon: 'ss',
			name: '管理员',
			redirect: '/admins/index',
			component: () => import('./views/index.vue'),
			meta: {
				title: '管理员',
				istatus: 0,

			},
			children: [
				{
					path: 'index',
					name: '管理员',
					component: () => import('./views/admins.vue'),
					meta: { title: 'Form', icon: 'form', istatus: 0, auth: [0] }
				}
			]
		},
		{
			path: '/shou',
			icon: 'ss',
			name: '小助手',
			redirect: '/shou/index',
			component: () => import('./views/index.vue'),
			meta: {
				title: '小助手',
				istatus: 3,
				auth: [0, 3]
			},
			children: [
				{
					path: 'index',
					name: '小助手',
					component: () => import('./views/shou.vue'),
					meta: { title: 'Form', icon: 'form', istatus: 3 }
				}
			]
		},

		{
			path: '/register',
			hidden: true,
			name: 'register',
			component: () => import('./views/register.vue')
		},
		{
			path: '/login',
			hidden: true,
			name: 'login',
			component: () => import('./views/login.vue')
		},
		{
			path: '*',
			hidden: true,
			name: '404',
			component: () => import('./views/404.vue')
		},
		{
			path: '/403',
			hidden: true,
			name: '403',
			component: () => import('./views/403.vue')
		},
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (about.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		// }
	]
})

function getStatus() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(store.state.users.istatus)

		}, 1000)
	})
}

//路由守卫
router.beforeEach(async (to, from, next) => {
	// 获取token


	const token = localStorage.Admintokens;
	const decode = jwt_decode(token);
	let authArr = to.meta.auth
	console.log(to)
	//不需要验证token的页面
	if (to.path == '/login' || to.path == '/register') {
		//这里是判断/login和/register这两个路由就不用验证token,如果token存在就不在跳转到登陆和注册页面

		if (token) {

			next('/')
		} else {
			next();
		}

	} else {

		// 这里是判断其他路由是否存在token,如果token存在才可以跳转,否则就跳转登陆页面
		if (token) {

			if (authArr) {
				if (authArr.indexOf(parseInt(decode.istatus)) > -1) {
					next()
				} else {
					next('/403')
				}
			} else {
				next()
			}



		} else {
			Message.success('请先登陆')
			next('/login')
		}
	}
})
export default router;