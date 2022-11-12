<template>
        <v-dialog v-model="modal" max-width="600">
            <v-card>
                <v-card-title>
                    <v-col cols="12" class="d-flex justify-space-between">
                        <h3 class="primary--text">Agregar nuevo producto al pedido</h3>
                        <v-btn fab small color="error" @click="closeModal"><v-icon>mdi-close</v-icon> </v-btn>
                    </v-col>
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-3">
                        <v-col cols="12">
                            <v-autocomplete
                            :items="productos"
                            item-text="fullname"
                            label="Selecciona Producto"
                            outlined
                            return-object
                            v-model="product"
                            @change="selectProduct(product)"
                            ></v-autocomplete>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-space-between" v-if="add">
                            <v-text-field type="number" label="Cantidad" v-model="cantidad" outlined></v-text-field>
                            <v-btn icon color="success" large class="mt-2" @click="cantidad++"> <v-icon>mdi-plus</v-icon> </v-btn>
                            <v-btn icon color="error" large class="mt-2" @click="cantidad--"> <v-icon>mdi-minus</v-icon> </v-btn>
                        </v-col>
                        <v-col cols="6" class="text-center" v-if="add">
                            <v-btn class="primary mt-3" @click="addProducto()"><v-icon class="mr-1">mdi-plus</v-icon> Añadir</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
    props:['modalAdd'],
    data(){
        return{
            productos:[],
            product:{},
            cantidad:0,
            add:false
        }
    },

    computed:{
        modal(){
            return this.modalAdd
        }
    },
    mounted(){
        this.getAllProducts()
    },
    methods:{
        async getAllProducts(){
            try
            {
                const response = await axios.get(`/productos/productos?total=total`);
                this.productos = response.data
            }catch(e)
            {
                console.log(e)
            }
        },

        closeModal(){
            this.product = {}
            this.add = false
            this.cantidad = 0
            this.$emit('close')
        },

        selectProduct(){
            this.add = true
        },

        addProducto(){
            if(parseInt(this.cantidad) <= 0){
                this.$emit('activeNotification')
            }else{
                this.$emit('add',this.product,this.cantidad)
                this.product = {}
                this.cantidad = 0  
            }
            
        }
    }
}
</script>

<style>

</style>