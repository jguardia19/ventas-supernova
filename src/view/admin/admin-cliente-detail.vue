<template>
    <v-row class="mt-3 pb-5">
        <v-col cols="12">
            <div class="container-information">
                <div class="data-user">
                </div>
                <div class="data-productos">
                    <h3>Productos con mas demandas:</h3>
                    <div class="container-productos">
                        <div class="item-producto" v-for="(product,index) of cliente.productos_clientes" :key="index">
                            <v-row>
                                <v-col cols="2" class="text-center">
                                    <v-icon color="success">mdi-tag</v-icon>
                                </v-col>
                                <v-col cols="4">
                                    <v-chip color="warning">Codigo:{{ product.codigo }} </v-chip> 
                                </v-col>
                                <v-col cols="2" class="text-center">
                                    <span>{{ product.cantidad }}  pz</span>
                                </v-col>
                                <v-col cols="4">
                                    <v-chip label outlined color="primary">
                                        Orden:  {{ product.orden }}
                                    </v-chip>
                                    
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-pedidos">

                <v-data-table :headers="cabecera" :items="cliente.ordenes" class="py-7" :page.sync="page"
                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                    <template v-slot:top>
                        <v-toolbar flat class="pb-5">
                            <v-row>
                                <v-col cols="6" class="d-flex">
                                    <v-icon large color="primary">mdi-clipboard</v-icon>
                                    <h2 class="primary--text mt-2 ml-3">Folios</h2>
                                </v-col>
                            </v-row>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.folio`]="{ item }">
                        <span v-if="item.procesado">{{item.orden}}</span>
                        <span class="error--text" v-else ><v-icon color="error">mdi-alert</v-icon> {{ item.orden }} </span> 
                    </template>
                    <template v-slot:[`item.client`]="{ item }">
                        <span :class="{'primary--text':item.procesado,'error--text':item.procesado}">{{item.nombres}}</span> 
                    </template>
                    <template v-slot:[`item.package`]="{ item }">
                        <v-chip color="primary" outlined label v-if="item.procesado"><v-icon>mdi-truck</v-icon> {{item.paqueteria}}</v-chip> 
                        <v-chip outlined color="error" label v-else><v-icon>mdi-truck-remove</v-icon> {{ item.paqueteria }} </v-chip>
                    </template>

                </v-data-table>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            cliente:[],
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            cabecera: [
                {
                    text: "Orden",
                    value: "folio",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Cliente",
                    value: "client",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Paqueteria",
                    value: "package",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Cantidad de productos(pz)",
                    value: "cant",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Total($)",
                    value: "Total",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Fecha emitido",
                    value: "fecha",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Fecha procesado",
                    value: "fecha_procesado",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                }
            ],
        }
    },

    mounted(){
        this.viewClient(this.$route.params.id)
    },

    methods:{
        async viewClient(id){
            try{
                let data = {"id_usuario":id}
                const response = await axios.post(`/admin/clientes`,data)
                if(response.status == 200){
                    this.cliente = response.data
                }
            }catch(e){
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss">
    .container-information{
        width: 80%;
        margin: auto;
        height: 500px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .data-user{
            width: 60%;
            background-color: #fff;
            border-radius: 8px;
            height: 500px;
        }
        .data-productos{
            width: 38%;
            background-color: #fff;
            border-radius: 8px;
            height: 500px;
            padding: 15px;
            box-sizing: border-box;
            .container-productos{
                width: 100%;
                height: 400px;
                margin-top: 10px;
                overflow-y: scroll;
                overflow-x: hidden;
                padding: 10px;
                box-sizing: border-box;
                .item-producto{
                    width: 100%;
                    height: 55px;
                    background-color: #fff;
                    box-shadow: 0px 1px 12px 2px #b7b3b3;
                    margin-top: 15px;
                    margin-bottom: 30px;
                    border-radius: 5px;
                }
            }

        }
    }
    .container-pedidos{
        width: 80%;
        height: auto;
        background-color: #fff;
        border-radius: 15px;
        margin:20px auto;
        padding: 15px;
    }
</style>