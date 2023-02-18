<template>
     <v-dialog v-model="$props.modal" max-width="60%">
            <v-card class="px-5 py-3" outlined >
                <v-card-title>
                    <v-icon class="mr-2" color="primary" large>mdi-cart</v-icon>
                    Pedido : {{ namePedido }}
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-btn icon color="error" @click="$emit('close')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-data-table :headers="cabecera" :items="datos" :search="search" :page.sync="page"
                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                    <template v-slot:[`item.number`]="{ index }">
                        <span>{{ index + 1 }} </span>
                    </template>
                    <!-- <template v-slot:[`item.img`]="{ item }">
                        <a :href="`https://www.importadorasupernova.com/compras.php?search=${item.codigo}`"
                            target="_blank" style="text-decoration:none !important">
                            <img :src="`https://www.importadorasupernova.com/imagenes/${item.id}/${item.imagen} `"
                                class="mt-1" alt="" width="50">
                        </a>
                    </template> -->
                    <template v-slot:[`item.name`]="{ item }">
                        <p class="mb-0">{{ item.nombre }} </p> 
                        <v-chip color="error" v-if="parseInt(item.almacen) <= 0 "> No hay disponibilidad </v-chip>
                        <v-chip color="warning" class="mt-0" v-else-if="parseInt(item.almacen) > 0 && parseInt(item.almacen) <= 10 "> Quedan poco disponible</v-chip>
                    </template>
                    <template v-slot:[`item.cant`]="{ item, index }">
                        <div v-if="item.edit" class="d-flex">
                            <v-text-field v-model="item.cantidad" type="number"></v-text-field>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary"
                                        @click="updatedCantidad(item, index)"><v-icon>mdi-refresh</v-icon></v-btn>
                                </template>
                                <span>Actualizar</span>
                            </v-tooltip>
                        </div>

                        <v-chip color="warning" v-else @click="item.edit = !item.edit">{{ item.cantidad }} </v-chip>

                    </template>
                    <template v-slot:[`item.price`]="{ item, index }">
                        <div v-if="item.editPrice" class="d-flex">
                            <v-text-field v-model="item.precio" type="number"></v-text-field>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary"
                                        @click="updatedCantidad(item, index)"><v-icon>mdi-refresh</v-icon></v-btn>
                                </template>
                                <span>Actualizar</span>
                            </v-tooltip>
                        </div>
                        <v-chip color="ticket" v-else @click="item.editPrice = !item.editPrice" class="white--text">${{
                            item.precio
                        }} </v-chip>
                    </template>
                    <template v-slot:[`item.total`]="{ item }">
                        <span class="success px-2 py-2 white--text">
                            ${{parseFloat(item.cantidad *parseFloat(item.precio)) | precio}}.00
                        </span>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="error" class="mr-2" icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-delete-empty-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                        <btn-whatsapp
                        :cliente="namePedido"
                        :tlf="phoneUser"
                        :producto="item.nombre"
                        ></btn-whatsapp>
                    </template>
                </v-data-table>
                <v-card-actions>
                    <v-row>
                        <v-col cols="6">
                            <v-chip color="warning" label>
                                <span class="h2--text white--text">Total:${{ total | precio}}.00 </span>
                            </v-chip>
                            <v-btn class="ml-2"  color="error">
                                Eliminar carrito
                                <v-icon class="ml-1">mdi-delete-empty-outline</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
</template>

<script>
import BtnWhatsapp from '../elements/btnWhatsapp.vue';
export default {
    props:['modal','namePedido','phoneUser','datos','cabecera'],
    components:{BtnWhatsapp},
    data(){
        return{
            itemsPerPage:10,
            page:0,
            search:'',
        }
    },

    filters:{
        precio(value) {
                return value.toLocaleString('en');
        }
    },

    computed:{
        total(){
            const acumular = (acumulador,pedido) => acumulador + (parseFloat(pedido.cantidad)*parseFloat(pedido.precio))
            return this.datos.reduce(acumular,0)
        }
    },


}
</script>

<style>

</style>