<template>
    <v-container class="mt-5">
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" sm="4" md="3" lg="3">
                                <v-text-field type="date" v-model="fecha" :max="fechaMax" outlined label="Seleccione fecha"></v-text-field>
                            </v-col>
                            <v-col cols="6" class="mirror"></v-col>
                            <v-col cols="12" sm="6" md="4" lg="4" class="text-right pt-2"><h2>Total: <b class="primary--text">${{corte.total_venta | monto}} </b> </h2></v-col>
                            <v-col cols="12" sm="6" md="4" lg="4" class="text-right pt-2"><h2>Ganancia: <b class="success--text">${{corte.ganancia | monto}} </b> </h2></v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <v-col cols="12" sm="6" md="4" lg="4">
                                <v-card outlined>
                                    <v-card-title class="primary">
                                        <h5 class="white--text">DETALLES DE PAGOS</h5>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row class="mt-3">
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#D1C4E9">
                                                    <v-icon  color="#512DA8">mdi-cash</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">Efectivo:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{corte.total_efectivo | monto}} </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#FFCCBC">
                                                    <v-icon  color="#FF5722">mdi-cellphone-arrow-down</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">Transferencia, Depositos:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{corte.total_bancos | monto}} </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#B3E5FC">
                                                    <v-icon  color="#039BE5">mdi-clipboard</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">Otro:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3> ${{corte.total_otro | monto}} </h3>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="primary">
                                        <v-col cols="6">
                                            <h3 class="white--text">Total:</h3>
                                        </v-col>
                                        <v-col cols="6" class="text-right">
                                            <v-chip label color="success"><h4>${{corte.total | monto}}</h4></v-chip>
                                        </v-col>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="4">
                                <v-card outlined>
                                    <v-card-title class="primary">
                                        <h5 class="white--text">DETALLES EXTRAS</h5>
                                    </v-card-title>
                                     <v-card-text>
                                        <v-row class="mt-3">
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#D1C4E9">
                                                    <v-icon  color="#512DA8">mdi-truck-fast</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">PAQUETERIA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{corte.total_paqueteria | monto}} </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#FFCCBC">
                                                    <v-icon  color="#FF5722">mdi-cart-percent</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">IVA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{corte.total_iva | monto}}</h3> 
                                            </v-col>
                                             <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#B3E5FC">
                                                    <v-icon  color="#039BE5">mdi-security</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">SEGURO PAQUETERIA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{corte.total_seguro | monto}} </h3>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="primary">
                                        <v-col cols="6">
                                            <h3 class="white--text">Total:</h3>
                                        </v-col>
                                        <v-col cols="6" class="text-right">
                                            <v-chip label color="warning"><h4>${{corte.total_extras | monto}} </h4> </v-chip>
                                        </v-col>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="4">
                                <v-card outlined>
                                    <v-card-title class="primary">
                                        <h5 class="white--text">DETALLES DE BANCOS</h5>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row class="mt-3">
                                            <v-col cols="6" class="d-flex celda">
                                            <v-avatar size="30" color="#D1C4E9">
                                                    <v-icon  color="#512DA8">mdi-bank-outline</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">ISN-BBVA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{monto_isn_bbva| monto}} </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#FFCCBC">
                                                    <v-icon  color="#FF5722">mdi-bank-outline</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">ISN-HSBC:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{monto_isn_hsbc | monto}} </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#B3E5FC">
                                                    <v-icon  color="#039BE5">mdi-bank-outline</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">WEBSITE-BBVA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h3>${{monto_website | monto}}  </h3> 
                                            </v-col>
                                            <v-col cols="12">
                                                <v-divider></v-divider>
                                            </v-col>
                                            <v-col cols="6" class="d-flex celda">
                                                <v-avatar size="30" color="#E8F5E9">
                                                    <v-icon  color="#4CAF50">mdi-bank-outline</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">LEMUSSA-BBVA:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <h4>${{monto_lemussa | monto}} </h4> 
                                            </v-col>     
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="primary">
                                        <v-col cols="6">
                                            <h3 class="white--text">Total:</h3>
                                        </v-col>
                                        <v-col cols="6" class="text-right">
                                            <v-chip label color="success">
                                                <h4>${{totalBancos | monto}}</h4> 
                                            </v-chip>
                                        </v-col>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="4">
                                <v-card outlined>
                                    <v-card-title class="primary">
                                        <h5 class="white--text">SALDO PENDIENTE</h5>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row class="mt-3">
                                            <v-col cols="6" class="d-flex celda">
                                               <v-avatar size="30" color="primary">
                                                    <v-icon  color="white">mdi-cash-refund</v-icon> 
                                                </v-avatar>
                                                <h3 class="primary--text ml-2">TOTAL:</h3> 
                                            </v-col>
                                            <v-col cols="6" class="text-right celda">
                                                <v-chip label color="error"><h4>-${{corte.total_saldo_pendiente | monto}} </h4></v-chip> 
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" lg="4">
                                <v-card outlined>
                                    <v-card-title class="primary">
                                        <h5 class="white--text">SALIDAS DEL DIA</h5>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row class="mt-5" v-if="salidas.length">
                                            <div class="container-salida" v-for="item in salidas" :key="item.id" >
                                                <v-row>
                                                    <v-col cols="6" class="d-flex">
                                                        <v-avatar size="32" color="primary">
                                                            <v-icon  color="white">mdi-cash-refund</v-icon> 
                                                        </v-avatar>
                                                        <h3 class="primary--text ml-2">{{item.motivo}} </h3> 
                                                    </v-col>
                                                    <v-col cols="6" class="text-right ">
                                                        <v-chip label color="error"><h4>${{item.cantidad | monto}} </h4></v-chip> 
                                                    </v-col>
                                                    <v-col cols="12">
                                                        <v-divider></v-divider>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </v-row>
                                        <v-row v-else class="mt-3">
                                            <v-col cols="12">
                                                <v-alert type="info">
                                                    <h3>No hubieron salidas</h3>
                                                </v-alert> 
                                            </v-col> 
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="primary">
                                        <v-row>
                                            <v-col cols="6">
                                                <h3 class="white--text">Total:</h3>
                                            </v-col>
                                            <v-col class="text-right">
                                                <v-chip color="error" label ><h4>${{totalSalidas | monto}}</h4></v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-row>
                            <v-col cols="12">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
export default {
    data(){
        return{
            fecha:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            corte:{
                total: 0,
                total_otro: 0,
                total_efectivo: 0,
                total_bancos: 0,
                total_paqueteria: 0,
                total_iva: 0,
                total_seguro: 0,
                total_saldo_pendiente:0,
                total_extras:0,
                total_venta:0,
                ganancia:0
            },
            salidas:[],
            bancos:['isn-bbva','isn-hsbc','website-bbva','lemussa-bbva'],
            monto_isn_bbva:0,
            monto_isn_hsbc:0,
            monto_website:0,
            monto_lemussa:0
        }
    },

    watch:{
        fecha(value){
            this.getAllCorte(value)
            this.getAllAsignedDataBank(value)
            this.getAllSalidas(value)
        }
    },

    filters:{
        monto(value){
            let numero = parseFloat(value);
            let dato = null;
            if(Number.isInteger(numero)){ 
                let monto = numero.toFixed(2) 
                let cantidad = parseFloat(monto)
                let datos = cantidad.toLocaleString('en');
                dato =  `${datos}.00 `
            }else{
                var dec;
                dec = String(value).split(".");
                let decimal = dec.pop()
                let num = parseInt(decimal)
                if(num < 10){
                    let cantidad = parseFloat(`${dec[0]}.${num*10}`);
                    let total = parseFloat(cantidad)
                    let datos =   total.toLocaleString('en');
                    dato  =  `${datos}0`
                }else{
                    let cantidad = numero.toFixed(2);
                    let total = parseFloat(cantidad);
                    dato = total.toLocaleString('en');
                }
            }
            return dato;
        }
    },

    computed:{
        totalBancos(){
            return parseFloat(this.monto_isn_bbva)+parseFloat(this.monto_isn_hsbc)+parseFloat(this.monto_website)+parseFloat(this.monto_lemussa)
        },

        fechaMax(){
            const d   = new Date()
            let day   = d.getDate()
            let month = d.getMonth()
            let year  = d.getFullYear()

            month +=1;

            day   = ('0' + day).slice(-2);
            month = ('0' + month).slice(-2);

            return `${year}-${month}-${day}`
        },

        totalSalidas(){
            const acumular = (acumulador,salida) => acumulador + parseFloat(salida.cantidad)
            return this.salidas.reduce(acumular,0)
        }
    },

    mounted(){
        this.getAllCorte(this.fecha)
        this.getAllAsignedDataBank(this.fecha)
        this.getAllSalidas(this.fecha)
    },

    methods:{

        ...mapMutations('overlay',['setActiveOverlay','setDesactiveOverlay']),

        async getAllCorte(fecha){
            this.setActiveOverlay()
            try
            {
                let data = {"fecha":fecha}
                const response = await axios.post(`/ventas/corte`,data)
                if(response.status == 200){
                    this.corte = Object.assign({}, response.data)
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        getAllAsignedDataBank(fecha){
            this.bancos.forEach(banco => {
                this.getAllDataMontoBank(fecha,banco)
            });
        },
        
        async  getAllDataMontoBank(fecha,banco){
            this.bancosMontos = []
            try
            {
                const response = await axios.get(`/ventas/corte?fecha=${fecha}&banco=${banco}`)
                if(response.status == 200){
                    switch(banco){
                        case 'isn-bbva':
                            this.monto_isn_bbva = response.data.total_banco
                            break;
                        case 'isn-hsbc':
                            this.monto_isn_hsbc = response.data.total_banco
                            break;
                        case 'website-bbva':
                            this.monto_website = response.data.total_banco
                            break;
                        case 'lemussa-bbva':
                            this.monto_lemussa = response.data.total_banco
                            break;
                        default:
                            break;
                        
                    }
                }
            }catch(e){
                console.log(e)
            }
        },

        async getAllSalidas(fecha){
            try
            {
                const response = await axios.get(`/ventas/salidas?fecha_salida=${fecha}`)
                if(response.status == 200){
                    this.salidas = response.data
                    setTimeout(()=>{
                        this.setDesactiveOverlay()
                    },700);
                }
            }catch(e)
            {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss">
    .celda{
        cursor: pointer;
        border-radius: 8px !important;
        &:hover{
            background-color:rgb(231, 231, 255);
        }
    }

    .container-salida{
        width: 90%;
        margin: auto;
        margin-bottom: 3px;
        margin-top: 2px;
    }

    .mirror{
        display: none;
        @media(max-width:955px){
            display: block;
        }
    }
</style>