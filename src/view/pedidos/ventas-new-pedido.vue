<template>
   <container class="mt-5">
    <v-dialog v-model="modal_product" max-width="1000">
        <v-card >
            <v-card-title>
                <v-col cols="12" class="d-flex justify-space-between">
                    <h3 class="primary--text">Selecciona el producto agregar</h3>
                    <v-btn color="error" icon @click="closeModalProduct"><v-icon>mdi-close</v-icon> </v-btn>
                </v-col>
            </v-card-title>
            <v-card-text>
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center primary white--text">
                                Codigo
                            </th>
                            <th class="text-center primary white--text">
                                Nombre
                            </th>
                            <th class="text-center primary white--text">
                                Precio
                            </th>
                            <th class="text-center primary white--text">
                            Cantidad
                            </th>
                            <th class="text-center primary white--text">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item,index) in productosCodigo"
                        :key="index"
                        >
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.nombre }}</td>
                            <th class="text-center">
                                <v-chip color="warning" label>${{item.precio}}.00 </v-chip>
                            </th>
                            <td>
                                <v-text-field type="number" v-model="productosCodigo[index].cantidad" placeholder="0"></v-text-field>
                            </td>
                            <td class="text-center">
                                <v-btn class="primary" @click="addProductAlmacen(item,index)" :disabled="item.inventario > 0">Agregar <v-icon class="ml-1">mdi-plus-circle</v-icon> </v-btn>
                                <v-chip class="success ml-2"  label v-if="item.inventario === '0'"><v-icon color="white">mdi-check</v-icon></v-chip>
                                <v-chip class="error ml-2" label v-else><v-icon color="white">mdi-close</v-icon></v-chip>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table> 
            </v-card-text>
            
        </v-card>
    </v-dialog>

    <modal-confirm-delete
    :modal="modal_confirm_delete"
    :data="productDelete"
    @close="closeModalDelete"
    @confirm="deleteItemPedido"
    ></modal-confirm-delete>

    <modal-confirm-pedido
    :modal="modal_confirm_pedido"
    @close="closeModalConfirm"
    @confirm="savePedido"
    ></modal-confirm-pedido>

    <v-row>
        <v-col cols="12">
            <v-card elevation="1" class="mt-5 px-4">
                 <v-row>
                    <v-col cols="12" sm="12" md="8" lg="8">
                            <h3 class="primary--text">{{title}}</h3>  

                                <v-row class="mt-3">
                                    <v-col cols="12" sm="4" md="4">
                                        <v-autocomplete
                                        :items="usuarios"
                                        item-text="fullName"
                                        item-value="id"
                                        label="Seleccionar Cliente"
                                        v-model="cliente"
                                        outlined
                                        return-object
                                        @change="getProductsCar(cliente)"
                                        :disabled="clienteCar"
                                        ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
                                        <v-autocomplete
                                        :items="products"
                                        item-text="fullname"
                                        item-value="id"
                                        label="Filtrar producto por Codigo o Nombre"
                                        return-object
                                        v-model="producto"
                                        outlined
                                        @change="getProductId(producto)"
                                        v-if="cliente.id != null"
                                        ></v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="4" md="4">
                                        <v-btn class="primary" @click="addNuevo()" v-if="clienteCar">Agregar pedido nuevo</v-btn>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card class="px-5 py-3" outlined v-if="pedido.length>0">
                                            <v-card-title>
                                                <v-icon class="mr-2" color="primary" large>mdi-file-multiple</v-icon>
                                                Pedido
                                                <v-spacer></v-spacer>
                                                <v-spacer></v-spacer>
                                            </v-card-title>
                                            <v-data-table
                                                :headers="header"
                                                :items="pedido"
                                                :search="search"
                                                :page.sync="page"
                                                :items-per-page="itemsPerPage"
                                                mobile-breakpoint="0"
                                            >
                                                <template v-slot:[`item.number`]="{ index }">
                                                    <span>{{ index + 1 }} </span>
                                                </template>
                                                <template v-slot:[`item.img`]="{ item }">
                                                    <a :href="`https://www.importadorasupernova.com/compras.php?search=${item.codigo}`" target="_blank" style="text-decoration:none !important">
                                                        <img :src="`https://www.importadorasupernova.com/imagenes/${item.id}/${item.imagen} `" class="mt-1" alt="" width="50">
                                                    </a>
                                                </template>
                                                <template v-slot:[`item.cant`]="{ item,index }">
                                                    <div v-if="item.edit" class="d-flex">
                                                        <v-text-field v-model="item.cantidad" type="number"  ></v-text-field>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary" @click="updatedCantidad(item,index)"><v-icon>mdi-refresh</v-icon></v-btn>
                                                            </template>
                                                            <span>Actualizar</span>
                                                        </v-tooltip>
                                                    </div>
                                        
                                                    <v-chip color="success" v-else @click="item.edit = !item.edit">{{ item.cantidad }} </v-chip>
                                                    
                                                </template>
                                                <template v-slot:[`item.price`]="{ item,index }">
                                                    <div v-if="item.editPrice" class="d-flex">
                                                        <v-text-field v-model="item.precio" type="number"  ></v-text-field>
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary" @click="updatedCantidad(item,index)" ><v-icon>mdi-refresh</v-icon></v-btn>
                                                            </template>
                                                            <span>Actualizar</span>
                                                        </v-tooltip>
                                                    </div>
                                                    <v-chip color="ticket" v-else @click="item.editPrice = !item.editPrice" class="white--text">${{ item.precio}} </v-chip>
                                                </template>
                                                <template v-slot:[`item.total`]="{ item }">
                                                <span class="success px-2 py-2 white--text"
                                                    >${{parseFloat(item.cantidad * parseFloat(item.precio))}}
                                                </span>
                                                </template>
                                                <template v-slot:[`item.actions`]="{ item }">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        color="error"
                                                        class="mr-2"
                                                        icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        @click="deleteItemConfirm(item)"
                                                    >
                                                        <v-icon>mdi-delete-empty-outline</v-icon>
                                                    </v-btn>
                                                    </template>
                                                    <span>Eliminar</span>
                                                </v-tooltip>
                                                </template>
                                            </v-data-table>
                                            <v-card-actions>
                                                <v-row>
                                                    <v-col cols="6">
                                                        <v-chip color="warning" label>
                                                            <span class="h2--text white--text">Total:${{total}} </span>
                                                        </v-chip> 
                                                    </v-col>
                                                </v-row>
                                            </v-card-actions>
                                            </v-card>
                                    </v-col>
                                </v-row>
                    </v-col>
                    
                    <datos-personales
                    :data="info"
                    @selected="asignarPaqueteria"
                    ></datos-personales>

                    <v-col cols="12" class="text-right"> 
                        <v-btn class="primary"  @click="addPedido()" ><v-icon class="mr-1" >mdi-content-save-outline</v-icon>Guardar pedido</v-btn>
                    </v-col>
                </v-row>
            </v-card>

            <card-carritos
            :datos="cars"
            @selected="selectCarrito"
            ></card-carritos>

        </v-col>
     </v-row>
   </container>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
import cardCarritos from '@/components/pedidos/card-carritos.vue'
import ModalConfirmDelete from '@/components/pedidos/modal-confirm-delete.vue'
import DatosPersonales from '@/components/pedidos/datos-personales.vue'
import ModalConfirmPedido from '@/components/pedidos/modal-confirm-pedido.vue'
export default {
  components: { cardCarritos, ModalConfirmDelete, DatosPersonales, ModalConfirmPedido },
    data(){
        return{
            products:[],
            producto:{},
            productDelete:{},
            productosCodigo:[],
            cliente:{},
            clienteCar:false,
            usuarios:[],
            pedido:[],
            cars:[],
            page: 1,
            pageCount: 0,
            itemsPerPage: 100,
            search: "",
            modal_product:false,
            modal_confirm_delete:false,
            modal_confirm_pedido:false,            
            id_delete:null,

            info:{
                id:null,
                nombre:'',
                apellido:'',
                direccion:'',
                colonia:'',
                ciudad:'',
                estado:'',
                codigo:'',
                telefono:'',
                rfc:'',
                orden:'',
                newOrden:'',
                paqueteria:'',
                fullName:'',
                pedido:[]
            },
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
                {
                text: "Imagen",
                value: "img",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Nombres",
                value: "nombre",
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
        }
    },

    mounted(){
        this.getAllProducts()
        this.getUsers()
        this.getAllsCar()
    },

    computed:{
        total(){
            const acumular = (acumulador,pedido) => acumulador + (parseFloat(pedido.cantidad)*parseFloat(pedido.precio))
            return this.pedido.reduce(acumular,0)
        },
        title(){
            return this.clienteCar === false ? 'Agregar pedido nuevo' : 'Actualizar el pedido'
        },

        cantidades(){
            const acumular = (acumulador,pedido) => acumulador + (parseInt(pedido.cantidad))
            return this.pedido.reduce(acumular,0)
        }
    },

    methods:{
        ...mapMutations('notification',['setActiveModal','setDesactiveModal']),

        async getAllProducts(){
            try{
                const response = await axios.get('/productos/productos');
                if(response.status == 200){
                    this.products = response.data;
                }
            }catch(e){
                console.log(e);
            }
        },

        async getUsers(){
            try{
                const response = await axios.get(`/usuarios/`);
                if(response.status == 200){
                    this.usuarios = response.data
                }
            }catch(e){
                console.log(e)
            }
        },

        async getAllsCar(){
            try
            {
                const response = await axios.get(`/productos/productosCarrito?cars=cars`)
                this.cars = response.data
            }catch(e)
            {
                console.log(e)
            }
        },

        async getProductId(producto){
            let codigo = producto.codigo
            try{
                const response = await axios.get(`productos/productos?codigo=${codigo}`);
                if(response.status == 200){
                    this.productosCodigo = response.data   
                    this.modal_product = true
                }
                
            }catch(e){
                console.log(e)
            }
        },

        
        async addProductAlmacen(data,index){
           // this.setActiveOverlay()
            let cantidad = parseInt(data.cantidad);
            console.log(cantidad)

            if(cantidad <= 0 || cantidad === '' || isNaN(cantidad) ){
                //this.setDesactiveOverlay()
                let data = {"status":"warning","icon":"mdi-alert-circle","title":"Pendiente","text":'Debes agregar una cantidad mayor a 0',"textButton":"Cerrar" }
                this.setActiveModal(data)
                setTimeout(()=>{
                    this.setDesactiveModal()
                },2500);
            }else{
                try{
                    let datos = {
                        "id_usuario":this.cliente.id, 
                        "id_producto":parseInt(data.id),
                        "cantidad":cantidad,
                        "precio":parseFloat(data.precio)
                    }   
                    const response = await axios.post('/productos/productosCarrito',datos);

                    if(response.status == 200){
                        this.productosCodigo.splice(index,1);
                        this.getProductsCar(this.cliente)
                        this.getAllsCar()
                        if(this.productosCodigo.length === 0){
                            this.closeModalProduct()
                        }
                        console.log(response.data)
                        // this.setDesactiveOverlay()
                        // this.success.text = 'Producto agregado exitosamente'
                        // this.setActiveNotification(this.success)
                    }
                }catch(e){
                    console.log(e);
                }
                

            }
        },

        async getProductsCar(cliente){
            this.pedido = []
            try{
                const response = await axios.get(`/productos/productosCarrito?id=${cliente.id}`);
                const data = response.data
                data.forEach(element => {
                    let filter = this.pedido.filter(item => item.id === element.id);
                    console.log(filter)
                    if(filter.length === 0){
                        console.log(element)
                        this.pedido.push(element)
                    }
                }); 
                this.asignedData(cliente)
                console.log(this.pedido)
            }catch(e){
                console.log(e)
            }
        },

        asignedData(cliente){
            this.info.nombre    = cliente.nombre
            this.info.apellido  = cliente.apellido
            this.info.direccion = cliente.direccion
            this.info.colonia   = cliente.colonia
            this.info.ciudad    = cliente.ciudad
            this.info.estado    = cliente.estado
            this.info.codigo    = cliente.codigop
            this.info.telefono  = cliente.telefono
            this.info.rfc       = cliente.rfc
            this.info.orden    = parseInt(cliente.orden)+1 
            this.info.id       = parseInt(cliente.id)
            this.info.newOrden = `${this.info.id}-${this.info.orden}`  
        },

        selectCarrito(item){
            this.getProductsCar(item)
            this.cliente = item
            this.clienteCar = true
        },

        closeModalProduct(){
            this.modal_product = false
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

        addNuevo(){
            this.clienteCar = false
            this.cliente = {}
            this.pedido = []
        },

        deleteItemConfirm(item){
            this.id_delete = item.id_carrito
            this.productDelete = Object.assign({},item)
            this.modal_confirm_delete = true
        },

        async deleteItemPedido(){
            try{
                const response = await axios.delete(`/productos/productosCarrito?id=${this.id_delete}`);
                if(response.status == 200){
                    this.getProductsCar(this.cliente)
                    this.closeModalDelete()
                    if(this.pedido.length == 0){
                        this.getAllsCar()
                    }
                }
            }catch(e){
                console.log(e)
            }
        },

        closeModalDelete(){
            this.modal_confirm_delete = false
            this.id_delete = null
            this.productDelete = {}
        },

        addPedido(){
            if(this.pedido.length === 0){
                let data = {"status":"warning","icon":"mdi-alert-circle","title":"Pendiente","text":'Aun no tienes un pedido agregado',"textButton":"Cerrar" }
                this.setActiveModal(data)
                setTimeout(()=>{
                    this.setDesactiveModal()
                },2500);
            }else{
                this.modal_confirm_pedido = true
            }
        },

        closeModalConfirm(){
            this.modal_confirm_pedido = false
        },

        async savePedido(){
            try
            {   
                this.info.pedido = this.pedido
                this.info.fullName = `${this.info.nombre} ${this.info.apellido}`
                this.info.cantidad = this.cantidades
                this.info.total = this.total
                const response = await axios.post(`/ventas/registrarPedido`,this.info)
                if(response.status == 200){
                    this.modal_confirm_pedido = false
                    let mensaje = `${response.data.mensaje}, su orden es: ${response.data.orden}`
                    let data = {"status":"success","icon":"mdi-check-circle-outline","title":"EXITOSO","text":mensaje,"textButton":"Cerrar" }
                    this.setActiveModal(data)
                    setTimeout(()=>{
                        this.setDesactiveModal()
                    },4000);
                    this.resetFields()
                    this.getAllsCar()
                }
            }catch(e)
            {
                console.log(e)
            }
            
        },

        asignarPaqueteria(paqueteria){
            this.info.paqueteria = paqueteria
        },

        resetFields(){
            this.info.nombre    = ''
            this.info.apellido  = ''
            this.info.direccion = ''
            this.info.colonia   = ''
            this.info.ciudad    = ''
            this.info.estado    = ''
            this.info.codigo    = ''
            this.info.telefono  = ''
            this.info.rfc       = ''
            this.info.orden    = ''
            this.info.id       = ''
            this.info.newOrden = '' 
            this.info.pedido = []
            this.cliente = {}
            this.pedido = []
            this.clienteCar = false
        }
    }
}
</script>

<style lang="scss">
    .v-text-field.v-text-field--enclosed {
        margin-bottom: -29px !important;
        //background-color: rgba(13, 62, 221, 0.696);
    }

    .container-info{
        border-radius: 5px;
    }
</style>