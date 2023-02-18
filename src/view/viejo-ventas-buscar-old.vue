<template>
    <v-container class="mt-5">
       <v-row>
         <v-col cols="12">
                    <v-card
                        class="mx-auto"
                        max-width="450"
                    >
                        <v-card
                        dark
                        flat
                        >
                        <v-card-title class="pa-2 primary">
                            <v-text-field outlined type="search" class="mt-2" v-model="orden" @keypress.enter="searchFolio()" append-icon="mdi-magnify" label="Buscar orden"></v-text-field>
                        </v-card-title>
                        <v-img
                            src="@/assets/background-profile.png"
                            gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
                        >
                            <v-container class="fill-height">
                            <v-row align="center">
                                <v-avatar color="teal" class="avatar-pedido" >
                                    <h4>{{avatar}} </h4>
                                </v-avatar>
                                <v-chip color="warning" label class="orden-pedido" v-if="pedido.orden" >
                                    <h4 class="text-h6 font-weight-light text-center grow ">
                                    Orden: {{pedido.orden}}
                                    </h4>
                                </v-chip>
                            
                                <v-col cols="12">
                                  <h4 class="mb-2 mt-2" v-if="pedido.nombres">Nombres: {{pedido.nombres}} </h4>  
                                  <h4 class="mb-2" v-if="pedido.estatus">Estatus: <v-chip color="white" outlined label>{{pedido.estatus}} </v-chip> </h4>  
                                  <h4 class="mb-2" v-if="pedido.paqueteria">Paqueteria: <v-chip color="primary" label>{{pedido.paqueteria}} </v-chip> </h4>  
                                </v-col>
                            </v-row>
                            </v-container>
                        </v-img>
                        </v-card>
                        <v-card-text class="py-0">
                        <v-timeline
                            align-top
                            dense
                        >
                            <v-timeline-item
                            color="teal lighten-3"
                            small
                            >
                            <v-row class="pt-1">
                                <v-col cols="5">
                                <strong><v-icon>mdi-calendar</v-icon> {{pedido.fecha_pedido | fecha}} </strong> <br>
                                <strong><v-icon>mdi-alarm</v-icon> {{pedido.fecha_pedido | hora}} </strong> <br>
                                </v-col>
                                <v-col>
                                    <strong>Fecha pedido</strong>
                                    <div class="text-caption">
                                        
                                    </div>
                                </v-col>
                            </v-row>
                            </v-timeline-item>

                            <v-timeline-item
                            color="teal lighten-3"
                            small
                            >
                            <v-row class="pt-1">
                                <v-col cols="5">
                                    <strong><v-icon>mdi-calendar</v-icon> {{pedido.fecha_procesado | fecha}} </strong> <br>
                                    <strong><v-icon>mdi-alarm</v-icon> {{pedido.fecha_procesado | hora}} </strong> <br>
                                </v-col>
                                <v-col>
                                <strong>Fecha procesado</strong>
                                    <div class="text-caption mb-2">
                                        
                                    </div>
                                </v-col>
                            </v-row>
                            </v-timeline-item>

                            <v-timeline-item
                            color="teal lighten-3"
                            small
                            >
                            <v-row class="pt-1">
                                <v-col cols="5">
                                    <strong><v-icon>mdi-calendar</v-icon> {{pedido.fecha_almacen | fecha}} </strong> <br>
                                    <strong><v-icon>mdi-alarm</v-icon> {{pedido.fecha_almacen | hora}} </strong> <br>
                                </v-col>
                                <v-col>
                                <strong>Fecha Almacen</strong>
                                </v-col>
                            </v-row>
                            </v-timeline-item>

                            <v-timeline-item
                            color="teal lighten-3"
                            small
                            >
                            <v-row class="pt-1">
                                <v-col cols="5">
                                    <strong><v-icon>mdi-calendar</v-icon> {{pedido.fecha_salida | fecha}} </strong> <br>
                                    <strong><v-icon>mdi-alarm</v-icon> {{pedido.fecha_salida | hora}} </strong> <br>
                                </v-col>
                                <v-col>
                                <strong>Fecha Salida</strong>
                                <div class="text-caption">
                                </div>
                                </v-col>
                            </v-row>
                            </v-timeline-item>
                        </v-timeline>
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
           orden:'',
           pedido:{
                id_usuario:'',
                nombres:'',
                orden:'',
                paqueteria:'',
                total:'',
                fecha_pedido:'',
                fecha_procesado:'',
                fecha_salida:'',
                estatus:''
           }
        }
    },

    computed:{
        avatar(){
            return this.pedido.nombres[0]
        }
    },

    filters:{
        hora(value){
            if (!value) return ''
            let date = new Date(value);
            let hora = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            return `${hora}:${minutes}:${seconds} `
        },

        fecha(value){
            if (!value) return ''
            let date = new Date(value);
            let day = date.getDay();
            day =  isNaN(day) ? '' : day
            day = day < 10 ? `0${day}` : day
            let month = date.getMonth();
            month =  isNaN(month) ? '' : month
            month = month < 10 ? `0${month}` : month
            let year = date.getFullYear();
            year =  isNaN(year) ? '0' : year

            

            return `${day}-${month}-${year} `
        }
    },

    methods:{
        async searchFolio(){
            try
            {
                const response = await axios.get(`http://localhost/supernova-almacen-api/ventas/folio?orden=${this.orden}`)
                console.log(response.data)
                this.pedido = response.data
            }catch(e)
            {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="sass">
    .avatar-pedido
        position: absolute
        right: 5px
        top: 5px
    .orden-pedido
        position: absolute
        left: 35%
        top: 5%
</style>