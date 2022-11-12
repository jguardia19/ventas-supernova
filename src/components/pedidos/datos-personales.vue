<template>
  <v-col cols="12" sm="12" md="4" lg="4">
    <v-card outlined class="px-5 py-3">
      <v-row>
        <v-col cols="12">
          <h2 class="primary--text">Datos personales:</h2>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            label="Nombre"
            outlined
            append-icon="mdi-account"
            v-model="$props.data.nombre"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            label="Apellido"
            outlined
            append-icon="mdi-account"
            v-model="$props.data.apellido"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            label="Direccion"
            outlined
            append-icon="mdi-map-marker"
            v-model="$props.data.direccion"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            label="Colonia"
            outlined
            append-icon="mdi-map-marker"
            v-model="$props.data.colonia"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" class="mt-0">
          <v-text-field
            label="Ciudad"
            outlined
            append-icon="mdi-city"
            v-model="$props.data.ciudad"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <v-text-field
            label="Estado"
            outlined
            append-icon="mdi-map"
            v-model="$props.data.estado"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
        <v-text-field
            label="C.P"
            outlined
            append-icon="mdi-selection-marker"
            v-model="$props.data.codigo"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
            <v-text-field
            label="Telefono"
            outlined
            append-icon="mdi-phone"
            v-model="$props.data.telefono"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
            <v-text-field label="RFC" outlined
            v-model="$props.data.rfc"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
            <v-checkbox v-model="paqueteria" label="Paqueteria"></v-checkbox>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" v-if="paqueteria">
            <v-autocomplete
            :items="paqueterias"
            label="Paqueteria"
            outlined
            item-text="paqueteria"
            item-value="paqueteria"
            v-model="paquete"
            @change="selectedPaqueteria(paquete)"
            ></v-autocomplete>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import axios from 'axios'
export default {
    props:['data'],
    data(){
        return{
            paqueteria:false,
            paqueterias:[],
            paquete:''
        }
    },

    mounted(){
        this.getAllPaqueterias()
    },

    methods:{
        async getAllPaqueterias(){
            try
            {
                const response = await axios.get(`/ventas/paqueterias`)
                this.paqueterias = response.data
                this.paqueterias.push('ENTREGA EN BODEGA');
            }catch(e){
                console.log(e)
            }
        },
        selectedPaqueteria(paquete){
          this.$emit('selected',paquete)
        }
    }
};
</script>

<style>
</style>