import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import store from './store'
import VueQRCodeComponent from 'vue-qr-generator'
import VSwitch from 'v-switch-case'


Vue.config.productionTip = false

Vue.use(VSwitch);

//import templates
import LoginLayout from './layout/LoginLayout.vue'
import DashboardLayout from './layout/DashboardLayout.vue'

import interceptorsSetup from './helpers/interceptor'

interceptorsSetup();
axios.defaults.baseURL = "http://localhost/supernova-almacen-api";

Vue.component('login-layout', LoginLayout);
Vue.component('dashboard-layout', DashboardLayout);
Vue.component('qr-code', VueQRCodeComponent)

new Vue({
  vuetify,
  router,
  axios,
  store,
  render: h => h(App)
}).$mount('#app')
