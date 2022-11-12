import Vue from 'vue'
import Vuex from 'vuex'

//modules
import overlay from './modules/Overlay'
import alert from './modules/AlertMensaje'
import login from './modules/login'
import notification from './modules/NotificationVentas'
import pedidos from './modules/pedidos'

Vue.use(Vuex)

export default new Vuex.Store({

    modules: {
        overlay,
        alert,
        login,
        notification,
        pedidos
    },

    state: {

    },
    mutations: {



    },
    actions: {



    },
    getters: {

    }
})