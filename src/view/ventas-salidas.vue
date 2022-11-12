<template>
   <v-container class="mt-3">
      <v-dialog v-model="modal_confirm_delete" max-width="500">
        <v-card>
            <v-card-title>
                <v-col cols="12" class="d-flex justify-space-between">
                    <h4 class="error--text">Estas seguro de eliminar el registro?</h4>
                    <v-btn icon color="error" @click="closeModalDelete()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-row class="mt-3">
                    <v-col cols="12">
                        <h3>se eliminara el monto ${{cantidad_delete}} con motivo de {{motivo_delete}} </h3>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-col cols="12" class="text-right">
                    <v-btn text color="error" class="mr-2" @click="closeModalDelete()">CANCELAR</v-btn>
                    <v-btn class="success" @click="deleteSalida()">CONFIRMAR</v-btn>
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>

      <v-row class="mt-3">
        <v-col cols="12" sm="12" md="6" lg="6">
            <v-card elevation="0" class="px-5" height="500">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="card-container">
                            <div class="container-form">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field type="text" outlined label="Monto" v-model="salida.monto" @keypress="soloNumeros($event)" placeholder="$0.00"></v-text-field>
                                        <v-textarea rows="2" outlined label="Motivo" v-model="salida.motivo" @keypress.enter="saveSalida()"></v-textarea>
                                        <button class="btn-salida" @click="saveSalida()" >ACEPTAR</button>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col  cols="12" sm="12" md="6" lg="6">
            <v-card elevation="0" class="px-5 card-salidas" height="500">
                <v-card-title>
                    <v-icon class="mr-2" color="primary" large>mdi-cash-minus</v-icon>
                    Salidas
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table
                    :headers="header"
                    :items="salidas"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    mobile-breakpoint="0"
                >
                    <template v-slot:[`item.number`]="{ index }">
                    <span>{{ index + 1 }} </span>
                    </template>
                    <template v-slot:[`item.cant`]={item}>
                        <v-chip label color="warning">${{item.cantidad}}.00</v-chip>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            color="error"
                            class="mr-2"
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="confirmDelete(item)"
                            >
                            <v-icon>mdi-delete-empty-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                    </template>
                </v-data-table>

                <span class="total_salidas"><b>Total:</b> ${{total}}.00</span>
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
        salidas:[],
        modal_confirm_delete:false,
        cantidad_delete:'',
        id_delete:null,
        motivo_delete:'',
        salida:{
            monto:'',
            motivo:''
        },
        page: 1,
        pageCount: 0,
        itemsPerPage: 100,
        header: [
            {
            text: "#",
            value: "number",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
            {
            text: "Motivo",
            value: "motivo",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
              {
            text: "Cantidad",
            value: "cant",
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
        this.getAllSalidasToday()
    },

    computed:{
        total(){
            const acumular = (acumulador,salida) => acumulador + parseInt(salida.cantidad)
            return this.salidas.reduce(acumular,0)
        }
    },

    methods:{

        soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
        },

        async getAllSalidasToday(){
            try
            {
                const response = await axios.get(`/ventas/salidas`)
                if(response.status == 200){
                    this.salidas = response.data
                }
            }catch(e){
                console.log(e)
            }
        },

        async saveSalida(){
            try
            {   
                const response = await axios.post(`/ventas/salidas`,this.salida);
                if(response.status == 200){
                    this.getAllSalidasToday()
                    console.log(response.data)
                    this.salida.monto = '',this.salida.motivo = ''
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        confirmDelete(item){
            this.id_delete = item.id
            this.cantidad_delete = item.cantidad
            this.motivo_delete = item.motivo
            this.modal_confirm_delete = true
        },

        async deleteSalida(){
            try
            {
                const response = await axios.delete(`/ventas/salidas?id=${this.id_delete}`)
                if(response.status == 200){
                    this.getAllSalidasToday()
                    this.closeModalDelete()
                    console.log(response.data)
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        closeModalDelete(){
            this.cantidad_delete = ''
            this.motivo_delete = ''
            this.id_delete = null
            this.modal_confirm_delete = false
        }
    }
}
</script>

<style lang="scss">
    .card-container{
        width: 100%;
        height: 490px;
        display: flex;
        justify-content: center;
        align-items: center;
        .container-form{
            width: 350px;
            height: auto;
            padding: 15px;
            border-radius: 5px;
            box-sizing: border-box;
            border: 1px solid #d3d3d3;
            .btn-salida{
                width: 100% !important;
                background-color: #2057a5;
                color: #fff;
                border: none;
                border-radius: 8px;
                padding: 12px;
                &:hover{
                    background-color: #133769;
                }
            }
        }
    }
    .card-salidas{
        position: relative;
        .total_salidas{
            position: absolute;
            right: 8px;
            bottom: 8px;
            color: #4CAF50;
            font-size: 28px;
        }
    }
    .v-text-field fieldset, .v-text-field .v-input__control {
            margin-bottom: -8px !important;
    }
    
</style>