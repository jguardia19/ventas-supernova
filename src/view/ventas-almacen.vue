<template>
    <v-container class="mt-5">

        <v-dialog max-width="600" v-model="modal_alert">
            <v-card>
                <v-card-title class="">
                    <v-col cols="12" class="d-flex justify-space-between">
                        <h3> El folio <b class="error--text"> {{ orden }} no se encuentra en almacen </b></h3>
                    </v-col>
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-3">
                        <v-col cols="12" class="text-center">
                            <v-icon color="error" large>
                                mdi-file-document-remove
                            </v-icon>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-row>
            <v-col cols="12">
                <v-card class="px-5 py-5">
                    <v-card-title>
                        <v-col cols="6" class="d-flex">
                            <h3 class="primary--text">Pedidos en almacen </h3>
                            <v-chip class="success ml-2">{{countAlmacen}}</v-chip>
                            <v-btn class="ml-2" color="success" @click="getAllPedidosAlmacen()"><v-icon color="white" class="mr-1">mdi-warehouse</v-icon>  Todos </v-btn>
                        </v-col>
                        <v-col cols="3"></v-col>
                        <v-col cols="3" class="d-flex">
                            <v-text-field outlined label="Buscar folio por orden" append-icon="mdi-magnify" v-model="orden" @keypress.enter="findOnePedido(orden)"></v-text-field>
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
    data(){
        return{
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            orden:'',
            //modal:false,
            mensaje_modal:'',
            modal_alert:false,
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
        //metodos de store el computed state con array de datos
        ...mapState('pedidos',['pedidosAlmacen']),
        //metodo store getters, contador de pedidos
        ...mapGetters('pedidos',['countAlmacen']),

        modal(){
            return this.countAlmacen > 0 ? false : true
        }
    },

    watch:{
        modal(value){
            if(value){
                this.activeModal()
            }
        }
    },

    methods:{
        //store metodo para buscar folio
        ...mapMutations('pedidos',['setBuscarFolio']),
        //store traer todos los pedidos de almacen y traer uno especifico
        ...mapActions('pedidos',['getAllPedidosAlmacen','findOnePedido']),

        activeModal(){
            this.modal_alert = true
            this.orden = ''
            setTimeout(() => {
                this.modal_alert = false
            }, 2000);
        }

    }
}
</script>

<style>

</style>