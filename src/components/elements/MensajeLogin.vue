<template>
   <v-container>
      <v-row>
         <v-col cols="12">
            <transition 
            enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutLeft"
            mode="out-in">
                <v-alert type="error" v-model="alert">
                    {{mensaje}}
                </v-alert>
            </transition>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { mapState } from 'vuex';
export default {

    computed:{
        ...mapState('mensajeLogin',['mensaje','alert'])
    }
}
</script>

<style  lang="scss">

    .fade-enter-from,   
    .fade-leave-to{
        opacity: 0 
    }
    .fade-enter-active,
    .fade-leave-active{
       transition: opacity 0.1s ease-out 
    }
        
</style>