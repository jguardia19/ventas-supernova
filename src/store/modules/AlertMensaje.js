import router from '@/router'
export default {
    namespaced: true,

    state: {
        alert: false,
        mensaje:''
    },

    mutations: {

        setActiveAlert(state,text) {
            state.mensaje = text
            state.alert = true
            setTimeout(()=>{
                state.alert = false
                sessionStorage.removeItem('autenticado')
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('expire')
                sessionStorage.removeItem('user')
                sessionStorage.removeItem('id')
                router.push('/')
            },5000);
        },

        setDesactiveAlert(state) {
            state.alert = false
        }
    }
}