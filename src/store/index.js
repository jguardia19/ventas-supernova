import Vue from 'vue'
import Vuex from 'vuex'

//modules
import overlay from './modules/Overlay'
import alert from './modules/AlertMensaje'
import login from './modules/login'
import notification from './modules/NotificationVentas'
import pedidos from './modules/pedidos'
import permisos from './modules/permisosUser'
import notiMensaje from './modules/NotificationMessage'
import mensajeLogin from './modules/mesajeLogin'

Vue.use(Vuex)

export default new Vuex.Store({

    modules: {
        overlay,
        alert,
        login,
        notification,
        pedidos,
        permisos,
        notiMensaje,
        mensajeLogin
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