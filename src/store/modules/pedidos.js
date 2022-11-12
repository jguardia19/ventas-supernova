import axios from 'axios'
// import router from '@/router'

export default {

    namespaced: true,

    state: {
        pedidosPagados:[],
        pedidosCredito:[],
        pedidosProcesados:[],
        pedidosAlmacen:[]
    },
    mutations: {

        setPedidosPagados(state,data){
            state.pedidosPagados = data
        },

        setPedidosCredito(state,data){
            state.pedidosCredito = data
        },

        setPedidosProcesados(state,data){
            state.pedidosProcesados = data
        },
        
        setPedidosAlmacen(state,data){
            state.pedidosAlmacen = data
        }

    },
    actions: {

        async getAllPedidosPagados({commit}){
            try
            {
                const response = await axios.get(`/ventas/pedidos`)
                if(response.status == 200){
                    commit('setPedidosPagados', response.data);  
                }
            }catch(e){
                console.log(e)
            }
        },

        async getAllPedidosCredito({commit} ){
            try
            {
                const response = await axios.get(`/ventas/pedidosCredito`)
                if(response.status == 200){
                    commit('setPedidosCredito',response.data)
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        async getAllPedidosProcesados({commit}) {
            try {
                const response = await axios.get(`/ventas/pedidosProcesados`);
                console.log(response.data)
                if(response.status == 200){
                    commit('setPedidosProcesados',response.data)
                }
            } catch (e) {
            console.log(e);
            }
        },

        async getAllPedidosAlmacen({commit}){
            try
            {
                const response = await axios.get(`/ventas/pedidosAlmacen`);
                if(response.status == 200){
                    commit('setPedidosAlmacen',response.data)
                }
            }catch(e)
            {
                console.log(e)
            }
        }


    },
    getters: {
        countPedidos(state){
            return state.pedidosPagados.length;
        },

        countPedidosCredito(state){
            return state.pedidosCredito.length
        },

        countProcesados(state){
            return state.pedidosProcesados.length
        },

        countAlmacen(state){
            return state.pedidosAlmacen.length
        }
    }

}