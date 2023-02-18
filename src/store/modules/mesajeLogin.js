export default {
    namespaced: true,

    state: {
        alert:false,
        mensaje:''
    },

    mutations: {

        setActiveMensaje(state) {
            state.alert = true
            state.mensaje = 'Crendenciales invalidos, Ocurrio un error'
            setTimeout(()=>{
                state.alert = false
                state.mensaje = ''
            },5000);
        },

        setActiveInautorized(state) {
            state.mensaje = 'Este Usuario esta desactivado'
            state.alert = true
            setTimeout(()=>{
                state.alert = false
                state.mensaje = ''
            },5000);
        },

        setDesactiveAlert(state) {
            state.alert = false
        }
    }
}