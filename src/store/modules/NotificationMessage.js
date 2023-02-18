export default {
    namespaced: true,

    state: {
        alert: false,
        icon: '', //mdi-check-circle - mdi-close-circle-multiple - mdi-alert-circle - mdi-information
        text: '',
        status: '', //error-warning-success-info
    },

    mutations: {

        setActiveNotification(state, data) {
            state.icon = data.icon
            state.text = data.text
            state.status = data.status
            state.alert = true
            setTimeout(() => {
                state.alert = false
            }, 5000);
        },


        setDesactiveNotification(state) {
            state.alert = false
        }
    }
}