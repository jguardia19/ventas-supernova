<template>
    <transition 
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
        mode="out-in">

        <div id="notification" :class="status" v-if="alert">
          <v-icon color="white" class="icon-modal ml-2" >{{icon}}</v-icon>
            <p class="mt-3 ml-2 white--text">{{text}} </p>
        </div>

      </transition>
</template>

<script>
import {mapState} from 'vuex'
export default {

    computed:{
         ...mapState('notification',['alert','icon','text','status'])
    },

}
</script>

<style lang="scss">
    #notification{
        border-radius: 8px;
        width: auto;
        position: fixed;
        z-index: 999 !important;
        right: -5px;
        top: 10px;
        padding: 10px;
        display: flex;
    }

   .fade-enter-from,
    .fade-leave-to{
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active{
        transition: opacity 0.1s ease-out;
    }
</style>