<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <a 
            :href="`https://api.whatsapp.com/send?phone=52${tlf}&text=Hola que tal, ${cliente} , podemos ver que en tu carrito tiene el siguiente producto, ${ producto },  te notificamos que nos queda poco stock disponible`" 
            target="_blank"
            class="telefono" 
            v-bind="attrs" 
            v-on="on"
            style="text-decoration:none !important"
            >
                <v-btn color="success" class="mr-2" icon >
                    <v-icon>mdi-whatsapp</v-icon>
                </v-btn>
            </a>
        </template>
        <span>Enviar mensaje</span>
    </v-tooltip>
</template>

<script>
export default {
    props:['cliente','tlf','producto'],
    
}
</script>

<style >

</style>