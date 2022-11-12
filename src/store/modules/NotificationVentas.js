export default {
    namespaced: true,

    state: {
        modal: false,
        icon: '', //mdi-check-circle - mdi-close-circle-multiple - mdi-alert-circle - mdi-information
        title: '',
        text: '',
        status: '', //error-warning-success-info
        textButton: ''
    },

    mutations: {

        setActiveModal(state, data) {
            state.icon = data.icon
            state.title = data.title
            state.text = data.text
            state.status = data.status
            state.textButton = data.textButton
            state.modal = true
        },

        setActiveModalCredenciales(state) {
            state.icon = 'mdi-alert'
            state.status = 'error'
            state.title = 'Credenciales Incorrectas'
            state.text = 'Tu Usuario o Contraseña son incorrectos'
            state.textButton = 'Intentar nuevamente'
            state.modal = true
        },

        setDesactiveModal(state) {
            state.modal = false
        }
    }
}