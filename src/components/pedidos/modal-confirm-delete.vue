<template>
    <v-dialog v-model="$props.modal" max-width="500">
        <v-card>
            <v-card-title>
                <v-col cols="12" class="d-flex justify-space-between">
                    <h4 class="error--text">Estas seguro de eliminar el registro?</h4>
                    <v-btn icon color="error" @click="$emit('close')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-row class="mt-3">
                    <v-col cols="4">
                        <div  class="text-center primary white--text px-2 py-2 container-info">
                            <span>Codigo: <br> {{data.codigo}} </span>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div  class="text-center primary white--text px-2 py-2 container-info">
                            <span>{{data.nombre}} </span>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <div   class="text-center primary white--text px-2 py-2 container-info">
                            <span>Cantidad: <br> {{data.cantidad}} </span>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-col cols="12" class="text-right">
                    <v-btn text color="error" class="mr-2" @click="$emit('close')">CANCELAR</v-btn>
                    <v-btn class="success" @click="$emit('confirm')">CONFIRMAR</v-btn>
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props:['modal','data']

}
</script>

<style>

</style>