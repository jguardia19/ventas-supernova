<template>
    <v-container class="mt-3">
        <v-row>
            <v-col cols="12">
                <v-card
                    class="mt-4 mx-auto"
                    max-width="1000"
                >
                    <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="cyan"
                    elevation="12"
                    max-width="calc(100% - 32px)"
                    >
                    <v-sparkline
                        :labels="labels"
                        :value="value"
                        color="white"
                        line-width="2"
                        padding="16"
                    ></v-sparkline>
                    </v-sheet>

                    <v-card-text class="pt-0">
                    <div class="text-h6 font-weight-light mb-2">
                        User Registrations
                    </div>
                    <div class="subheading font-weight-light grey--text">
                        Last Campaign Performance
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <v-icon
                        class="mr-2"
                        small
                    >
                        mdi-clock
                    </v-icon>
                    <span class="text-caption grey--text font-weight-light">last registration 26 minutes ago</span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import axios from 'axios'
  export default {
    data: () => ({
      labels: [],
      value: [  
      ],
    }), 

    mounted(){
        this.getAllReport()
    },
    methods: {
   async getAllReport() {
        let date = new Date();
        let day = date.getDate();
        let moth = date.getMonth()+1;
        let year = date.getFullYear();
        console.log(day,moth,year)


        let datos = [];
        try {
            for(var i =0;i<5;i++){
                let fecha = ''; 
                if((day-i) < 10){
                    fecha = `${year}-${moth}-0${day-i}`;
                }else{
                    fecha = `${year}-${moth}-${day-i}`;  
                }
                
                this.labels.push(fecha);
                const response = await axios.get(`/ventas/pedidos?fecha=${fecha}`);
                datos.push(response.data)
                this.value.push(response.data.length)
            }
            console.log(datos)
        }catch (e) {
        console.log(e);
        }
    },
    },
  }

 
</script>

<style>
   text{
    font-size: 6 !important;
   }
</style>