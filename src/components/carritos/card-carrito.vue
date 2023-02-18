<template>
    <v-row>
            <v-col cols="12">
                <h2 class="white--text">Carritos de compras</h2>
            </v-col>
            <v-col cols="12" sm="4" md="3" lg="2" v-for="(item, index) of items" :key="index">
                <div class="card-carrito-compras" @click="$emit('getFind',item)">
                    <v-avatar color="primary" class="white--text" size="35">{{ item.nombre | avatar }} </v-avatar>
                    <v-icon color="success" class="icon-cart">mdi-cart</v-icon>
                    <p class="nombres">{{ item.nombre }} </p>
                    <p class="apellidos">{{ item.apellido }} </p>
                    <span class="correo mb-5"><v-icon size="20">mdi-email</v-icon> {{ item.correo }}</span> <br>
                    <a href="https://api.whatsapp.com/send?phone=525579973110&text=Hola que tal." target="_blank"
                        class="telefono success--text">
                        <v-icon color="success">mdi-whatsapp</v-icon> {{ item.telefono }}
                    </a>
                    
                </div>
            </v-col>
        </v-row>  
</template>

<script>
export default {

    props:['items'],
    
    filters: {
        avatar(value) {
            if (value) {
                return value[0]
            }
        }
    },
}
</script>

<style>

</style>