<template>
    <container class="mt-5">

        <!-- modal para agregar productos -->
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
                            >
                                <td>{{ productosCodigo.codigo }}</td>
                                <td>{{ productosCodigo.nombre }}</td>
                                <th class="text-center">
                                    <v-chip color="warning" label>${{productosCodigo.preciou}}.00 </v-chip>
                                </th>
                                <td>
                                    <v-text-field type="number" @keyup="soloNumeros($event)" v-model="productosCodigo.cantidad" placeholder="0" min="0"></v-text-field>
                                </td>
                                <td class="text-center">
                                    <v-btn class="primary" @click="addProductAlmacen(productosCodigo,index)" :disabled="parseInt(productosCodigo.almacen) <= 0">
                                        <span v-if="parseInt(productosCodigo.almacen) > 0 ">Agregar <v-icon class="ml-1">mdi-plus-circle</v-icon></span>  
                                        <span v-else>No disponible<v-icon class="ml-1">mdi-tag-off</v-icon></span>  
                                    </v-btn>
                                    <v-chip class="success ml-2"  label v-if="parseInt(productosCodigo.almacen) > 0 "><v-icon color="white">mdi-check</v-icon></v-chip>
                                    <v-chip class="error ml-2" label v-else><v-icon color="white">mdi-close</v-icon></v-chip>
                                </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table> 
                </v-card-text>
                
            </v-card>
        </v-dialog>

        <!-- modal para confirmar eliminacion -->
        <modal-confirm-delete
        :modal="modal_confirm_delete"
        :data="productDelete"
        @close="closeModalDelete"
        @confirm="deleteItemPedido"
        ></modal-confirm-delete>

        <!-- modal para confirmar pedido -->
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
                                        <v-col cols="12" sm="3" md="3">
                                            <v-autocomplete
                                            :items="usuarios"
                                            item-text="fullName"
                                            item-value="id"
                                            :label="usuarios.length === 0 ? 'Cargando usuarios' : 'Seleccione usuario'"
                                            v-model="cliente"
                                            outlined
                                            return-object
                                            :append-icon="usuarios.length === 0 ? 'mdi-reload-alert' : 'mdi-arrow-down-bold'"
                                            @change="getProductsCar(cliente)"
                                            :disabled="clienteCar || usuarios.length === 0"
                                            ></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" sm="3" md="3">
                                            <v-autocomplete
                                            :items="usuariosEspeciales"
                                            item-text="fullName"
                                            item-value="id"
                                            label="Seleccione usuario especial"
                                            v-model="cliente"
                                            outlined
                                            return-object
                                            append-icon="mdi-arrow-down-bold"
                                            @change="getProductsCar(cliente)"
                                            ></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" sm="3" md="3">
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
                                        <v-col cols="12" sm="3" md="3">
                                            <v-btn class="primary" @click="addNuevo()" v-if="clienteCar">Agregar pedido nuevo</v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <br>
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
                                                    <template v-slot:[`item.precio_old`]="{ item }">
                                                        <v-chip outlined label color="error" v-if="item.precio_viejo !== ''" > <v-icon>mdi-tag</v-icon> ${{ item.precio_viejo }} </v-chip>
                                                        <span class="error--text" v-else>No posee</span>
                                                    </template>
                                                    <template v-slot:[`item.cant`]="{ item,index }">
                                                        <div v-if="item.edit" class="d-flex">
                                                            <v-text-field v-model="pedido[index].cantidad" type="number"  ></v-text-field>
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary" @click="updatedCantidad(item,index)"><v-icon>mdi-refresh</v-icon></v-btn>
                                                                </template>
                                                                <span>Actualizar</span>
                                                            </v-tooltip>
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="error" @click="item.edit = !item.edit"><v-icon>mdi-close</v-icon></v-btn>
                                                                </template>
                                                                <span>cancelar</span>
                                                            </v-tooltip>
                                                        </div>
                                            
                                                        <v-chip color="success" v-else @click="item.edit = !item.edit">{{ item.cantidad }} </v-chip>
                                                        
                                                    </template>
                                                    <template v-slot:[`item.price`]="{ item }">
                                                        <div v-if="item.editPrice" class="d-flex">
                                                            <v-text-field v-model="item.precio" type="number"  ></v-text-field>
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="primary" @click="updatePrecio(item)" ><v-icon>mdi-refresh</v-icon></v-btn>
                                                                </template>
                                                                <span>Actualizar</span>
                                                            </v-tooltip>
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn class="mt-2" v-bind="attrs" v-on="on" icon color="error" @click="item.editPrice = !item.editPrice"><v-icon>mdi-close</v-icon></v-btn>
                                                                </template>
                                                                <span>cancelar</span>
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
                                                        <v-col cols="6" class="text-right">
                                                            <v-chip color="primary" label>
                                                                <span class="h2--text white--text"> Total Productos: {{ totalProductos }} Pz </span>
                                                            </v-chip>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-actions>
                                                </v-card>
                                        </v-col>
                                    </v-row>
                        </v-col>
                        
                        <!-- componente de datos personales -->
                        <datos-personales
                        :data="info"
                        @selected="asignarPaqueteria"
                        ></datos-personales>

                        <v-col cols="12" class="text-right"> 
                            <v-btn class="primary"  @click="addPedido()" ><v-icon class="mr-1" >mdi-content-save-outline</v-icon>Guardar pedido</v-btn>
                        </v-col>
                    </v-row>
                </v-card>

                <!-- componente de carrito, donde se listan los carritos -->
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
import {mapMutations,mapActions} from 'vuex'
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
            productosCodigo:{},
            cliente:{},
            clienteCar:false,
            usuarios:[],
            usuariosEspeciales:[],
            pedido:[],
            cars:[],
            codigos:[],
            page: 1,
            pageCount: 0,
            itemsPerPage: 100,
            search: "",
            modal_product:false,
            modal_confirm_delete:false,
            modal_confirm_pedido:false,            
            id_delete:null,
            elPrecio:0,
            cambioDelete:false,

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
                // {
                // text: "Imagen",
                // value: "img",
                // align: "center",
                // class: "primary white--text px-0 mx-0",
                // },
                {
                text: "Nombre del producto",
                value: "nombre",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Precio anterior($)",
                value: "precio_old",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Cantidad de productos(Pz)",
                value: "cant",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Precio ($)",
                value: "price",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Total($)",
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
        this.getUsersEspecial()
    },

    //variables computadas
    computed:{
        //variable para tener el total de suma del pedido
        total(){
            const acumular = (acumulador,pedido) => acumulador + (parseFloat(pedido.cantidad)*parseFloat(pedido.precio))
            return this.pedido.reduce(acumular,0)
        },

        totalProductos(){
            const acumular = (acumulador,pedido) => acumulador + (parseFloat(pedido.cantidad))
            return this.pedido.reduce(acumular,0)
        },

        //variable para titulo de modal 
        title(){
            return this.clienteCar === false ? 'Agregar pedido nuevo' : 'Actualizar el pedido'
        },

        //variable para llevar acumulador de las cantidades de los productos
        cantidades(){
            const acumular = (acumulador,pedido) => acumulador + (parseInt(pedido.cantidad))
            return this.pedido.reduce(acumular,0)
        }
    },

    methods:{
        // store para activar modal de notificacion
        ...mapMutations('notification',['setActiveModal','setDesactiveModal']),

        //store para los pedidos pagados
        ...mapActions('pedidos',['getAllPedidosPagados']),

        //metodo para solo permitir numeros en un campo de texto 
        soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
        },

        //metodo para traer todos los productos
        async getAllProducts(){
            try{
                const response = await axios.get('/productos/productos?total=total');
                if(response.status == 200){
                    this.products = response.data;
                }
            }catch(e){
                console.log(e);
            }
        },

        //metodo que trae todos los usuarios para seleccionar para pedidos
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

         //metodo que trae todos los usuarios especiales
        async getUsersEspecial(){
            try{
                const response = await axios.get(`/usuarios/index.php?especial=especial`);
                if(response.status == 200){
                    this.usuariosEspeciales = response.data
                }
            }catch(e){
                console.log(e)
            }
        },
        

        //metodo para traer carritos de pedidos almacenados
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



        //metodo para filtrar los productos por codigo
        getProductId(producto){
            this.productosCodigo = Object.assign({},producto)
            this.productosCodigo.cantidad = null
            this.modal_product = true
        },

        
        //metodo para verificar el precio, descuento o no
        verificarPrice(item,cantidadTotal){
            console.log(item,cantidadTotal)
            let price = null;
            if(item.descuento == "si"){
                price = item.descuento_precio_docena
            }else{
                    if(cantidadTotal>=parseInt(item.topem)){
                        if(cantidadTotal>=parseInt(item.topem) && cantidadTotal<parseInt(item.topec)){
                            price = parseInt(item.preciom)
                        }else{
                            if(item.topev === "" || item.topev === "0"){
                                if(cantidadTotal>=parseInt(item.topec)){
                                    price = parseInt(item.precioc)
                                }else{
                                    price = parseInt(item.preciom) 
                                }
                            }else{
                                if(cantidadTotal>=parseInt(item.topec) && cantidadTotal<parseInt(item.topev)){
                                    price = parseInt(item.precioc)
                                }else{
                                    if(cantidadTotal>=parseInt(item.topev)){
                                        price = parseInt(item.preciov) 
                                    }else{
                                        price = parseInt(item.precioc)
                                    }
                                }
                            }
                        }
                    }else{
                        price = parseInt(item.preciou)
                    }
            }
            return price;
            },



        //metodo para agregar productos al pedido
        async addProductAlmacen(data){
            let cambio = false;
            let filtro = this.codigos.find(producto => producto.codigo === data.codigo)
            let cantidadTotal = 0;

            if(filtro !== undefined){
                let index = this.codigos.findIndex(item => item.codigo == filtro.codigo)

                this.codigos[index].cantidad = parseInt(this.codigos[index].cantidad)  + parseInt(data.cantidad) 
                cantidadTotal = parseInt(this.codigos[index].cantidad)  + parseInt(data.cantidad) 
                this.elPrecio = this.verificarPrice(data,cantidadTotal)

                if(this.elPrecio !== filtro.precio){
                    cambio = true;
                }

            }else{
                cantidadTotal = data.cantidad
                this.elPrecio = this.verificarPrice(data,cantidadTotal)
            }
            

            //definimos la cantidad parseandola a 0
            let cantidad = parseInt(data.cantidad);


            //validamos si es menor que 0 , si esta vacia o si no esta definida como entero
            if(cantidad <= 0 || cantidad === '' || isNaN(cantidad) ){
                let data = {"status":"warning","icon":"mdi-alert-circle","title":"Pendiente","text":'Debes agregar una cantidad mayor a 0',"textButton":"Cerrar" }
                this.setActiveModal(data)
                setTimeout(()=>{
                    this.setDesactiveModal()
                },2500);
            }else{
                try{
                    //definimos body para envio de peticion
                    let datos = {
                        "id_usuario":this.cliente.id, 
                        "id_producto":parseInt(data.id),
                        "codigo":data.codigo,
                        "cantidad":cantidad,
                        "precio":parseFloat(this.elPrecio),
                        "cambio":cambio,
                        "action":'add'
                    }   
                    const response = await axios.post('/productos/productosCarrito',datos);

                    if(response.status == 200){
                        this.productosCodigo = {}
                        this.getProductsCar(this.cliente,'add')
                        this.getAllsCar()
                        this.closeModalProduct()
                        // console.log(response.data)
                    }
                }catch(e){
                    console.log(e);
                }
                

            }
        },

        //metodo para traer todos los productos de un carrito segun ID del cliente
        //traemos todos los productos que tenga agregado al carrito
        async getProductsCar(cliente,action){
            this.pedido  = []
            this.codigos = []
            try{
                const response = await axios.get(`/productos/productosCarrito?id=${cliente.id}`);
                this.pedido = response.data
                this.setDataPedido(response.data,action)
                this.asignedData(cliente)
            }catch(e){
                console.log(e)
            }
        },

        setDataPedido(data,action){
            let codigos = []
            for(let i=0;i<data.length;i++){

                let filtro = codigos.find(producto => producto.codigo === data[i].codigo)

                if(filtro === undefined){
                    codigos.push({
                        "codigo": data[i].codigo,
                        "cantidad": data[i].cantidad,
                        "precio":action === 'add' ?  this.elPrecio : data[i].precio
                    })
                }else{
                    let index = codigos.findIndex(item => item.codigo === filtro.codigo)
                    codigos[index].cantidad = parseInt(codigos[index].cantidad)  + parseInt(data[i].cantidad)
                }
            }

            this.codigos = [...codigos]
            this.elPrecio = 0

        },

        //metodo para parsear los datops del cliente al componente de datos personales
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

        //metodo que permite agregar al componente principal el carrito seleccionado
        selectCarrito(item){
            this.getProductsCar(item,'read')
            this.cliente = item
            this.clienteCar = true
        },

        //funcion para cerrar modal de productos a seleccionar
        closeModalProduct(){
            this.modal_product = false
        },

        //metodo para actualizar la cantidad de productos seleccionados
        async updatedCantidad(item,index){
            let cambio = false;
            let filtro = this.codigos.find(producto => producto.codigo === item.codigo)
            let cantidadTotal = 0;

            if(filtro !== undefined){
                let index = this.codigos.findIndex(item => item.codigo == filtro.codigo)
                cantidadTotal = (parseInt(this.codigos[index].cantidad) - parseInt(item.cantidad_old))   + parseInt(item.cantidad) 
                this.codigos[index].cantidad = cantidadTotal
                console.log('total',this.codigos[index].cantidad,item.cantidad,item.cantidad_old)
                this.elPrecio = this.verificarPrice(item,cantidadTotal)

                if(this.elPrecio !== filtro.precio){
                    cambio = true;
                }

            }else{
                cantidadTotal = item.cantidad
                this.elPrecio = this.verificarPrice(item,cantidadTotal)
            }
            

            this.pedido[index].edit = false
            this.pedido[index].editPrice = false 


            try
            {
                let data = {
                    "id_usuario":this.cliente.id, 
                    "id_producto":parseInt(item.id),
                    "codigo":item.codigo,
                    "cantidad":parseInt(item.cantidad),
                    "precio":this.elPrecio,
                    "cambio":cambio,
                    "modificar":'cantidad'
                }
                const response = await axios.put(`/productos/productosCarrito?id=${item.id_carrito} `,data);
                if(response.status == 200){
                    this.getProductsCar(this.cliente,'add')
                }
            }catch(e)
            {
                console.log(e)
            }
        }, 

        async updatePrecio(dato){
            let index = this.codigos.findIndex(item => item.codigo == dato.codigo)
            this.codigos[index].precio = dato.precio
            let data = {
                    "id_usuario":this.cliente.id, 
                    "codigo":dato.codigo,
                    "precio":parseFloat(dato.precio),
                    "modificar":"precio"
            }
            try{
                const response = await axios.put(`/productos/productosCarrito`,data)
                if(response.status ==  200){
                    this.getProductsCar(this.cliente,'add')
                }
            }catch(e){
                console.log(e)
            }
        },

        //metodo para iniciar nuevo pedido
        addNuevo(){
            this.clienteCar = false
            this.cliente = {}
            this.pedido = []
        },

        //metodo para confirmar una eliminacion de un item de producto
        deleteItemConfirm(item){
            this.id_delete = item.id_carrito
            this.productDelete = Object.assign({},item)
            this.modal_confirm_delete = true

            let filtro = this.codigos.find(producto => producto.codigo === item.codigo)
            let cantidadTotal = 0;

            if(filtro !== undefined){
                let index = this.codigos.findIndex(item => item.codigo == filtro.codigo)

                this.codigos[index].cantidad = parseInt(this.codigos[index].cantidad) - parseInt(item.cantidad) 
                cantidadTotal = parseInt(this.codigos[index].cantidad)   
                this.elPrecio = this.verificarPrice(item,cantidadTotal)

                if(this.elPrecio !== filtro.precio){
                    this.cambioDelete = true;
                }

            }else{
                cantidadTotal = 0
                this.elPrecio = this.verificarPrice(item,cantidadTotal)
            }

        },

        //funcion que elimina item de un carrito y lo actualiza
        async deleteItemPedido(){
            try{
                let data = {
                    "id_delete":this.id_delete,
                    "precio":this.elPrecio,
                    "id_usuario":this.cliente.id,
                    "codigo":this.productDelete.codigo,
                    "cambio":this.cambioDelete,
                    "action":"delete"
                }
                const response = await axios.post(`/productos/productosCarrito`,data);
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

        //cerrar modal de eliminacion 
        closeModalDelete(){
            this.modal_confirm_delete = false
            this.id_delete = null
            this.productDelete = {}
        },

        //metodo para confirmar que un pedido esta correcto para guardar
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
        
        //cerrar modal de confirmacion
        closeModalConfirm(){
            this.modal_confirm_pedido = false
        },

        //metodo que guarda pedido , crea un folio nuevo para un cliente 
        async savePedido(){
            try
            {   
                //fedinimos los datos del body
                this.info.pedido = this.pedido
                this.info.fullName = `${this.info.nombre} ${this.info.apellido}`
                this.info.cantidad = this.cantidades
                this.info.total = this.total
                this.info.paqueteria = this.info.paqueteria === '' ? 'ENTREGA EN BODEGA' : this.info.paqueteria
                this.info.envio = this.info.paqueteria === '' ? 'No' : 'Si'

                //llamado a la api post
                const response = await axios.post(`/ventas/registrarPedido`,this.info)

                //validamos que la respuesta a la transaccion sea exitosa
                if(response.status == 200){
                    this.getUsers()
                    this.modal_confirm_pedido = false
                    let mensaje = `${response.data.mensaje}, su orden es: ${response.data.orden}`
                    let data = {"status":"success","icon":"mdi-check-circle-outline","title":"EXITOSO","text":mensaje,"textButton":"Cerrar" }
                    this.setActiveModal(data)
                    this.getAllPedidosPagados()
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

        //metodo donde asignamos paqueteria
        asignarPaqueteria(paqueteria){
            this.info.paqueteria = paqueteria
        },

        //metodo para resetear los campos y limpiar variables
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

    .container-info{
        border-radius: 5px;
    }
</style>