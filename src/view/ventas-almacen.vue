<template>
    <v-container class="mt-5">
        <v-row>
            <v-col cols="12">
                <v-card class="px-5 py-5">
                    <v-card-title>
                        <v-col cols="12" class="d-flex">
                            <h3 class="primary--text">Pedidos en almacen </h3>
                            <v-chip label color="success" class="ml-3"><v-icon color="white" class="mr-1">mdi-warehouse</v-icon> {{countAlmacen}}</v-chip>
                        </v-col>
                    </v-card-title>
                    <v-data-table
                        :headers="headerPedido"
                        :items="pedidosAlmacen"
                        :page.sync="page"
                        :items-per-page="itemsPerPage"
                        mobile-breakpoint="0"
                        >
                        <template v-slot:[`item.num`]={index}>
                            {{index+1 }}
                        </template>
                        <template v-slot:[`item.box`]={item}>
                            <v-chip outlined color="primary" label>
                                <v-icon color="primary">mdi-package-variant-closed</v-icon>{{item.cajas}} 
                            </v-chip>
                        </template>
                        <template v-slot:[`item.shore`]={item}>
                            <v-chip outlined color="info" label>
                                <v-icon color="info">mdi-shopping-outline</v-icon>{{item.bolsas}} 
                            </v-chip>
                        </template>
                            <template v-slot:[`item.paque`]={item}>

                                <v-chip  color="success"  label v-if="item.paqueteria === 'ESTAFETA'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                                <v-chip  color="warning" label v-if="item.paqueteria === 'ENTREGA EN BODEGA'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                                <v-chip  color="info" label v-if="item.paqueteria === 'ENVIA SU GUIA'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                                <v-chip  color="#4D148C" class="white--text" label v-if="item.paqueteria === 'FEDEX'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                                <v-chip color="#C71617" label class="white--text" v-if="item.paqueteria === 'CASTORES'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                                <v-chip color="#0A1E6F" label class="white--text" v-if="item.paqueteria === 'TRAVISA'">
                                    <v-icon class="mr-1">mdi-truck-fast-outline</v-icon> {{item.paqueteria}}
                                </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
    data(){
        return{
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            headerPedido:[
                { text: 'N°', value: 'num' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'CLIENTE', value: 'nombres' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'CAJAS', value: 'box' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'BOLSAS', value: 'shore' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'FECHA DE PEDIDO', value: 'fecha' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'FECHA DE EMPACADO', value: 'fecha_almacen' ,align: 'center', class: "primary white--text px-0 mx-0"},
                { text: 'PAQUETERIA', value: 'paque' ,align: 'center', class: "primary white--text px-0 mx-0"},
            ]
        }
    },

    mounted(){
        this.getAllPedidosAlmacen()
    },

    computed:{
        ...mapState('pedidos',['pedidosAlmacen']),
        ...mapGetters('pedidos',['countAlmacen'])
    },

    methods:{

        ...mapActions('pedidos',['getAllPedidosAlmacen'])
    }
}
</script>

<style>

</style>