<template>
  <v-row>
    <v-col cols="12">

            <v-card elevation="3" class="px-4 mt-3">
                <v-data-table :headers="cabecera" :items="clientes" class="py-7" :page.sync="page"
                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                    <template v-slot:top>
                        <v-toolbar flat class="pb-5">
                            <v-row>
                                <v-col cols="6" class="d-flex">
                                    <v-icon large color="primary">mdi-account-group</v-icon>
                                    <h2 class="primary--text mt-2 ml-3">Clientes</h2>
                                </v-col>
                            </v-row>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.client`]="{ item }">
                        <v-icon class="mr-1" color="primary">mdi-account</v-icon>
                        <span style="font-weight:bold;color:#2057a5;text-decoration:underline;cursor:pointer;"> {{ item.fullName }} </span>
                    </template>
                    <template v-slot:[`item.pedidos`]="{ item }">
                        <v-chip outlined label color="success"> <v-icon>mdi-tag</v-icon>  {{ item.total_pedidos }}  </v-chip>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" class="mr-2" icon v-bind="attrs" v-on="on"
                                    @click="viewClient(item.id)"
                                    >
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver cliente</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            clientes:[],
            cabecera: [
                {
                    text: "ID",
                    value: "id",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Cliente",
                    value: "client",
                    align: "left",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Direccion",
                    value: "direccion",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Correo",
                    value: "correo",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Pedidos",
                    value: "pedidos",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Acciones",
                    value: "actions",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
            ],

        }
    },

    mounted(){
        this.getAllClients()
    },

    methods:{
        async getAllClients(){
            try{
                const response = await axios.get(`/admin/clientes`);
                if(response.status == 200){
                    this.clientes = response.data
                }
            }catch(e){
                console.log(e)
            }
        },

        viewClient(id){
            this.$router.push(`/ventas/client/${id}`)
        }
    }
}
</script>

<style>

</style>