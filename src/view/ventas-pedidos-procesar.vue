<template>
    <v-container class="mt-3 contenedor" >  

        <!-- componente de los datos personales -->
        <pedidos-datos-personales
        ></pedidos-datos-personales>

        <!-- componente del modal para agregar producto -->
        <modal-add-producto
        :modalAdd="modal_add"
        @close="closeModalAdd"
        @add="addNewProducto"
        @activeNotification="notificationActive"
        ></modal-add-producto>

        <v-dialog v-model="modal_confirm" max-width="400">
            <v-card class="card_confirm">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-icon :color="modal_confirm_data.status" class="card_confirm__icon">{{modal_confirm_data.icon}}</v-icon>
                            <h1 class="card_confirm__title">{{modal_confirm_data.title}} </h1>
                            <p class="card_confirm__text">{{modal_confirm_data.texto}} </p>
                        </v-col>
                    </v-row>  
                </v-card-text>
            </v-card>
        </v-dialog>


        <transition 
            enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutUp"
            mode="out-in">
            <v-card class="card-info" color="light" v-if="scrollActive"> 
                <v-row class="mt-3">
                    <v-col cols="8" class="d-flex justify-space-around">
                        <h3 class="ticket--text"><v-icon color="ticket">mdi-cart-variant</v-icon> Pedido  Orden: {{$route.params.orden}} </h3> 
                        <v-chip color="success" outlined><v-icon>mdi-cash </v-icon> <span>Total:${{Total | precio}}.00 </span></v-chip>  
                        <v-btn class="primary" @click="modal_add = true"><v-icon>mdi-plus-circle</v-icon> AGREGAR PRODUCTO</v-btn> 
                    </v-col>
                    <v-col cols="12" v-if="!flag">
                        <v-alert type="error">
                            La orden no se puede procesar ya que existe uno o mas productos sin stock
                        </v-alert>
                    </v-col>  
                </v-row>
            </v-card>
        </transition>



        <v-row   id="scroll-target" style="max-height: 1000px" class="overflow-y-auto mt-3">
            <v-col cols="12" sm="12" md="7" lg="8">
                <v-card elevation="0"  v-scroll:#scroll-target="onScroll" align="center" justify="center" style="height: auto">
                    <v-card-title>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <h3 class="ticket--text"><v-icon color="ticket">mdi-cart-variant</v-icon> Pedido  Orden: {{$route.params.orden}} </h3> 
                            <v-chip color="success" outlined><v-icon>mdi-cash </v-icon> <span>Total:${{Total | precio}}.00 </span></v-chip>  
                            <v-btn class="primary" @click="modal_add = true"><v-icon>mdi-plus-circle</v-icon> AGREGAR PRODUCTO</v-btn>  
                        </v-col>
                        <v-col cols="12" v-if="!flag">
                            <v-alert type="error">
                                La orden no se puede procesar ya que existe uno o mas productos sin stock
                            </v-alert>
                        </v-col>  
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-2">
                            <v-col cols="12">
                                <v-data-table
                                    :headers="headerPedido"
                                    :items="pedidos"
                                    :search="search"
                                    :page.sync="page"
                                    :items-per-page="itemsPerPage"
                                    mobile-breakpoint="0"
                                    >

                                    <template v-slot:[`item.cant`]="{item,index}">
                                        <div class="cantidad">
                                            <v-text-field outlined v-model="item.cantidad" @keypress="soloNumeros($event)" type="number"></v-text-field>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="primary" @click="updateCantidad(item,index,1)" :disabled="parseInt(item.almacen) <= parseInt(item.cantidad)" class="btn-update"  v-bind="attrs" v-on="on">
                                                        <v-icon color="white">mdi-update</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Actualizar</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                    <template v-slot:[`item.nom`]="{item}">
                                        <span   v-if="parseInt(item.almacen) >= parseInt(item.cantidad)">{{item.nombre}}  </span>
                                        <span  class="white--text error"  v-else >{{item.nombre}} *sin stock* </span>
                                    </template>
                                    <template v-slot:[`item.cod`]="{item}">
                                        <v-chip label color="warning" v-if="parseInt(item.almacen) >= parseInt(item.cantidad)"><v-icon class="mr-1">mdi-barcode</v-icon> {{item.codigo}}  </v-chip>
                                        <v-chip label color="error" v-else><v-icon class="mr-1">mdi-barcode</v-icon> {{item.codigo}} </v-chip>
                                    </template>
                                    <template v-slot:[`item.price`]="{item,index}">
                                        <div class="cantidad" v-if="item.check" >
                                                <v-text-field type="number" @keypress="soloNumeros($event)" outlined v-model="item.precio" ></v-text-field>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn color="success" @click="updateCantidad(item,index,2)" class="btn-update"  v-bind="attrs" v-on="on">
                                                            <v-icon color="white">mdi-update</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Actualizar</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="error" class="btn-update"  v-bind="attrs" v-on="on" @click="item.check = !item.check">
                                                        <v-icon color="white">mdi-close</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Cancelar</span>
                                            </v-tooltip>
                                        </div>
                                        <v-chip label outlined color="ticket" class="price"  @click="item.check = !item.check"  style="font-weight:bold" v-else>${{item.precio | precio}}.00 </v-chip>
                                    </template>
                                    <template v-slot:[`item.import`]="{item}">
                                        <span class="success--text"  style="font-weight:bold">${{item.total | precio}}.00 </span>
                                    </template>
                                    <template v-slot:[`item.actions`]="{ item,index }">  
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-btn
                                                color="error"
                                                class="mr-2"
                                                icon
                                                v-bind="attrs"
                                                v-on="on"
                                                @click="deleteItem(item,index)"
                                            >
                                                <v-icon>mdi-trash-can</v-icon>
                                            </v-btn>
                                            </template>
                                            <span>Eliminar</span>
                                        </v-tooltip>
                                    </template>
                                
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="8" md="5" lg="4">
                <v-card elevation="0">
                    <v-card-title>
                        <h3 class="primary--text"><v-icon color="primary" class="mr-2">mdi-cash-register</v-icon>Método de pago </h3>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <v-col cols="12">
                                    <v-expansion-panels  multiple :disabled="credito">
                                        <v-expansion-panel>
                                            <v-expansion-panel-header class="primary">
                                                <h3 class="white--text"><v-icon large color="white">mdi-cash</v-icon>  EFECTIVO</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row class="mt-2">
                                                    <v-col cols="7" class="d-flex">
                                                        <v-checkbox
                                                        color="primary"
                                                        value="efectivo"
                                                        v-model="metodoPago"
                                                        ></v-checkbox>
                                                        <!-- <v-text-field outlined type="text"  @keypress="soloNumeros($event)" v-model="monto_efectivo" :disabled="showEfectivo" placeholder="0.00"></v-text-field> -->
                                                        <money v-model="monto_efectivo" v-bind="money" :disabled="showEfectivo" placeholder="0.00"></money>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header class="primary">
                                                <h3 class="white--text"><v-icon large color="white">mdi-cellphone-arrow-down</v-icon> TRANSFERENCIA</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row class="mt-2">
                                                    <v-col cols="12" class="d-flex justify-space-between" >
                                                        <v-row>
                                                            <v-col cols="2">
                                                                <v-checkbox
                                                                color="primary"
                                                                v-model="metodoPago"
                                                                value="transferencia"
                                                                ></v-checkbox>   
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <money v-model="monto_transferencia" v-bind="money" :disabled="showTransferencia" placeholder="0.00"></money>
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <v-autocomplete 
                                                                label="Seleccione el banco"
                                                                outlined 
                                                                :items="banks"
                                                                item-text="nombreBank"
                                                                item-value="codigo"
                                                                :disabled="showTransferencia"
                                                                v-model="banco_transferencia"
                                                                ></v-autocomplete>
                                                            </v-col>
                                                        </v-row>
                                                        <!-- <v-text-field outlined type="text"  @keypress="soloNumeros($event)"  v-model="monto_transferencia" class="mr-2" placeholder="0.00" :disabled="showTransferencia" ></v-text-field> -->

                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header class="primary">
                                                <h3 class="white--text"><v-icon large color="white">mdi-cash-fast</v-icon> DEPOSITO</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row class="mt-2">
                                                    <v-col cols="12" class="d-flex">
                                                        <v-row>
                                                            <v-col cols="2">
                                                                <v-checkbox
                                                                color="primary"
                                                                v-model="metodoPago"
                                                                value="deposito"
                                                                ></v-checkbox>
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <money v-model="monto_deposito" v-bind="money" :disabled="showDeposito" placeholder="0.00"></money>
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <v-autocomplete 
                                                                label="Seleccione el banco"
                                                                outlined 
                                                                item-text="nombreBank"
                                                                item-value="codigo"
                                                                :items="banks"
                                                                v-model="banco_deposito"
                                                                :disabled="showDeposito"
                                                                ></v-autocomplete>
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header class="primary">
                                                <h3 class="white--text"><v-icon large color="white">mdi-clipboard</v-icon>OTRO</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row class="mt-2">
                                                    <v-col cols="12" class="d-flex">
                                                        <v-row>
                                                            <v-col cols="2">
                                                                <v-checkbox
                                                                color="primary"
                                                                v-model="metodoPago"
                                                                value="otro"
                                                                ></v-checkbox>
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <money v-model="monto_otro" v-bind="money" :disabled="showOtro" placeholder="0.00"></money>
                                                            </v-col>
                                                            <v-col cols="5">
                                                                <v-textarea rows="1" v-model="nota_otro" outlined label="Nota" :disabled="showOtro"> </v-textarea>
                                                            </v-col>
                                                        </v-row>
                                                            <!-- <v-text-field outlined class="mr-2" @keypress="soloNumeros($event)" v-model="monto_otro" type="text" placeholder="0.00" :disabled=""></v-text-field> -->
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                        <v-expansion-panel>
                                            <v-expansion-panel-header class="primary">
                                                <h3 class="white--text"><v-icon large color="white" class="mr-2">mdi-account-credit-card</v-icon>CREDITO</h3>
                                            </v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-row class="mt-2">
                                                    <v-col cols="12" class="d-flex">
                                                            <v-checkbox
                                                            color="primary"
                                                            label="Credito"
                                                            value="credito"
                                                            v-model="metodoPago"
                                                            ></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-card elevation="0" class="mt-5 py-3 px-3">
                                            <v-row>
                                            <v-col cols="6" class="text-center">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-truck-fast</v-icon> <span class="indigo--text">Paqueteria</span> </v-chip>
                                                <money v-model="pedido.venta_paqueteria" v-bind="money" :disabled="credito" placeholder="0.00"></money>
                                            </v-col>
                                            <v-col cols="6" class="text-center">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-cart-percent</v-icon> <span class="indigo--text">IVA %</span>   </v-chip>
                                                <money v-model="pedido.iva" v-bind="money" :disabled="credito" placeholder="0.00"></money>
                                            </v-col>
                                            <v-col cols="6" class="text-center">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-security</v-icon><span class="indigo--text">Seguro</span> </v-chip>
                                                <money v-model="pedido.seguro" v-bind="money" :disabled="credito" placeholder="0.00"></money>
                                            </v-col>
                                            <v-col cols="6" class="text-center">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-cash-refund</v-icon><span class="indigo--text">Saldo a favor</span> </v-chip>
                                                <money v-model="pedido.saldo_pendiente" v-bind="money" :disabled="credito" placeholder="0.00"></money>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                    <v-card elevation="0" outlined class="mt-5 py-5 px-3 card-data">
                                        <v-row>
                                            <v-col cols="6" class="text-center">
                                                <v-autocomplete 
                                                outlined  
                                                label="Vendedora"  
                                                append-icon="mdi-human-female" 
                                                color="primary"
                                                :items="vendedoras"
                                                item-value="nombre"
                                                item-text="nombre"
                                                v-model="pedido.vendedora"
                                                ></v-autocomplete>
                                            </v-col>
                                            <v-col cols="6" class="text-center">
                                                <v-text-field type="text" @keypress="soloNumeros($event)" v-model="pedido.cajas" append-icon="mdi-package-variant-closed" label="Cajas" outlined color="primary" ></v-text-field>
                                            </v-col>
                                            <v-col cols="6" class="text-center" style="position:relative;">
                                                <span class="label-fecha">Fecha y hora de recojo:</span>
                                                <input class="input-date-time" type="datetime-local" v-model="pedido.fecha_entrega" />
                                                <!-- <v-text-field type="datetime" v-model="pedido.fecha_entrega" label="Fecha recojo" outlined color="primary"></v-text-field> -->
                                            </v-col>
                                            <v-col cols="6" class="text-center">
                                                <v-textarea  rows="1"  v-model="pedido.nota" append-icon="mdi-note" label="Nota" outlined color="primary" ></v-textarea>
                                            </v-col>
                                            <v-col cols="12" class="text-center">
                                                <v-text-field type="password"  label="Token" v-model="pedido.token" color="primary" outlined append-icon="mdi-security" ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" class="text-right">
                                                <v-btn class="primary" large @click="procesarPedido()" :disabled="!flag">Procesar</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>    

        <transition 
            enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutLeft"
            mode="out-in">
            <div :class="type" id="notification" v-if="notification" >
                <v-icon color="white" large>{{icon}} </v-icon>
                <p class="mt-2 ml-2">{{mensaje}} </p>
            </div>
        </transition>
        <div class="footer-price">
            <h4 class="primary--text" style="font-size:33px;margin-right: 22px;">Total:${{Total | precio}}.00 </h4> 
        </div>
    </v-container>
</template>

<script>
import pedidosDatosPersonales from '@/components/pedidos-datos-personales.vue'
import axios from 'axios'
import {mapMutations,mapActions} from 'vuex'
import ModalAddProducto from '@/components/modal-add-producto.vue'
import {Money} from 'v-money'
export default {
components: { pedidosDatosPersonales, ModalAddProducto , Money},
    data(){
        return{
            modal_add:false,
            modal_confirm:false,
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            search: '',
            panel: [],
            pedidos:[],
            productsCodigo:[],
            codigos:[],
            User:{},
            scrollActive:false,
            notification:false,
            mensaje:'',
            type:'',
            icon:'',
            pedido:{
                orden:this.$route.params.orden,
                venta_paqueteria:null,
                saldo_pendiente:null,
                vendedora:'',
                iva:null,
                seguro:null,
                fecha_entrega:'',
                monto:'',
                cajas:'',
                nota:'',
                efectivo:'',
                banco:'',
                datos:[],
                metodos:[],
                token:''
            },

            money: {
            decimal: '.',
            thousands: ',',
            prefix: '$ ',
            suffix: '',
            precision: 2,
            masked: false
            },

            modal_confirm_data:{
                icon:'mdi-alert',
                status:'warning',
                title:'',
                texto:''
            },

            flag:true,
            credito:false,

            metodoPago:[],
            showEfectivo:true,
            showTransferencia:true,
            showDeposito:true,
            showOtro:true,
            nota_otro:'',
            showCredito:true,                                                 

            headerPedido:[
                { text: 'Codigo', value: 'cod' ,align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Nombre del producto', value: 'nom' ,align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Cantidad (pz)', value: 'cant',align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Precio ($)', value: 'price',align: 'center', class: "primary white--text px-0 mx-0",},
                { text: 'Importe ($)', value: 'import',align: 'center', class: "primary white--text px-0 mx-0", },
                { text: 'Acciones', value: 'actions', align: 'center',class: "primary white--text px-0 mx-0", },
            ],
            banks:[
                {codigo:"isn-bbva",nombreBank:"ISN BBVA"},
                {codigo:"isn-hsbc",nombreBank:"ISN HSBC"},
                {codigo:"website-bbva",nombreBank:"WEBSITE BBVA"},
                {codigo:"lemussa-bbva",nombreBank:"LEMUSSA BBVA"},
            ],
            monto_efectivo:null,
            monto_transferencia:null,
            monto_deposito:null,
            monto_otro:null,
            banco_deposito:'',
            banco_transferencia:'',
            vendedoras:[
                {id:1,nombre:"Daniela Ordoñez"},
                {id:2,nombre:"Selene Hernandez"},
                {id:3,nombre:"Vanessa Vidal"},
                {id:4,nombre:"Oficina"},
            ]
        }
    },

    mounted(){
        this.setActiveOverlay()
        this.getAllDetallePedido(this.$route.params.orden)
        this.getAllDetalleUsuario(this.$route.params.orden)
    },

    watch:{
        //watch que escucha el metodo de pago para habilitar campos
        metodoPago(value){

            let filterEfectivo = value.filter(item => item === 'efectivo')
            if(filterEfectivo.length > 0){
                this.showEfectivo =  false
                this.pedido.efectivo = 'si'
            }else{
                this.showEfectivo =  true
                this.monto_efectivo = 0
                this.pedido.efectivo = ''
            }

            let filterTransferencia = value.filter(item => item === 'transferencia')
            if(filterTransferencia.length > 0){
                this.showTransferencia = false
            }else{
                this.showTransferencia = true
                this.monto_transferencia = 0
                this.banco_transferencia = ''
            }

            let filterDeposito = value.filter(item => item === 'deposito')
            if(filterDeposito.length > 0 ){
                this.showDeposito =  false
            }else{
                this.showDeposito =  true
                this.monto_deposito = 0
                this.banco_deposito = ''
            }

            let filterOtro = value.filter(item => item === 'otro')
            if(filterOtro.length > 0){
                this.showOtro =  false
            }else{
                this.showOtro =  true
                this.monto_otro = 0
            }

            let filterCredito = value.filter(item => item === 'credito')
            this.credito = filterCredito.length > 0 ? true : false
            
        }
    },

    computed:{
        //variable computada que suma los monto para un total
        Total(){
            const acumular = (acumulador,pedido) => acumulador + parseFloat(pedido.total) 
            return  this.pedidos.reduce(acumular,0)
        },

         //variable para llevar acumulador de las cantidades de los productos
        cantidades(){
            const acumular = (acumulador,pedido) => acumulador + (parseInt(pedido.cantidad))
            return this.pedidos.reduce(acumular,0)
        }
    },

     //filtro para precios o cantidades, representa el monto en unidad inglesa ejemplo : 1,000
    filters:{
        precio(value) {
                return value.toLocaleString('en');
        }
    },

    methods:{

        ...mapMutations('overlay',['setActiveOverlay','setDesactiveOverlay']),

        //metodo del store que trae todos los pedidos procesados
        ...mapActions('pedidos',['getAllPedidosProcesados']),

        //metodo que trae detalle del pedido segun orden
        async getAllDetallePedido(orden){
            this.flag = true
            try
            {
                const response = await axios.get(`/ventas/detallePedido?orden=${orden}`)
                if(response.status == 200){
                    this.pedidos = response.data
                    console.log(response.data)
                    const datos = this.pedidos.map((item)=>{
                        item.cantidad_old = item.cantidad
                        if(parseInt(item.almacen) < parseInt(item.cantidad)){
                            this.flag = false
                        }
                        return item;
                    })
                    this.pedidos = [...datos];
                    this.almacenarCodigos(orden)
                    this.setDesactiveOverlay()
                    
                }
            }catch(e)
            {
                console.log(e)
            }
        },
        //metodo para solo aceptar numeros en campos de texto
        soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
        },

        //evento para activar card en scroll bajo
        onScroll(e){
            if(e.target.scrollTop > 128){
                this.scrollActive = true
            }else{
                this.scrollActive = false
            }
        },

        //metodo que almacena lista de codigos de productos segun orden
        async almacenarCodigos(orden){
            this.codigos = []
            try{
                const response = await axios.get(`/ventas/detallePedido?orden=${orden}`)

                if(response.status == 200){
                    this.productsCodigo = response.data
                    let flag = []

                    for(let i=0;i<this.productsCodigo.length;i++){
                        // console.log(this.productsCodigo[i].codigo.trim().toUpperCase())
                        let filtro = flag.filter(item => item == this.productsCodigo[i].codigo );
                        if(filtro.length > 0){
                            let index = this.codigos.findIndex(item => item.codigo == this.productsCodigo[i].codigo)
                            if(index >= 0){
                                this.codigos[index].cantidad = parseInt(this.codigos[index].cantidad) + parseInt(this.productsCodigo[i].cantidad)
                                flag.push(this.productsCodigo[i].codigo)
                            }else{
                                this.codigos.push(this.productsCodigo[i]) 
                                flag.push(this.productsCodigo[i].codigo)
                            }
                        }else{
                            this.codigos.push(this.productsCodigo[i])   
                            flag.push(this.productsCodigo[i].codigo )
                        }
                    }   
                }
            }catch(e){
                console.log(e)
            }
                
        },
        //metodo que trae los datos personales del usuario, al componente de datos personales
        async getAllDetalleUsuario(orden){
            try
            {
                const response = await axios.get(`/ventas/detallePedido?ordenLimit=${orden}`)
                if(response.status == 200){
                    this.User = response.data
                    console.log(this.User)
                }
                
            }catch(e)
            {
                console.log(e)
            }
        },
        //actualizar las cantidades de un item
        async updateCantidad(item,index,method){
            try
            {
                //definimos la cantidad que se esta modificando
                let num =  item.cantidad - item.cantidad_old

                let filtro = this.codigos.find(tag => tag.codigo === item.codigo)

                console.log(filtro)

                let cantidadTotal = parseInt(num) + parseInt(filtro.cantidad);

                let oldPrice = parseFloat(item.precio);
                let price = null;
                let cambio = false;

                if(method == 1){
                    price = this.verificarPrice(item,cantidadTotal)  
                    if(oldPrice != parseFloat(price)){
                        cambio = true
                    }
                }else{
                    price =  item.precio
                    cambio = true
                }

                this.pedidos[index].precio = price


                let data = {
                    "action":'update',
                    "id":this.pedidos[index].id,
                    "orden":this.$route.params.orden,
                    "cantidad":this.pedidos[index].cantidad,    
                    "suma":num*price,
                    "cambio":cambio,
                    "price":price,
                    "codigo":item.codigo,
                    "cantidades":this.cantidades
                }

                const response = await axios.post(`/ventas/detallePedido`,data);

                if(response.status == 200){
                    this.getAllDetallePedido(this.$route.params.orden)
                    this.mensaje = response.data.mensaje
                    this.type = 'success'
                    this.icon = 'mdi-check-circle'
                    this.notification = true
                    setTimeout(()=>{
                        this.notification = false
                    },2000);
                }
                console.log(response.data)

            }catch(e)
            {
                console.log(e)
            }
        },

        //agregar un producto nuevo a la orden
        async addNewProducto(producto,cantidad){
            try
            {
                let filtro = this.codigos.find(tag => tag.codigo === producto.codigo)
                let cantidadTotal = 0;
                if(filtro === undefined){
                    cantidadTotal = parseInt(cantidad)  
                }else{
                    cantidadTotal = parseInt(cantidad ) + parseInt(filtro.cantidad) 
                }
                
                let oldPrice = parseFloat(producto.preciou);

                let price = null;
                let cambio = false;
                price = this.verificarPrice(producto,cantidadTotal)

                if(oldPrice != parseFloat(price)){
                    cambio = true
                }

                let data = {
                    "action":'add',
                    "id_producto":producto.id,
                    "cambio":cambio,
                    "orden":this.$route.params.orden,
                    "nombre":producto.nombre,
                    "cantidad":cantidad,
                    "suma":parseFloat(cantidad)*price,
                    "precio":price,
                    "codigo":producto.codigo,
                    "id_usuario":this.User.id,
                    "paqueteria":this.User.paqueteria,
                    "rfc":this.User.rfc,
                    "nombred":this.User.nombre,
                    "apellidod":this.User.apellido,
                    "direcciond":this.User.direcciond,
                    "coloniad":this.User.coloniad,
                    "ciudadd":this.User.ciudadd,
                    "estadod":this.User.estadod,
                    "codigopd":this.User.codigopd,
                    "telefonod":this.User.telefonod,
                    "estatus":""
                }

                const response = await axios.post(`/ventas/detallePedido`,data)
                if(response.status === 200){
                    this.getAllDetallePedido(this.$route.params.orden)
                    this.closeModalAdd()
                    this.mensaje = response.data.mensaje
                    this.type = 'success'
                    this.icon = 'mdi-check-circle'
                    this.notification = true
                    setTimeout(()=>{
                        this.notification = false
                    },2000);
                }
            }catch(e)
            {
                console.log(e)
            }
        },
        
        //eliminar un item de la orden
        async deleteItem(item,index){
            this.pedidos.splice(index, 1)
            let filtro = this.codigos.find(tag => tag.codigo === item.codigo)
            console.log(filtro)
            let cantidadTotal =   parseInt(filtro.cantidad)- parseInt(item.cantidad)
            let oldPrice = parseFloat(item.precio);
            let price = null;
            let cambio = false;

            price = this.verificarPrice(item,cantidadTotal)
            
            if(oldPrice != parseFloat(price)){
                cambio = true
            }
            try
            {
                let data = {
                    "action":'delete',
                    "id":item.id,
                    "cambio":cambio,
                    "orden":this.$route.params.orden,
                    "suma":parseFloat(item.cantidad)*oldPrice,
                    "precio":price,
                    "codigo":item.codigo,
                    "cantidades":this.cantidades
                }

                const response = await axios.post(`/ventas/detallePedido`,data);
                if(response.status == 200){
                    this.getAllDetallePedido(this.$route.params.orden)
                    this.mensaje = response.data.mensaje
                    this.icon = 'mdi-check-circle'
                    this.type = 'success'
                    this.notification = true
                    setTimeout(()=>{
                        this.notification = false
                    },2000);
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        //metodo de validacion antes de procesar
        validateProcess(){
            let error = {count:0,Error:null} ;

            if(this.monto_transferencia != null && this.monto_transferencia > 0){
                if(this.banco_transferencia === ''){
                    error.count++;
                    error.Error = 1;                                            
                }
            }

            if(this.monto_deposito != null  && this.monto_deposito > 0){
                if(this.banco_deposito === ''){
                    console.log(this.banco_deposito,this.monto_deposito)
                    error.count++;
                    error.Error = 2;                                              
                }
            }

            if(this.monto_efectivo === 0 || this.monto_efectivo === null){
                this.pedido.efectivo = ""
            }
            
            this.pedido.venta_paqueteria = this.pedido.venta_paqueteria === null || this.pedido.venta_paqueteria === '' ? 0 : this.pedido.venta_paqueteria
            this.pedido.iva = this.pedido.iva === null || this.pedido.iva === '' ? 0 : this.pedido.iva
            this.pedido.seguro = this.pedido.seguro === null || this.pedido.seguro === '' ? 0 : this.pedido.seguro
            this.pedido.saldo_pendiente = this.pedido.saldo_pendiente === null || this.pedido.saldo_pendiente === '' ? 0 : this.pedido.saldo_pendiente
            this.monto_efectivo = this.monto_efectivo === null || this.monto_deposito === '' ? 0 : this.monto_efectivo
            this.monto_deposito = this.monto_deposito === null || this.monto_deposito === '' ? 0 : this.monto_deposito
            this.monto_transferencia = this.monto_transferencia === null || this.monto_transferencia === '' ? 0 : this.monto_transferencia
            this.monto_otro = this.monto_otro === null || this.monto_otro === '' ? 0 : this.monto_otro

            

            let extras = parseFloat(this.pedido.venta_paqueteria)+parseFloat(this.pedido.iva)+parseFloat(this.pedido.seguro)+parseFloat(this.pedido.saldo_pendiente);
            let suma = parseFloat(this.monto_efectivo)+parseFloat(this.monto_deposito)+parseFloat(this.monto_transferencia)+parseFloat(this.monto_otro);
            let total = parseFloat(this.Total)+extras;

            // this.pedido.banco = `${this.banco_deposito} ${this.banco_transferencia}`
            // this.pedido.metodos = this.metodoPago.toString()

            let Pagos = []
            this.metodoPago.forEach(item => {
                let monto = 0
                let banco = ''

                if(item === 'efectivo'){
                    monto  = this.monto_efectivo
                    banco  = 'efectivo'
                }
                if(item === 'deposito'){
                    monto = this.monto_deposito
                    banco = this.banco_deposito
                }
                if(item === 'transferencia'){
                    monto = this.monto_transferencia
                    banco = this.banco_transferencia
                }
                if( item === 'otro'){
                    monto = this.monto_otro
                    banco = item
                }

                Pagos.push({"metodo":item,"monto":monto,"banco":banco})

            })

            this.pedido.metodos = Pagos


            if(suma != total){
                error.count++;
                error.Error = 3; 
                console.log(suma,total)
            }
            this.pedido.monto = suma
            return error;
        },

        //metodo para mostrare tipo de msj segun validacion
        showError(error){
            switch(error){
                case 1:
                    this.modal_confirm_data.title = 'Falta seleccionar banco'
                    this.modal_confirm_data.texto = 'Debes seleccionar el banco para el monto de la transferencia' 
                    this.modal_confirm = true  
                break;
                case 2:
                    this.modal_confirm_data.title = 'Falta seleccionar banco'
                    this.modal_confirm_data.texto = 'Debes seleccionar el banco para el monto del deposito' 
                    this.modal_confirm = true  
                break;
                case 3:
                    this.modal_confirm_data.title = 'Los montos no coinciden'
                    this.modal_confirm_data.texto = 'Los montos de pago no coinciden con los del pedido verificar' 
                    this.modal_confirm = true  
                break;
                default:
                break;
            }
        },
        //metodo para procesar pedido
        async procesarPedido(){
            this.scrollActive = false
            this.setActiveOverlay()
            try
            {
                if(this.credito){
                    this.pedido.datos = this.pedidos
                    this.pedido.metodos = 'credito'
                    this.pedido.datos = this.pedidos
                    const response = await axios.post(`/ventas/procesarPedidoCredito`,this.pedido)
                    if(response.status == 200){
                        this.setDesactiveOverlay()
                        this.getAllPedidosProcesados()
                        this.modal_confirm_data.icon = 'mdi-check-circle-outline'
                        this.modal_confirm_data.status = 'success'
                        this.modal_confirm_data.title = 'Proceso exitoso!!!'
                        this.modal_confirm_data.texto = response.data.mensaje
                        this.modal_confirm = true
                        setTimeout(()=>{
                            this.modal_confirm_data.icon = 'mdi-alert'
                            this.modal_confirm_data.status = 'warning'
                            this.modal_confirm = false
                            this.$router.push('/procesados');
                        },4000); 
                    }else{
                        if(response.status == 401){
                            this.modal_confirm_data.icon = 'mdi-alert'
                            this.modal_confirm_data.status = 'warning'
                            this.modal_confirm_data.title = 'Ocurrio un imprevisto!!!'
                            this.modal_confirm_data.texto = response.data.mensaje
                        }
                    }
                    console.log(response.data)
                }else{
                        let validate = this.validateProcess();
                        if(validate.count === 0){
                            this.pedido.datos = this.pedidos
                            const response = await axios.post(`/ventas/procesarPedido`,this.pedido)
                            if(response.status == 200){
                                this.getAllPedidosProcesados()
                                this.setDesactiveOverlay()
                                this.modal_confirm_data.icon = 'mdi-check-circle-outline'
                                this.modal_confirm_data.status = 'success'
                                this.modal_confirm_data.title = 'Proceso exitoso!!!'
                                this.modal_confirm_data.texto = response.data.mensaje
                                this.modal_confirm = true
                                setTimeout(()=>{
                                    this.modal_confirm_data.icon = 'mdi-alert'
                                    this.modal_confirm_data.status = 'warning'
                                    this.modal_confirm = false
                                    this.$router.push('/procesados');
                                },4000); 
                            }
                            console.log(response.data)
                        }else{
                            this.setDesactiveOverlay()
                            this.showError(validate.Error)
                        }
                }
            }catch(e)
            {
                console.log(e.response)
                if(e.response.status == 401){
                    this.setDesactiveOverlay()
                    this.modal_confirm_data.icon = 'mdi-block-helper'
                    this.modal_confirm_data.status = 'error'
                    this.modal_confirm_data.title = 'Ocurrio un error'
                    this.modal_confirm_data.texto = e.response.data.mensaje
                    this.modal_confirm = true
                    setTimeout(()=>{
                        this.modal_confirm = false
                    },3000);
                }
            }
        },
        //metodo que activa notificacion  de validacion
        notificationActive(){
            this.mensaje = 'Debes introducir una cantidad valida'
            this.type = 'warning'
            this.icon = 'mdi-alert'
            this.notification = true
            setTimeout(()=>{
                this.notification = false
            },2000);
        },

        //metodo para verificar el precio, descuento o no
        verificarPrice(item,cantidadTotal){

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
        //metodo para cerrar modal de add
        closeModalAdd(){
            this.modal_add = false
        },
        //metodo para verificar
        verificar(item,index){
            this.pedido[index].check = true
        }
    }

}
</script>

<style lang="scss">
.v-text-field.v-text-field--enclosed {
    margin-bottom: -29px !important;
}
.cantidad{
    display:flex;
    width:45%;
    margin:auto;
    justify-content: space-around;
    .v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width > .v-input__control > .v-input__slot, .v-text-field--outlined > .v-input__control > .v-input__slot {
    min-height: 36px !important;
    width: 80px !important;
    }
}

.card-pay{
    border:2px solid rgb(0, 89, 255) !important;
    margin-bottom: 10px;
}
.v-application--is-ltr .v-expansion-panel-header__icon .mdi:before, .mdi-set {
    color: #fff !important;
}

// .v-text-field--outlined > .v-input__control > .v-input__slot {
//     //background: #fff !important;
// }

.card-data{
    border: 1px solid #3f51b5 !important;
}

.btn-update {
    margin-left: -4px !important;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

.price{
    cursor: pointer;
}

.contenedor{

    .card-info{
        width: 100%;
        height: 80px;
        position: fixed;
        background: #fff;
        z-index: 8;
        left: 0;
        top: 85px !important;
        border-radius: 0 !important;
    }
}
.card_confirm{
    padding: 10px;
    box-sizing: border-box;
    &__icon{
        font-size: 60px !important;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    &__title{
        margin-bottom: 5px !important;
    }
    &__text{
        font-size: 16px !important;
    }
}

#notification{
        position: fixed;
        width: 400px;
        padding: 10px;
        color: #fff;
        left: 0;
        bottom: 5px;
        display: flex;
        border-top-right-radius:8px;
        border-bottom-right-radius: 8px;
        z-index: 999;
}

    .footer-price{
        width: 100%;
        height: 58px;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        box-shadow: 0px -6px 3px 0px #4444449c;
        text-align: right;
        z-index: 4;
    }

    .v-money{
        width: 100%;
        border: 1px solid #d3d3d3;
        border-radius: 5px;
        padding: 11px;
        height: 55px;
        box-sizing: border-box;
        outline-color: #3f51b5 ;
    }

    .input-date-time{
        width: 100%;
        height: 57px;
        padding: 5px;
        border: 1px solid #837f7f;
        outline-color: #3f51b5;
        border-radius: 5px;
    }
    .label-fecha{
        position: absolute;
        background: #fff;
        width:auto;
        font-size: 12px;
        top: 2px;
        left: 20px;
        padding: 0px;
    }

    .fade-enter-from,   
    .fade-leave-to{
        opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active{
        transition: opacity 0.1s ease-out;
    }

</style>