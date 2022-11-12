<template>
        <v-row>
            <!-- <v-col cols="6" class="text-center">
                <img :src="img" alt="" width="450" height="320">
                <v-row>
                    <v-col cols="4" class="mx-auto">
                        <v-slider
                            v-model="form"
                            color="pink"
                            label=""|z
                            hint="Be honest"
                            min="1"
                            max="36"
                            thumb-label
                        ></v-slider>
                    </v-col>
                </v-row>
            </v-col> -->
            <v-col cols="12">
                <v-card class="px-5 py-8 card-data" elevation="0">
                    <v-btn icon large color="error" class="btn-close" @click="$emit('close')"> <v-icon>mdi-close</v-icon> </v-btn>
                    <div class="loading" v-if="loading">
                        <div class="container-loading text-center">
                            <v-progress-circular
                            :size="80"
                            :width="7"
                            color="white"
                            indeterminate
                            >
                                <img src="@/assets/icon-white-supernova.png" class="rotate" width="70" alt="">
                            </v-progress-circular> 
                            <p class="white--text">Por favor espere...</p>
                        </div>
                    </div>
                    <v-row>
                        <v-col cols="12">
                            <h3 class="ticket--text">DATOS PERSONALES  -- Orden:{{orden}}  </h3>
                            <v-chip label color="primary">Estatus : {{estatus}}</v-chip> 
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Nombre" class="control" v-model="datos.nombre" outlined append-icon="mdi-account" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>Nombre:</b> {{datos.nombre}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Apellido" class="control" v-model="datos.apellido" outlined append-icon="mdi-account" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>Apellido:</b> {{datos.apellido}} </p>
                            </div>  
                            
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Direccion" class="control" v-model="datos.direcciond" outlined append-icon="mdi-map-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map-marker</v-icon>
                                <p class="mt-5"><b>Direccion:</b> {{datos.direcciond}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" > 
                            <v-text-field label="Colonia" class="control" outlined v-model="datos.coloniad"  append-icon="mdi-map-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map-marker</v-icon>
                                <p class="mt-5"><b>Colonia:</b> {{datos.coloniad}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" class="mt-0">
                            <v-text-field label="Ciudad" class="control" outlined  v-model="datos.ciudadd" append-icon="mdi-city" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-city</v-icon>
                                <p class="mt-5"><b>Ciudad:</b> {{datos.ciudadd}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="Estado" v-model="datos.estadod" outlined append-icon="mdi-map" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-map</v-icon>
                                <p class="mt-5"><b>Estado:</b> {{datos.estadod}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="C.P" outlined v-model="datos.codigopd" append-icon="mdi-selection-marker" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-selection-marker</v-icon>
                                <p class="mt-5"><b>C.P:</b> {{datos.codigopd}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" > 
                            <v-text-field label="Telefono" v-model="datos.telefonod" outlined append-icon="mdi-phone" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-phone</v-icon>
                                <p class="mt-5"><b>Telefono:</b> {{datos.telefonod}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-text-field label="RFC" outlined  v-model="datos.rfc" v-if="editData"></v-text-field>
                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-account</v-icon>
                                <p class="mt-5"><b>RFC:</b> {{datos.rfc}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >

                            <v-autocomplete 
                            :items="paqueterias"
                            label="Paqueteria"
                            item-text="paqueteria"
                            item-value="paqueteria"
                            outlined
                            v-model="datos.paqueteria"
                            @change="verificarPaqueteria(datos.paqueteria)"
                            v-if="editData"
                            ></v-autocomplete>

                            <div class="d-flex" v-else>
                                <v-icon color="ticket" class="mr-2">mdi-truck-fast</v-icon>
                                <p class="mt-5"><b>Paqueteria:</b> {{datos.paqueteria}} </p>
                            </div>  
                        </v-col>
                        <v-col cols="12" v-if="editData && showPago">
                            <v-row>
                                <v-col cols="3">
                                    <v-text-field type="text"  append-icon="mdi-cash" label="Saldo" :disabled="true" v-model="$props.saldoDisponible" outlined color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field type="text"  append-icon="mdi-truck-fast" v-model="paqueteria" label="Gasto de nueva  paqueteria" outlined color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="3" class="text-center">
                                    <v-text-field type="text"  append-icon="mdi-cash" v-model="pagoResto"  :disabled="true" :label="`Agregar pago restante de $${saldoRestante-saldoRestante*2}`" outlined color="primary" v-if="saldoRestante < 0"></v-text-field>
                                    <v-chip color="success" label v-else>Saldo a favor: ${{saldoRestante}} </v-chip>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field type="text"  append-icon="mdi-package-variant-closed" v-model="cajas" label="Cajas" outlined color="primary"></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-select
                                        v-model="valores"
                                        :items="metodos"
                                        chips
                                        label="Métodos de pago"
                                        multiple
                                        outlined
                                        color="ticket"
                                        append-icon="mdi-cash-register"
                                    ></v-select>
                                </v-col>
                                <v-col cols="3" v-if="showEfectivo" class="text-center">
                                    <v-chip class="mb-2" color="ticket" label outlined><v-icon>mdi-cash</v-icon>  Efectivo:</v-chip>
                                    <v-text-field outlined type="text"  @keypress="soloNumeros($event)" v-model="monto_efectivo"  placeholder="0.00"></v-text-field>
                                </v-col>
                                <v-col cols="3" v-if="showDeposito" class="text-center">
                                    <v-chip class="mb-2" color="ticket" label outlined><v-icon>mdi-cellphone-arrow-down</v-icon>  Deposito:</v-chip>
                                    <v-text-field outlined type="text"  @keypress="soloNumeros($event)" v-model="monto_deposito" class="mr-2" placeholder="0.00" ></v-text-field>
                                    <v-autocomplete 
                                    label="Seleccione el banco"
                                    outlined 
                                    item-text="nombreBank"
                                    item-value="codigo"
                                    :items="banks"
                                    v-model="banco_deposito"
                                    style="margin-top:-14px"
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="3" v-if="showTransferencia" class="text-center">
                                    <v-chip class="mb-2" color="ticket" label outlined><v-icon>mdi-cash-fast</v-icon> Transferencia:</v-chip>
                                    <v-text-field outlined type="text"  @keypress="soloNumeros($event)" v-model="monto_transferencia" class="mr-2" placeholder="0.00" ></v-text-field>
                                    <v-autocomplete 
                                    label="Seleccione el banco"
                                    outlined 
                                    item-text="nombreBank"
                                    item-value="codigo"
                                    :items="banks"
                                    v-model="banco_transferencia"
                                    style="margin-top:-14px"
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="3" v-if="showOtro" class="text-center">
                                    <v-chip class="mb-2" color="ticket" label outlined><v-icon>mdi-clipboard</v-icon> Otro:</v-chip>
                                    <v-text-field outlined class="mr-2" @keypress="soloNumeros($event)" v-model="monto_otro" type="text" placeholder="0.00"></v-text-field>
                                    <v-textarea rows="1" outlined label="Nota" v-model="nota" > </v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" lg="3" >
                            <v-btn class="warning mt-4" @click="editarDatos()" v-if="!editData"><v-icon class="mr-2">mdi-pencil</v-icon> Editar Datos</v-btn>
                            <v-btn class="mt-4 mr-2" color="error" text @click="cancelar()" v-if="editData"> Cancelar</v-btn>
                            <v-btn class="ticket white--text mt-4"  @click="updateDataUser()" v-if="editData && updated"><v-icon class="mr-2">mdi-update</v-icon> Actualizar Datos</v-btn>
                            <v-btn class="ticket white--text mt-4" @click="updateData()"  v-if="editData && !updated"><v-icon class="mr-2">mdi-update</v-icon> Actualizar</v-btn>
                        </v-col>
                        <v-col cols="12" v-if="saldo">
                            <v-chip :color="saldoDisponible === 0 ? 'primary' : 'success'" label>Saldo a favor: ${{saldoDisponible}} </v-chip>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
</template>

<script>
import axios from 'axios'
export default {
    props:['orden','estatus','saldoDisponible'],
    data(){
        return{
            editData:false,
            datos:[],
            paqueterias:[], 
            loading:false,

            form:1,
            
            paqueteriaOld:'',
            paqueteriaNew:'',
            typePaqueteria:0,
            showPago:false,
            saldo:false,
            paqueteria:null,
            cambio:false,
            newEstatus:'',
            tipoCambio:0,
            paqueteriaType1:['FEDEX','DHL','ESTAFETA','PAQUETEXPRESS'],
            banks:[
                {codigo:"isn-bbva",nombreBank:"ISN BBVA"},
                {codigo:"isn-hsbc",nombreBank:"ISN HSBC"},
                {codigo:"website-bbva",nombreBank:"WEBSITE BBVA"},
                {codigo:"lemussa-bbva",nombreBank:"LEMUSSA BBVA"},
            ],
            metodos:['Efectivo','Transferencia','Deposito','Otro'],
            valores: [],
            banco_deposito:'',
            showDeposito:false,
            monto_deposito:'',
            showEfectivo:false,
            monto_efectivo:'',
            showTransferencia:false,
            monto_transferencia:'',
            banco_transferencia:'',
            showOtro:false,
            monto_otro:'',
            nota:'',
            cajas:0,
            updated:false,
            envio:'',

            historial:{
                orden:'',
                fullName:'',
                paqueteria:'',  
                estatus:'',
            },
    }
  },


    mounted(){
        this.getAllDetalleUsuario(this.orden)
        this.getAllPaqueterias()
    },

    // computed:{
    //     img(){
    //         return require(`@/assets/zapato/zapato_${this.form}.png`);
    //     }
    // },

    computed:{
        saldoRestante(){
            return this.saldoDisponible-this.paqueteria
        },

        pagoResto(){
            return this.paqueteria - this.saldoDisponible
        },
    },

    watch:{

        paqueteria(value){
            if(parseFloat(value) <  parseFloat(this.saldoDisponible)){
                this.valores = []
            }
        },

        valores(value){
            let filterEfectivo = value.filter(item => item === 'Efectivo')
            if(filterEfectivo.length > 0){
                this.showEfectivo =  true
                // this.pedido.efectivo = 'si'
            }else{
                this.showEfectivo =  false
                this.monto_efectivo = 0
            }

            let filterTransferencia = value.filter(item => item === 'Transferencia')
            if(filterTransferencia.length > 0){
                this.showTransferencia = true
            }else{
                this.showTransferencia = false
                this.monto_transferencia = 0
                this.banco_transferencia = ''
            }
            let filterDeposito = value.filter(item => item === 'Deposito')
            if(filterDeposito.length > 0 ){
                this.showDeposito =  true
            }else{
                this.showDeposito =  false
                this.monto_deposito = 0
                this.banco_deposito = ''
            }
            let filterOtro = value.filter(item => item === 'Otro')
            if(filterOtro.length > 0){
                this.showOtro =  true
            }else{
                this.showOtro =  false
                this.monto_otro = 0
                this.nota = ''
            }
        }
    },

    methods:{

        soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
        },

        async getAllPaqueterias(){
            try
            {
                const response = await axios.get(`/ventas/paqueterias`)
                this.paqueterias = response.data
                this.paqueterias.push('ENTREGA EN BODEGA');
            }catch(e){
                console.log(e)
            }
        },

        editarDatos(){
            this.editData = true
        },

        cancelar(){
            this.editData = false
        },

        actualizar(){
            this.editData = false
        },

        validarUpdate(){
            
            const dataConfirm =  {saldoFavor:0,cambio:false,newEstatus:'',success:false,monto:0,suma:0}

            this.monto_efectivo = this.monto_efectivo === '' ? 0 : this.monto_efectivo
            this.monto_deposito = this.monto_deposito === '' ? 0 : this.monto_deposito
            this.monto_transferencia = this.monto_transferencia === '' ? 0 : this.monto_transferencia
            this.monto_otro = this.monto_otro === '' ? 0 : this.monto_otro

            let suma = parseFloat(this.monto_efectivo)+parseFloat(this.monto_deposito)+parseFloat(this.monto_transferencia)+parseFloat(this.monto_otro)
            switch(this.tipoCambio){
                case 1 :
                    dataConfirm.cambio = this.cambio
                    dataConfirm.newEstatus = this.newEstatus
                    dataConfirm.success = true
                    break;
                case 2:
                    dataConfirm.saldoFavor = parseFloat(this.saldoDisponible) 
                    dataConfirm.cambio = this.cambio
                    dataConfirm.newEstatus = this.newEstatus
                    dataConfirm.success = true
                    dataConfirm.suma = parseFloat(this.saldoDisponible) - (parseFloat(this.saldoDisponible)*2)

                    break;
                case 3:
                    if(this.valores.length === 0){
                        this.$emit('alerta',`Debe seleccionar un metodo de pago`)
                    }else{
                        if(this.cajas == 0 || this.cajas === ''){
                            this.$emit('alerta',`Debe introducir cantidad de cajas`)
                        }else{
                            if(parseFloat(this.paqueteria) > parseFloat(this.pagoResto)){
                                this.$emit('alerta',`Debe agregar un monto de pago correcto`)
                            }else{
                                if(suma < parseFloat(this.pagoResto)){
                                    this.$emit('alerta',`Debe agregar los montos a los metodos de pago`)  
                                }else{
                                        if(this.monto_deposito > 0 && this.banco_deposito === ''){
                                            this.$emit('alerta','selecciona el banco para el deposito')  
                                        }else{
                                            if(this.monto_transferencia > 0 && this.banco_transferencia === ''){
                                                this.$emit('alerta','selecciona el banco para la transferencia')  
                                            }else{
                                                console.log(2,3)
                                                dataConfirm.saldoFavor = suma - this.paqueteria
                                                dataConfirm.cambio = this.cambio
                                                dataConfirm.newEstatus = this.newEstatus
                                                dataConfirm.success = true
                                                dataConfirm.monto = suma
                                                dataConfirm.suma = suma
                                            }
                                        }
                                    }
                                }  
                        }
                    }
                    break;
                case 4:
                    if(this.paqueteria === '' || parseFloat(this.paqueteria) === 0 || this.paqueteria == null){
                        this.$emit('alerta',`Debe introducir un monto en gasto de nueva paqueteria`)
                    }else{
                        if(this.saldoDisponible >= this.paqueteria){
                            if(this.cajas == 0 || this.cajas === ''){
                                    this.$emit('alerta',`Debe introducir cantidad de cajas`)
                            }else{
                                console.log(1)
                                dataConfirm.saldoFavor = parseFloat(this.saldoDisponible) - parseFloat(this.paqueteria) 
                                dataConfirm.cambio = this.cambio
                                dataConfirm.newEstatus = this.newEstatus
                                dataConfirm.success = true
                                dataConfirm.monto = parseFloat(this.paqueteria) 
                                dataConfirm.suma = this.paqueteria - this.saldoDisponible  
                            }    
                        }else{
                            let total = parseFloat(this.saldoDisponible) + parseFloat(this.pagoResto)
                            if(total === parseFloat(this.paqueteria)){
                                if(this.cajas == 0 || this.cajas === ''){
                                        this.$emit('alerta',`Debe introducir cantidad de cajas`)
                                }else{
                                    if(this.valores.length === 0){
                                    this.$emit('alerta',`Debe seleccionar un metodo de pago`)
                                    }else{
                                            if(suma <  parseFloat(this.pagoResto)){
                                                this.$emit('alerta',`Debe agregar los montos a los metodos de pago`)
                                            }else{
                                                if(this.monto_deposito > 0 && this.banco_deposito === ''){
                                                    this.$emit('alerta','selecciona el banco para el deposito')  
                                                }else{
                                                    if(this.monto_transferencia > 0 && this.banco_transferencia === ''){
                                                        this.$emit('alerta','selecciona el banco para la transferencia')  
                                                    }else{
                                                        console.log(2)
                                                        dataConfirm.cambio = this.cambio
                                                        dataConfirm.newEstatus = this.newEstatus
                                                        dataConfirm.saldoFavor  = suma - parseFloat(this.pagoResto)
                                                        dataConfirm.success = true
                                                        dataConfirm.monto = parseFloat(this.paqueteria)
                                                        dataConfirm.suma = suma
                                                    }
                                                }        
                                            }
                                    } 
                                }   
                            
                            }
                        } 
                    }
                    break;
                default:
                    break;
            }

            return dataConfirm;
        },

        async updateDataUser(){

        
            const validate = this.validarUpdate()

            if(validate.success){
                console.log(validate,'validado')
                this.loading = true
                this.datos.orden = this.orden
                this.datos.banco = `${this.banco_deposito} ${this.banco_transferencia}`
                this.datos.monto = validate.monto
                this.datos.estatus = this.newEstatus
                this.datos.cajas = this.cajas
                this.datos.suma = validate.suma
                this.datos.saldoFavor = validate.saldoFavor
                this.datos.metodos = this.valores.toString();
                this.datos.envio = this.envio
                try
                {
                    //this.$emit('updateStatus',this.newEstatus)
                    console.log(this.datos)
                    const response = await axios.put(`/ventas/dataUsuario`,this.datos);
                    if(response.status == 200){
                        console.log(response.data)
                        this.getAllDetalleUsuario(this.orden)
                        this.historial.orden = this.orden
                        this.historial.fullName = `${this.datos.nombre} ${this.datos.apellido}`
                        this.historial.paqueteria  = this.datos.paqueteria
                        this.historial.estatus = this.newEstatus
                        this.$emit('updatedHistorial',this.historial)
                        this.$emit('close');
                        this.updated = false
                    }
                            
                }catch(e)
                {
                    console.log(e)
                }  
            }else{
               //
            }
        }, 

        async updateData(){
            try
            {
                this.loading = true
                this.datos.orden = this.orden
                const response = await axios.post(`/ventas/dataUsuario`,this.datos);
                if(response.status == 200 || response.status == 201){
                    this.getAllDetalleUsuario(this.orden)
                    this.historial.orden = this.orden
                    this.historial.fullName = `${this.datos.nombre} ${this.datos.apellido}`
                    this.historial.paqueteria  = this.datos.paqueteria
                    this.historial.estatus = this.newEstatus
                    this.$emit('updatedHistorial',this.historial)
                    this.$emit('close');
                    this.updated = false
                }
                
            }catch(e)
            {
                console.log(e)
            }
        },

        async getAllDetalleUsuario(orden){
            this.loading = true
            try
            {
                const response = await axios.get(`/ventas/detallePedido?ordenLimit=${orden}`)
                if(response.status == 200){
                    this.paqueteriaOld = response.data.paqueteria
                    this.datos = response.data
                    this.editData = false
                    this.loading = false
                }
                
            }catch(e)
            {
                console.log(e)
            }
        },

        verificarPaqueteria(paqueteria){
            this.updated = true

            this.envio = paqueteria === 'ENTREGA EN BODEGA' ? 'No' : 'Si'

            let filterPaqNew = this.paqueteriaType1.filter(item => item === paqueteria);
            let filterPaqOld = this.paqueteriaType1.filter(item => item === this.paqueteriaOld);
            
            if(filterPaqNew.length === 0 && filterPaqOld.length === 0){
                console.log('solo cambiamos paqueteria')
                this.tipoCambio = 1
                this.cambio = true
                this.saldo = false
                this.newEstatus = this.estatus
                this.showPago = false
            }else{
                if(filterPaqOld.length > 0 && filterPaqNew.length === 0){
                        this.cambio = this.estatus === 'Pagado' ? true : false
                        this.tipoCambio = 2
                        this.showPago = false
                        this.saldo = true
                        this.newEstatus = 'Listo para salida'
                        console.log('saldo a favor , estatus cambia')
                }else{
                    if(filterPaqOld.length === 0 && filterPaqNew.length > 0){
                        this.tipoCambio = 3
                        this.cambio = this.estatus === 'Pagado' ? true : false
                        this.newEstatus = 'Esperando por guia'
                        this.showPago = false
                        this.saldo = false
                        console.log('agregar gastos de paqueteria, estatus cmbia',this.cambio)
                        this.showPago = true
                    }else{
                        if(filterPaqOld.length > 0 && filterPaqNew.length > 0){
                            this.tipoCambio = 4
                            this.saldo = false
                            console.log('verificar saldo antigo con nuevo costo')
                            this.showPago = true
                            this.newEstatus = this.estatus
                        }
                    }
                }
            }

        }
    }
}
</script>

<style lang="scss"> 
.loading{
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    background-color: #000000b8;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
}
.card-data{
    position: relative;
    .btn-close{
        position: absolute;
        right: 5px;
        top: 5px;
    }
}
.col-lg-3 {
    margin-bottom: -19px !important;
}
</style>