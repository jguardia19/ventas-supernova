<template>
    <v-container class="mt-5">

        <v-dialog v-model="modal_confirm" max-width="400">
            <v-card class="card_confirm">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-icon :color="modal_data.status" class="card_confirm__icon">{{modal_data.icon}}</v-icon>
                            <h1 class="card_confirm__title">{{modal_data.title}} </h1>
                            <p class="card_confirm__text">{{modal_data.texto}} </p>
                        </v-col>
                    </v-row>  
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modal_pago" max-width="1050">
            <v-card class="card-pay">
                <v-card-title>
                    <v-col cols="12" class="d-flex justify-space-between">
                        <span class="text--h5 primary--text mr-2">{{datos.nombres}} </span>
                        <v-chip color="success" label>Orden: {{datos.orden}} </v-chip>
                        <span class="success--text text--h5">Total pedido: ${{parseInt(datos.total)  | precio}}.00 </span>
                    </v-col>
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-3">
                        <v-col cols="12">
                            <transition 
                                enter-active-class="animate__animated animate__fadeInUp"
                                leave-active-class="animate__animated animate__fadeOutUp"
                                mode="out-in">
                                <v-alert type="error" outlined v-if="alert">
                                    {{mensaje}}
                                </v-alert>
                            </transition>
                        </v-col>
                        <v-col cols="6">
                            <v-expansion-panels v-model="panel" multiple >
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
                                                        <money v-model="monto_efectivo" v-bind="money" :disabled="showEfectivo" placeholder="0.00"></money>
                                                        <!-- <v-text-field outlined type="text"  @keypress="soloNumeros($event)" v-model="monto_efectivo" :disabled="showEfectivo" placeholder="0.00"></v-text-field> -->
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
                                                                <v-textarea rows="1" outlined label="Nota" :disabled="showOtro"> </v-textarea>
                                                            </v-col>
                                                        </v-row>          
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                        </v-col>
                        <v-col cols="6">
                                    <v-card elevation="0" class="mt-5 py-3 px-3">
                                            <v-row>
                                            <v-col cols="6" class="text-center row-data">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-truck-fast</v-icon> <span class="indigo--text">Paqueteria</span> </v-chip>
                                                <money v-model="paqueteria" v-bind="money"  placeholder="0.00"></money>
                                            </v-col>
                                            <v-col cols="6" class="text-center row-data">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-cart-percent</v-icon> <span class="indigo--text">IVA %</span>   </v-chip>
                                                <money v-model="iva" v-bind="money"  placeholder="0.00"></money>
                                            </v-col>
                                            <v-col cols="6" class="text-center row-data mt-8" v-if="saldoPendiente > 0">
                                                <v-chip class="mb-2" label color="white"><v-icon class="mr-2" color="primary">mdi-cash-refund</v-icon><span class="indigo--text">Saldo a favor</span> </v-chip>
                                                <money v-model="saldoPendiente" v-bind="money"  placeholder="0.00" disabled></money>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                        <v-col cols="4">
                            <v-chip outlined label color="primary">
                                <span class="text--h5 primary--text"> Total a pagar: ${{montoPagar | precio}} </span>
                            </v-chip>
                        </v-col>
                        <v-col cols="8" class="text-right">
                            <v-btn text color="error" class="mr-2" @click="closeModalPago()">cancelar</v-btn>
                            <v-btn class="primary" :disabled="disabledProcesar" @click="procesarPago()"> 
                                <v-icon v-if="!loading">mdi-credit-card-outline</v-icon>
                                <span v-if="!loading" >${{montoDepositado | precio}} procesar</span> 
                                <v-progress-circular
                                    indeterminate
                                    color="primary"
                                    v-if="loading"
                                    ></v-progress-circular>
                                <span v-if="loading">Por favor espere</span>
                            </v-btn>
                        </v-col> 
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-row>
            <v-col cols="12">
                <v-card class="px-5 py-3" elevation="0">
                    <v-card-title>
                        <v-icon class="mr-2" color="primary" large>mdi-credit-card-multiple</v-icon>
                        Pedidos Creditos
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-spacer></v-spacer>
                        <v-text-field outlined label="Buscar Folio" append-icon="mdi-magnify" v-model="search" > </v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="header"
                        :items="pedidosCredito"
                        :search="search"
                        :page.sync="page"
                        :items-per-page="itemsPerPage"
                        mobile-breakpoint="0"
                    >
                <template v-slot:[`item.number`]="{ index }">
                <span>{{ index + 1 }} </span>
                </template>
                <template v-slot:[`item.Orden`]="{ item }">
                <p style="font-weight: bold" class="ticket--text">
                    {{ item.orden }}
                </p>
                </template>
                <template v-slot:[`item.package`]="{ item }">
                <v-chip color="ticket" outlined>{{ item.paqueteria }} </v-chip>
                </template>
                <template v-slot:[`item.cant`]="{ item }">
                <v-chip color="success">{{ item.cantidad }} </v-chip>
                </template>
                <template v-slot:[`item.total`]="{ item }">
                    <v-chip color="primary" label>
                        <span class="px-2 py-2 white--text"
                            >${{parseInt(item.total) | precio}}.00
                        </span>
                    </v-chip>
                
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="ticket"
                        class="mr-2"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="pagarPedido(item)"
                    >
                        <v-icon>mdi-cart-arrow-right</v-icon>
                    </v-btn>
                    </template>
                    <span>Procesar venta</span>
                </v-tooltip>
                </template>
            </v-data-table>
        </v-card>
    </v-col>
    </v-row>
</v-container>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
import {Money} from 'v-money'
export default {
    components:{ Money },
    data(){
        return{
            page: 1,
            pageCount: 0,
            itemsPerPage: 100,
            search: "",
            pedidosCredito: [],
            panel: [],
            metodoPago:[],
            fecha_pedidos:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            modal_pago:false,
            datos:{},

            loading:false,

            header: [
            {
                text: "#",
                value: "number",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Nombre del Cliente",
                value: "nombres",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Orden (Folio)",
                value: "orden",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Paqueteria",
                value: "package",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Cantidad de productos (pz)",
                value: "cant",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Total de ventas ($)",
                value: "total",
                align: "center",
                class: "primary white--text px-0 mx-0",
            },
            {
                text: "Fecha",
                value: "fecha",
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

            showEfectivo:true,
            showTransferencia:true,
            showDeposito:true,
            showOtro:true,
            showCredito:true,                                                 


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
            efectivo:'',
            disabledProcesar:true,
            paqueteria:0,
            iva:0,
            alert:false,

            modal_confirm:false,
            modal_data:{
                icon:'',
                status:'',
                title:'',
                texto:''
            },
            money: {
                decimal: '.',
                thousands: ',',
                prefix: '$ ',
                suffix: '',
                precision: 2,
                masked: false
            },
    }
},

mounted(){
    this.setActiveOverlay()
    this.getAllPedidosCredito()
},

watch:{
        //watch que escucha el metodo de pago para habilitar los distintos metodos de pago
        metodoPago(value){

            let filterEfectivo = value.filter(item => item === 'efectivo')
            if(filterEfectivo.length > 0){
                this.showEfectivo =  false
                this.efectivo = 'Si'
            }else{
                this.showEfectivo =  true
                this.monto_efectivo = 0
                this.efectivo = ''
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
            
        },
        //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        monto_efectivo(value){
            this.monto_efectivo = value === '' ? 0 : parseFloat(value)
        },
         //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        monto_deposito(value){
            this.monto_deposito = value === '' ? 0 : parseFloat(value)
        },
         //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        monto_transferencia(value){
            this.monto_transferencia = value === ''  ? 0 : parseFloat(value)
        },
         //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        monto_otro(value){
            this.monto_otro = value=== '' ? 0 : parseFloat(value)
        },
         //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        iva(value){
            this.iva =  value === '' ? 0 : parseFloat(value)
        },
         //iguala el monto a 0 si esta vacio para realizar operaciones aritmeticas
        paqueteria(value){
            this.paqueteria = value === '' ? 0 : parseFloat(value)
        },
        //watch para escuchar el total y realizar operaciones
        Total(value){
            let resta = value - this.suma
            this.disabledProcesar =  resta >= (parseFloat(this.datos.total)+this.suma) ? false : true
            this.saldo_pendiente = value - this.montoPagar
        } 
}, 

computed:{
        //variable computada para sumar el total de los montos
        Total(){
            return   this.monto_efectivo + this.monto_deposito + this.monto_transferencia  + this.monto_otro + this.iva + this.paqueteria
        },
        // variable que retorna la suma del iva y la paqueteria
        suma(){
            return this.iva + this.paqueteria
        },
        //variable del monto total a pagar sumando la variable suma y el total
        montoPagar(){
            return parseFloat(this.datos.total) + this.suma
        },
        //variable que representa la suma de todos los montos menos paqueteria e iva
        montoDepositado(){
            return this.monto_efectivo + this.monto_deposito + this.monto_transferencia  + this.monto_otro
        },
        //variable que mostrara si quedara un saldo pendiente al cliente
        saldoPendiente(){
            return (this.monto_efectivo + this.monto_deposito + this.monto_transferencia  + this.monto_otro) - (parseFloat(this.datos.total)+this.iva+this.paqueteria) ;
        }
    },

filters:{
    precio(value) {
            return value.toLocaleString('en');
    },
},
methods:{

    ...mapMutations('overlay',['setActiveOverlay','setDesactiveOverlay']),

    //metodo que solo nos permite introducir numeros en los campos de texto
    soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
    },
    //funcion que nos trae todos los pedidos en credito
    async getAllPedidosCredito(){
        try
        {
            const response = await axios.get(`/ventas/pedidosCredito`)
            console.log(response.data)
            this.pedidosCredito = response.data
            this.setDesactiveOverlay()
        }catch(e)
        {
            console.log(e)
        }
    },
    //agregar los datos , y aperturar modal para pago
    pagarPedido(item){
        this.datos = Object.assign({}, item)
        this.modal_pago = true
    },

    //validar proceso para pago
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
                    error.count++;
                    error.Error = 2;                                              
                }
            }
        return error;
    },

    //asignar valores para procesar el pago
    asignedValores(){
        this.datos.paqueteria = this.paqueteria
        this.datos.iva = this.iva
        this.datos.saldo = this.saldoPendiente
        this.datos.monto = this.montoDepositado
        this.datos.efectivo = this.efectivo
        // this.datos.banco = `${this.banco_deposito} ${this.banco_transferencia}`
        // this.datos.metodos = this.metodoPago.toString()

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

        this.datos.metodos = Pagos
    },


    //funcion para procesar el pago 
    async procesarPago(){
        this.loading = true
        this.disabledProcesar = true
        const Error = this.validateProcess()
        if(Error.count > 0){
            this.alert = true 
            if(Error.Error === 1){
                this.mensaje = "Debes seleccionar banco para el monto de la transferencia"
                setTimeout(() => {
                    this.alert = false
                }, 2000);
                this.loading = false
                this.disabledProcesar = false
            }
            if(Error.Error === 2){
                this.mensaje = "Debes seleccionar banco para el monto del deposito"
                setTimeout(() => {
                    this.alert = false
                }, 2000);
                this.loading = false
                this.disabledProcesar = false
            }
        }else{
            this.asignedValores()
            try
            {
                const response = await axios.post(`/ventas/pagarPedidoCredito`,this.datos)
                if(response.status == 200 || response.status == 201){
                    console.log(response.data)
                    this.modal_data.icon = 'mdi-check-circle-outline'
                    this.modal_data.status = 'success'
                    this.modal_data.title = 'PAGO EXITOSO'
                    this.modal_data.texto = response.data.mensaje
                    this.modal_confirm = true
                    setTimeout(() => {
                        this.modal_confirm = false
                    }, 3000);
                    this.loading = false
                    this.disabledProcesar = false
                    this.getAllPedidosCredito()
                    this.closeModalPago()
                }
            }catch(e)
            {
                console.log(e)
                this.modal_data.icon = 'mdi-alert'
                this.modal_data.status = 'error'
                this.modal_data.title = 'OCURRIO UN ERROR'
                this.modal_data.texto = e
                this.modal_confirm = true
                setTimeout(() => {
                    this.modal_confirm = false
                }, 3000);
                this.loading = false
                this.disabledProcesar = false
            }
        }

    },
    //metodo para cerrar modal y inicializar datos
    closeModalPago(){
        this.datos = {}
        this.metodoPago = []
        this.modal_pago = false
        this.monto_efectivo = 0,
        this.monto_transferencia = 0,
        this.monto_deposito = 0,
        this.monto_otro = 0,
        this.banco_deposito = '',
        this.banco_transferencia = '',
        this.efectivo = '',
        this.disabledProcesar = true,
        this.paqueteria = 0,
        this.iva = 0,
        this.saldo_pendiente = 0
        this.panel = [0]
    }
  }
}
</script>

<style lang="sass">
    .card-pay
        position: relative
        border:1px solid #FFF !important
        margin-bottom: 0px !important
        .btn-close
            position: absolute
            right: 5px
            top: 5px
    .row-data
        margin-bottom: -50px !important

    .card_confirm
        padding: 10px
        box-sizing: border-box
        &__icon
            font-size: 60px !important
            margin-top: 20px
            margin-bottom: 10px
        &__title
            margin-bottom: 5px !important
        &__text
            font-size: 16px !important

    
    .v-money
        width: 100%
        border: 1px solid #d3d3d3
        border-radius: 5px
        padding: 11px
        height: 55px
        box-sizing: border-box
        outline-color: #3f51b5 

    .fade-enter-from,   
    .fade-leave-to
        opacity: 0
    

    .fade-enter-active,
    .fade-leave-active
        transition: opacity 0.1s ease-out
    
</style>