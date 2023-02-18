import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import store from './store'
import VSwitch from 'v-switch-case'
import money from 'v-money'


Vue.config.productionTip = false

Vue.use(VSwitch);
Vue.use(money, {precision: 4})

//import templates
import LoginLayout from './layout/LoginLayout.vue'
import DashboardLayout from './layout/DashboardLayout.vue'

import interceptorsSetup from './helpers/interceptor'

interceptorsSetup();
//axios.defaults.baseURL = "http://localhost/supernova-almacen-api";
axios.defaults.baseURL = "https://programacion.importadorasupernova.com/api-ventas";

Vue.component('login-layout', LoginLayout);
Vue.component('dashboard-layout', DashboardLayout);

new Vue({
  vuetify,
  router,
  axios,
  store,
  render: h => h(App)
}).$mount('#app')
