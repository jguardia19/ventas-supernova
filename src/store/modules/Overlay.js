export default {
    namespaced: true,

    state: {
        estado: false
    },

    mutations: {

        setActiveOverlay(state) {
            state.estado = true
        },

        setDesactiveOverlay(state) {
            state.estado = false
        }
    }
}