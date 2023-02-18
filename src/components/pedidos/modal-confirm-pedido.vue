<template>
      <v-dialog v-model="$props.modal" max-width="500">
        <v-card>
            <v-card-title>
                <v-col cols="12" class="d-flex justify-space-between">
                    <h4 class="primary--text">Estas seguro de guardar el pedido?</h4>
                    <v-btn icon color="error" @click="$emit('close')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-row class="mt-3">
                    <v-col cols="12">
                        <h2>Tu pedido quedara registrado en pedidos sin procesar</h2>
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
    props:['modal']

}
</script>

<style>

</style>