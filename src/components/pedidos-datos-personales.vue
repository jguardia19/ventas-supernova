<template>
        <v-row>
            <v-col cols="12">
                <v-card class="px-5 py-8" elevation="0">
                    <div class="loading" v-if="loading">
                        <div class="container-loading text-center">
                            <v-progress-circular
                            :size="80"
                            :width="7"
                            color="white"
                            indeterminate
                            >
                                <img src="@/assets/icon-white-supernova.png" class="rotate" width="70" alt="">
                            </v-progress-circular> 
                            <p class="white--text">Por favor espere...</p>
                        </div>
                    </div>
                    <v-row>
                        <v-col cols="12">
                            <h3 class="ticket--text">DATOS PERSONALES</h3>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Nombre" v-model="datos.nombre" outlined append-icon="mdi-account" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>Nombre:</b> {{datos.nombre}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Apellido" v-model="datos.apellido" outlined append-icon="mdi-account" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>Apellido:</b> {{datos.apellido}} </p>
                            </div>  
                            
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Direccion" v-model="datos.direcciond" outlined append-icon="mdi-map-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map-marker</v-icon>
                                <p class="mt-5"><b>Direccion:</b> {{datos.direcciond}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" > 
                            <v-text-field label="Colonia" outlined v-model="datos.coloniad"  append-icon="mdi-map-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map-marker</v-icon>
                                <p class="mt-5"><b>Colonia:</b> {{datos.coloniad}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" class="mt-0">
                            <v-text-field label="Ciudad" outlined  v-model="datos.ciudadd" append-icon="mdi-city" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-city</v-icon>
                                <p class="mt-5"><b>Ciudad:</b> {{datos.ciudadd}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Estado" v-model="datos.estadod" outlined append-icon="mdi-map" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map</v-icon>
                                <p class="mt-5"><b>Estado:</b> {{datos.estadod}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="C.P" outlined v-model="datos.codigopd" append-icon="mdi-selection-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-selection-marker</v-icon>
                                <p class="mt-5"><b>C.P:</b> {{datos.codigopd}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" > 
                            <v-text-field label="Telefono" v-model="datos.telefonod" outlined append-icon="mdi-phone" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-phone</v-icon>
                                <p class="mt-5"><b>Telefono:</b> {{datos.telefonod}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="RFC" outlined  v-model="datos.rfc" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>RFC:</b> {{datos.rfc}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >

                            <v-autocomplete 
                            :items="paqueterias"
                            label="Paqueteria"
                            item-text="paqueteria"
                            item-value="paqueteria"
                            outlined
                            v-model="datos.paqueteria"
                            v-if="editData"
                            ></v-autocomplete>

                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-truck-fast</v-icon>
                                <p class="mt-5"><b>Paqueteria:</b> {{datos.paqueteria}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-btn class="warning mt-4" @click="editarDatos()" v-if="!editData"><v-icon class="mr-2">mdi-pencil</v-icon> Editar Datos</v-btn>
                            <v-btn class="mt-4 mr-2" color="error" text @click="cancelar()" v-if="editData"> Cancelar</v-btn>
                            <v-btn class="ticket mt-4" @click="updateDataUser()" v-if="editData" color="white--text"><v-icon class="mr-2" color="white">mdi-update</v-icon> Actualizar Datos</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            editData:false,
            datos:[],
            paqueterias:[], 
            loading:false,
        }
    },


    mounted(){
        this.getAllPaqueterias()
        this.getAllDetalleUsuario(this.$route.params.orden)
    },

    methods:{

        async getAllPaqueterias(){
            try
            {
                const response = await axios.get(`/ventas/paqueterias`)
                if(response.status == 200){
                    this.paqueterias = response.data 
                }
            }catch(e){
                console.log(e)
            }
        },

        editarDatos(){
            this.editData = true
        },

        cancelar(){
            this.editData = false
        },

        actualizar(){
            this.editData = false
        },

        async updateDataUser(){
            this.loading = true
            this.datos.orden = this.$route.params.orden
            try
            {
                const response = await axios.post(`/ventas/dataUsuario`,this.datos);
                if(response.status == 200){
                    console.log(response.data)
                    this.getAllDetalleUsuario(this.$route.params.orden)
                }
                
            }catch(e)
            {
                console.log(e)
            }
        },

        async getAllDetalleUsuario(orden){
            this.loading = true
            try
            {
                const response = await axios.get(`/ventas/detallePedido?ordenLimit=${orden}`)
                if(response.status == 200){
                    this.datos = response.data
                    this.editData = false
                    this.loading = false
                }
                
            }catch(e)
            {
                console.log(e)
            }
        },
    }
}
</script>

<style> 
.loading{
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    background-color: #000000b8;
    z-index: 8;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>