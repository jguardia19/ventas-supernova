<template>
   <v-container class="mt-3 contenedor" >  
    <v-dialog v-model="modal_config" max-width="800">
        <v-card >
            <v-card-title>Configurar oferta pára template</v-card-title>
            <v-card-text>
                <v-row class="mt-3">
                    <v-col></v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-row>
        <v-col cols="12">
            <v-card elevation="0" >
                    <v-card-title>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <h3 class="primary--text"><v-icon color="primary">mdi-cart-percent</v-icon>Ofertas</h3> 
                        </v-col>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-2">
                            <v-col cols="12">
                                <v-data-table
                                    :headers="header"
                                    :items="ofertas"
                                    :page.sync="page"
                                    :items-per-page="itemsPerPage"
                                    mobile-breakpoint="0"
                                    >
                                    <template v-slot:[`item.cod`]="{item}" >
                                        <v-chip color="warning"><v-icon class="mr-1">mdi-barcode</v-icon> {{item.codigo}} </v-chip>
                                    </template>
                                    <template v-slot:[`item.precioU`]={item}>
                                        <v-chip label >${{item.preciou}} </v-chip>
                                    </template>
                                    <template v-slot:[`item.precioD`]={item}>
                                        <v-chip label color="success" >${{item.descuento_precio_docena}} </v-chip>
                                    </template>
                                    <template v-slot:[`item.porcentaje`]={item}>
                                        <v-chip label color="error" >
                                            {{((parseInt(item.preciou)-parseInt(item.descuento_precio_docena))/parseInt(item.preciou)*100).toFixed(1)}} 
                                            <v-icon>mdi-percent-outline</v-icon>
                                        </v-chip>
                                    </template>
                                    <template v-slot:[`item.actions`]="{ }">  
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                                color="primary"
                                                class="mr-2"
                                                icon
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="modal_config = true"
                                            >
                                                <v-icon>mdi-cogs</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Configurar</span>
                                        </v-tooltip>
                                    </template>
                                
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
        </v-col>
    </v-row>
   </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            ofertas:[],
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            header:[
                { text: 'Codigo', value: 'cod' ,align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Nombre del producto', value: 'nombre' ,align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Precio Uni.', value: 'precioU',align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Precio Descuento', value: 'precioD',align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Porcentaje descuento', value: 'porcentaje',align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Acciones', value: 'actions', align: 'center',class: "primary white--text px-0 mx-0", },
            ],
            modal_config:false,
        }
    },

    mounted(){
        this.getAllProductsOferta()
    },

    methods:{
        async getAllProductsOferta(){
            try
            {
                const response = await axios.get(`/ventas/descuentos`)
                if(response.status == 200){
                    this.ofertas = response.data 
                }
            }catch(e)
            {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss">
    .fade-enter-from,   
    .fade-leave-to{
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active{
        transition: opacity 0.1s ease-out;
    }
</style>