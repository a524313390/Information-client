//import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import ElementUI from 'element-ui';
import axios from './api/http';
// import 'element-ui/lib/theme-chalk/index.css';
import fromTime from './utils/fromTime';
import ELEMENT from 'element-ui'
import JsonExcel from 'vue-json-excel'
Vue.config.productionTip = false

Vue.prototype.$axios = axios;
Vue.use(ELEMENT)

Vue.filter('fromTime', fromTime)
Vue.component('downloadExcel', JsonExcel)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



