<template>
    <v-dialog v-model="modal" max-width="400">
        <v-card class="card-alert">
               <v-btn
                class="mx-2 btn-close"
                fab
                dark
                small
                @click="setDesactiveModal"
                >
                <v-icon dark>
                    mdi-close
                </v-icon>
            </v-btn>
            <v-card-text>
                <v-col cols="12" class="text-center">
                    <v-icon :color="status"  class="icon-modal" >{{icon}} </v-icon>
                    <h1>{{title}} </h1>
                    <p>{{text}} </p>

                    <v-btn id="btn-modal" :class="status" dark @click="setDesactiveModal">{{textButton}} </v-btn>
                                        
                </v-col>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {    

    computed:{
        ...mapState('notification',['modal','icon','title','text','status','textButton'])
    },

    methods:{
        ...mapMutations('notification',['setDesactiveModal'])
    }
}
</script>

<style lang="scss">
    .card-alert{
        position: relative;
        .icon-modal{
            margin-bottom: 13px !important;
            font-size: 75px !important;
        }
        h1{
            color: #000 !important;
            margin-bottom: 16px !important;
        }
        p{
            margin-bottom: 16px !important;
            font-size: 16px !important;
        }
        #btn-modal{
            width: 230px !important;
            margin-top: 21px !important;
        }
        .btn-close{
            position: absolute;
            background: rgb(160, 158, 158) !important; 
            top: 6px;
            right: -4px;
            width: 30px !important;
            height: 30px !important;

        }
    }
</style>