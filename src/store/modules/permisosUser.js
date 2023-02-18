import axios from 'axios'

export default {

    namespaced: true,

    state: {
        permisos:[]
    },
    mutations: {

        setData(state, data) {
            state.permisos = data
        }

    },
    actions: {

        async Permisos({ commit}) {
            try {
                let id = parseInt(sessionStorage.getItem('type_user'));
                const response = await axios.get(`/adminVentas/permisosBodega?id=${id}`) 
                if(response.status == 200){
                    commit('setData', response.data)
                }
            } catch (e) {
                console.log(e)
                //commit('overlay/setDesactiveOverlay', payload, { root: true })
            }


        },



    },
    getters: {

    }

}