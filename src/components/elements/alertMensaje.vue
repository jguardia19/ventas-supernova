<template>
   <v-dialog v-model="alert" max-width="450">
     <v-card >
        <v-card-title>
            <h3>Title</h3>
        </v-card-title>
        <v-card-text>
            <v-row class="mt-2">
                <v-col cols="12">
                    {{mensaje}}
                </v-col>
            </v-row>
        </v-card-text>
     </v-card>
   </v-dialog>
</template>

<script>
import {mapState} from 'vuex'
export default {

    computed:{
        ...mapState('alert',['alert','mensaje']),
    }
}
</script>

<style>

</style>