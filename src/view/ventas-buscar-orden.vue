<template>
    <v-container class="mt-5">
        <v-dialog max-width="500" v-model="modal_noEncontrado">
            <v-card>
                <v-card-title class="error">
                    <v-col cols="12" class="d-flex justify-space-between white--text">
                        <h3>{{ mensaje_modal }} </h3>
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
                    <v-col cols="3" class="d-flex">
                        <v-text-field label="Buscar por orden" v-model="numeroOrden" outlined @keypress.enter="searchFolio()"></v-text-field>
                        <v-btn class="primary btn-buscar" @click="searchFolio()">Buscar</v-btn>
                    </v-col>
                </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                    <v-simple-table>
                            <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        NOMBRE DEL CLIENTE
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        ORDEN (folio)
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        ESTATUS
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        CAJAS/BOLSAS
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        PAQUETERIA
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        FECHA PEDIDO
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        FECHA PROCESADO
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        FECHA ALMACEN
                                    </th>
                                    <th class="primary white--text px-0 mx-0 text-center">
                                        FECHA SALIDA
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="activo">
                                    <td>{{ pedido.nombres}}</td>
                                    <td class="text-center">
                                        <v-chip color="warning">{{pedido.orden}} </v-chip>
                                    </td>
                                    <td class="text-center">
                                        <v-chip color="primary" label>
                                            {{pedido.estatus}}
                                        </v-chip>
                                    </td>
                                    <td class="text-center">
                                        <v-chip color="error" v-if="pedido.cajas === null && pedido.bolsas === null">
                                            No ha sido empaquetado
                                        </v-chip>
                                        <div v-else>
                                            <v-chip color="primary"><span class="white--text">{{pedido.cajas}}</span> <v-icon color="white">mdi-package-variant-closed</v-icon></v-chip>/ 
                                            <v-chip class="primary"><v-icon color="white">mdi-shopping-outline</v-icon><span class="white--text">{{pedido.bolsas}} </span>  </v-chip>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <v-chip class="primary" outlined label>{{pedido.paqueteria}} </v-chip>
                                    </td>
                                    <td class="text-center">
                                        {{pedido.fecha_pedido | fechaFormat}}
                                    </td>
                                    <td class="text-center">
                                        {{pedido.fecha_procesado | fechaFormat}}
                                    </td>
                                    <td class="text-center">
                                        {{pedido.fecha_almacen | fechaFormat}}
                                    </td>
                                    <td class="text-center">
                                        {{pedido.fecha_salida | fechaFormat}}
                                    </td>
                                </tr>
                            </tbody>
                            </template>
                    </v-simple-table>
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
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            pedido:{},
            numeroOrden:'',
            modal_noEncontrado:false,
            mensaje_modal:''
        }
    },
    computed:{
        //variable computada para verificar si el objeto tiene datos
        activo(){
            return Object.entries(this.pedido).length > 0;
        }
    },
    filters:{
        //filtro de fechas para mostrar fechas formateadas
        fechaFormat(value){
            let meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            let date = new Date(value);
            let fecha = ''
            let day = date.getDate();
            if(isNaN(day)){
                fecha = 'Aun no se registra'
            }else{
                let day = date.getDate();
                day = day < 10 ? `0${day}` : day
                let mes = date.getMonth()+1;
                let year = date.getFullYear();
                let hora = date.getHours();
                hora = hora < 10 ? `0${hora}` : hora
                let minutos = date.getMinutes() < 10 ? `0${date.getMinutes( )}` : date.getMinutes()

                fecha = `${day} ${meses[mes]} ${year} ${hora}:${minutos}` 
            }
            
            return  fecha;
        }
    },
    methods:{
        //metodo para buscar datos de un folio
        async searchFolio(){
            if(this.numeroOrden === ''){
                this.mensaje_modal = 'Debes introducir un número de orden',this.modal_noEncontrado = true
                    setTimeout(() => {
                        this.modal_noEncontrado = false,this.mensaje_modal = ''
                    }, 2000);
            }else{
                try
                {
                    const response = await axios.get(`/ventas/folio?orden=${this.numeroOrden}`)
                    if(response.data.length === 0){
                        this.mensaje_modal = 'No se encontraron resultados',this.modal_noEncontrado = true
                        setTimeout(() => {
                            this.modal_noEncontrado = false,this.mensaje_modal = ''
                        }, 2000);
                    }else{
                        this.pedido = Object.assign({},response.data); 
                    }
                    
                }catch(e)
                {
                    console.log(e)
                }
            }
        }
    }
}
</script>

<style lang="scss">
    .btn-buscar{
        height: 55px !important;
        margin-left: -4px !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }
</style>