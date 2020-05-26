import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const TYPES = {
	SET_AUTH: 'SET_AUTH',
	SET_USERS: 'SET_USER',
	SET_MENU: 'SET_MENU'

}


const state = {
	isAuth: false,
	users: {},
	menuFlag: false,
}

const getters = {
	isAuth: state => state.isAuth,
	users: state => state.users,
	menuFlag: state => state.menuFlag
}

const mutations = {
	[TYPES.SET_AUTH]: (state, isAuthVal) => {

		if (isAuthVal) {
			state.isAuth = isAuthVal
		} else {
			state.isAuth = isAuthVal
		}
	},

	[TYPES.SET_USERS]: (state, userVal) => {

		state.users = userVal
	},
	[TYPES.SET_MENU]: (state, val) => {
		state.menuFlag = val
	}
}


const actions = {
	setAuth: ({ commit }, authVal) => {
		commit(TYPES.SET_AUTH, authVal)
	},
	setUser: ({ commit }, userVal) => {
		commit(TYPES.SET_USERS, userVal)
	},
	clearToken({ commit }) {
		commit(TYPES.SET_AUTH, null);
		commit(TYPES.SET_USERS, {});
		localStorage.removeItem('Admintokens');
	},
	setMenu({ commit }, val) {

		commit(TYPES.SET_MENU, val);
	}
}
export default new Vuex.Store({
	state,
	getters,
	mutations,
	actions,
})
