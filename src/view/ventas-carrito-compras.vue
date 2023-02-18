<template>
    <v-container class="mt-5">

        <modal-view-carrito
        :modal="modal_pedido"
        :datos="pedido"
        :cabecera="header"
        :namePedido="nombre_pedido"
        :phoneUser="telefono"
        @close="closeModal"
        ></modal-view-carrito>

        <card-carrito
        v-if="carts.length > 0"
        :items="carts"
        @getFind="getCartUser"
        ></card-carrito>

        <v-row v-else>
            <v-col cols="12">
                <v-alert type="warning">
                    No se encontraron resultados.
                </v-alert>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import axios from 'axios'
import ModalViewCarrito from '@/components/carritos/modal-view-carrito.vue'
import CardCarrito from '@/components/carritos/card-carrito.vue'
import { mapActions, mapState } from 'vuex'
export default {
  components: {  ModalViewCarrito, CardCarrito },
    data: () => ({
        pedido:[],
        nombre_pedido:'',
        modal_pedido:false,
        telefono:'',
        header: [
                {
                text: "#",
                value: "number",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Codigo",
                value: "codigo",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                // {
                // text: "Imagen",
                // value: "img",
                // align: "center",
                // class: "primary white--text px-0 mx-0",
                // },
                {
                text: "Nombres",
                value: "name",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Cantidad de productos",
                value: "cant",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Precio",
                value: "price",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Total",
                value: "total",
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
    }),

    mounted() {
        this.findAllCarritos()
    },


    computed:{
        total(){
            const acumular = (acumulador,pedido) => acumulador + (parseFloat(pedido.cantidad)*parseFloat(pedido.precio))
            return this.pedido.reduce(acumular,0)
        },
        
        ...mapState('pedidos',['carts']),
    },

    methods: {
        //metodo para traer carritos de pedidos almacenados

        ...mapActions('pedidos',['findAllCarritos']),

        async getCartUser(item) {
            try {
                const response = await axios.get(`/productos/CarritoCompras?id=${item.id}`)
                this.pedido = response.data
                this.nombre_pedido = `${item.nombre} ${item.apellido}`
                this.telefono = item.telefono
                this.modal_pedido = true
                console.log(response.data)
            } catch (e) {
                console.log(e)
            }
        },

        async updatedCantidad(item,index){
            this.pedido[index].edit = false
            this.pedido[index].editPrice = false
            console.log(item)
            try
            {
                let data = {"cantidad":parseInt(item.cantidad),"precio":parseInt(item.precio)}
                const response = await axios.put(`/productos/productosCarrito?id=${item.id_carrito} `,data);
                if(response.status == 200){
                    this.getProductsCar(this.cliente)
                }
            }catch(e)
            {
                console.log(e)
            }
        }, 

        closeModal(){
            this.modal_pedido = false
            this.pedido = []
        }
    }
}
</script>

<style lang="scss">
.card-carrito-compras {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 5px;
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    border-left: 4px solid rgb(20, 142, 34);
    transition: all .5s;

    .icon-cart {
        position: absolute;
        right: 2px;
        top: 2px;
    }

    p {
        margin: 0 !important;
    }

    .nombres {
        font-size: 15px;
        color: #2057a5;
        font-weight: bold;
        text-transform: capitalize;
    }

    .apellidos {
        font-size: 16px;
        color: rgb(55, 54, 54);
        margin-top: -4px !important;
        text-transform: capitalize;
    }

    .correo {
        font-size: 12px;
        margin-bottom: 10px !important;
    }

    .telefono {
        text-decoration: none !important;
    }


    &:hover {
        background-color: #2057a5;
        box-shadow: 1px 1px 9px 4px #e1e1e1;
        transform: translateY(-10px);

        .v-avatar {
            background-color: #fff !important;
            color: #2057a5 !important;
        }

        .icon-cart {
            color: #fff !important;
        }

        .nombres,
        .apellidos,
        .correo {
            color: #fff !important;
        }

        .correo .v-icon {
            color: #fff !important;
        }

    }
}
</style>