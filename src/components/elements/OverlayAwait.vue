<template>
    <v-container>
        <v-overlay :value="estado" class="text-center" :absolute="true">
            <div class="container-gif">
                <v-progress-circular
                :size="80"
                :width="7"
                color="white"
                indeterminate
                >
                    <img src="../../assets/icon-white-supernova.png" class="rotate" width="70" alt="" v-if="estado">
                </v-progress-circular> 
                <p class="white--text">Cargando por favor espere...</p>
            </div>
        </v-overlay>
    </v-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState('overlay',['estado'])
    }
}
</script>

<style lang="scss">
    .container-gif{
        position: fixed;
        top: 45%;
    }

    .rotate {
        animation: rotation 1s infinite linear;
    }

    @keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
    }
</style>