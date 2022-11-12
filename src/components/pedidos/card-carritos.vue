<template>
    <v-card elevation="1" class="mt-5 px-5">
        <v-row>
            <v-col cols="12">
                <h3 class="primary--text">Lista de carritos activos</h3>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="2" v-for="(item,index) of datos" :key="index">
                <div class="card-car" @click="selectedCar(item)">
                    <v-row>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <v-avatar class="primary">
                                <v-icon color="white">mdi-cart</v-icon>
                            </v-avatar>
                            <div class="datos" >
                                <span class="success--text">{{item.nombre}}</span>  <br>
                                <span class="primary--text dato">{{item.apellido}}</span> 
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <span class="primary--text dato"><v-icon class="mr-1" color="primary">mdi-phone</v-icon>{{item.telefono}}  </span><br>
                            <span class="primary--text dato"><v-icon class="mr-1" color="primary">mdi-email</v-icon>{{item.correo}}  </span><br>
                            <span class="primary--text dato"><v-icon class="mr-1" color="primary">mdi-city</v-icon>{{item.ciudad}}  </span>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props:['datos'],

    methods:{
        selectedCar(id){
            this.$emit('selected',id)
        }
    }
}
</script>

<style lang="sass">
    .card-car
        width: 98%
        border: 1px solid #d3d3d3
        padding: 8px
        border-radius: 5px
        cursor: pointer
        :hover
            background-color: #2057a5 !important
            border-radius:5px
            .dato
                color: #fff !important   
            .v-icon
                color: #fff !important
        .v-avatar
            width: 20% !important
            @media(max-width: 960px)
                width: 15% !important
        .datos
            width: 70% !important
        .dato
            font-size: 14px
</style>