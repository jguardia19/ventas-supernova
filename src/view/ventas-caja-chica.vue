<template>
    <v-container class="mt-5">

        <v-dialog v-model="modal_alert" max-width="500">
            <v-card>
                <v-card-title>
                    <v-col cols="12" class="d-flex justify-space-between">
                        <h4 class="error--text">{{title}} </h4>
                        <v-btn icon color="error" @click="closeModalDelete()">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-card-title>
                <v-card-text>
                    <v-row class="mt-3">
                        <v-col cols="12">
                            <h3>{{text}} </h3>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-col cols="12" class="text-right">
                        <v-btn text color="error" class="mr-2" @click="closeModalDelete()">CANCELAR</v-btn>
                        <v-btn class="success" @click="deleteSalida()" v-if="confirm">CONFIRMAR</v-btn>
                    </v-col>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-row>
            <v-col cols="12">
                <v-card elevation="0" class="px-3 py-3">
                    <v-row>
                        <v-col cols="12" class="text-right">
                            <h2 class="primary--text">Saldo disponible: <span class="success--text">${{saldoCajaChica}}.00 </span> </h2>
                            <p><i>Ultima actualizacion: {{fechaRecarga}} </i> </p>
                        </v-col>
                    </v-row>
                </v-card> 
            </v-col>
            <v-col cols="12" sm="12 " md="4" lg="4">
                <v-card elevation="0" class="px-2 py-3">
                    <v-card-title>
                        <v-col cols="12">
                            <v-alert type="info" >
                                <span class="h3--text white--text" >Agregar gastos diarios</span>
                            </v-alert>
                        </v-col>
                    </v-card-title>
                    <v-row>
                        <v-col cols="12" sm="12" md="10" lg="8" class="mx-auto">
                            <v-text-field type="number" outlined placeholder="$0.00" v-model="monto_salida" @keypress="soloNumeros($event)" label="Ingrese el monto"></v-text-field>
                            <v-textarea rows="3" outlined label="Describa el motivo" v-model="motivo_salida"  @keypress.enter="saveSalida()"></v-textarea>
                            <button class="btn-salida" @click="saveSalida()" >INGRESAR SALIDA</button>
                        </v-col>
                    </v-row>
                    <v-row class="mb-8">
                        <v-col cols="12">
                            <v-alert type="info" >
                                <span class="h3--text white--text" >Agregar dinero a caja chica</span>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="10" lg="8" class="mx-auto">
                            <v-text-field type="number" outlined placeholder="$0.00" v-model="monto_deposito" @keypress="soloNumeros($event)" label="Ingrese el monto"></v-text-field>
                            <v-text-field type="text" outlined label="Token" v-model="token"></v-text-field>
                            <button class="btn-salida" @click="addDineroCajaChica()" >INGRESAR DINERO</button>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="8" lg="8">    
                <v-card elevation="0" class="px-3">
                    <v-card-title>
                    <v-icon class="mr-2" color="primary" large>mdi-cash-minus</v-icon>
                    Salidas
                    <v-chip label color="error" class="ml-2">Gastos del dia: ${{totalGasto}}.00 </v-chip>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-text-field type="date" v-model="fecha" outlined label="fecha" :max="fechaMax" ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="header"
                    :items="salidas"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    mobile-breakpoint="0"
                >
                    <template v-slot:[`item.number`]="{ index }">
                    <span>{{ index + 1 }} </span>
                    </template>
                    <template v-slot:[`item.cant`]={item}>
                        <v-chip label color="warning">${{item.monto}}.00</v-chip>
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
                            @click="confirmDelete(item)"
                            >
                            <v-icon>mdi-delete-empty-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                    </template>
                </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <!-- <Bar
                        :chart-options="chartOptions"
                        :chart-data="chartData"
                        :chart-id="chartId"
                        :dataset-id-key="datasetIdKey"
                        :plugins="plugins"
                        :css-classes="cssClasses"
                        :styles="styles"
                        :width="width"
                        :height="height"
                    /> -->
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
// import { Bar } from 'vue-chartjs/legacy'
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// } from 'chart.js'

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
export default {
    // components: {
    //     Bar
    // },
    // props: {
    //     chartId: {
    //     type: String,
    //     default: 'bar-chart'
    //     },
    //     datasetIdKey: {
    //     type: String,
    //     default: 'label'
    //     },
    //     width: {
    //     type: Number,
    //     default: 400
    //     },
    //     height: {
    //     type: Number,
    //     default: 400
    //     },
    //     cssClasses: {
    //     default: '',
    //     type: String
    //     },
    //     styles: {
    //     type: Object,
    //     default: () => {}
    //     },
    //     plugins: {
    //     type: Array,
    //     default: () => []
    //     }
    // },
    data(){
        return{
        salidas:[],
        page: 1,
        pageCount: 0,
        itemsPerPage: 100,
        saldoCajaChica:'',
        fechaRecarga:'',
        fecha:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        monto_salida:'',
        motivo_salida:'',
        modal_alert:false,
        id_delete:null,
        monto_deposito:'',
        token:'',
        title:'',
        text:'',
        monto_delete:null,
        confirm:false,
        header: [
            {
            text: "#",
            value: "number",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
            {
            text: "Motivo",
            value: "motivo",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
            {
            text: "Cantidad",
            value: "cant",
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
        //this.calcularFechas()
        this.getAllCajaChica()
        this.getSaldoCajaChica()
    },

    computed:{
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

        totalGasto(){
            const acumular = (acumulador,salida) => acumulador + parseFloat(salida.monto)
            return this.salidas.reduce(acumular,0)
        }
    },

    watch:{
        fecha(value){
            this.searchFechaSalidas(value)
        }
    },

    methods:{

        async calcularFechas(){
            let date = new Date();
            let mes = date.getMonth()+1;
            let year = date.getFullYear();

            let dias_mes = new Date(2022, mes, 0).getDate();

            for(let i=1;i<=dias_mes;i++){
                let dia = i < 10 ? `0${i}` : i ;
                let fecha = `${dia}-${mes}-${year}`
                this.chartData.labels.push(fecha)
                console.log(fecha)
            }

            for(let i=0;i<=dias_mes;i++){
                let d = dias_mes-i;
                let dia = d < 10 ? `0${d}` : d
                let fecha = `${year}-${mes}-${dia}`
                await this.searchFecha(fecha)
            }
        },

        ...mapMutations('notification',['setActiveModal']),

        soloNumeros(e){
            var key = window.event ? e.which : e.keyCode;
            if ((key < 48 && key != 46) || (key > 57 && key !=46) ) {
                e.preventDefault();
            }
        },

        async getAllCajaChica(){
            try
            {
                const response = await axios.get(`/ventas/salidas?caja=caja`)
                if(response.status == 200){
                    this.salidas = response.data 
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        async searchFechaSalidas(value){
            try
            {
                const response = await axios.get(`/ventas/salidas?fecha=${value}`)
                if(response.status == 200){
                    this.salidas = response.data 
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        async searchFecha(value){
            let monto = 0;
            try
            {
                const response = await axios.get(`/ventas/salidas?fecha=${value}`)
                if(response.status == 200){
                    response.data.forEach(element => {
                        monto = monto + parseFloat(element.monto)
                    });
                }
                this.chartData.datasets[0].data.unshift(monto)
            }catch(e)
            {
                console.log(e)
            }
        },

        async getSaldoCajaChica(){
            try
            {
                const response = await axios.get(`/ventas/dineroCajaChica`);
                if(response.status == 200){
                    this.saldoCajaChica = response.data.saldo
                    this.fechaRecarga = response.data.fecha_recarga
                }
            }catch(e)
            {
                console.log(e)
            }
        },
        async saveSalida(){
            if(this.monto_salida === '' || this.monto_salida === ''){
                this.title = 'Verificar'
                this.text = 'Debes introducir monto y motivo para agregar salida'
                this.modal_alert = true
            }else{
                try
                {
                    let data = {"monto":parseFloat(this.monto_salida),"motivo":this.motivo_salida,"action":'add'}
                    const response = await axios.post(`/ventas/dineroCajaChica`,data);
                    if(response.status == 200){
                        this.monto_salida = '' , this.motivo_salida = ''
                        this.getAllCajaChica()
                        this.getSaldoCajaChica()
                    }
                }catch(e)
                {
                    console.log(e)
                } 
            }
            
        },

        async addDineroCajaChica(){
            if(this.monto_deposito === '' || this.token === ''){
                this.title = 'Verificar'
                this.text = 'Debes introducir monto o agregar el token para agregar'
                this.modal_alert = true
            }else{
                try
                {
                    let data = {"monto":parseFloat(this.monto_deposito),"token":this.token,"action":'caja'}
                    const response = await axios.post(`/ventas/dineroCajaChica`,data);
                    if(response.status == 200){
                        console.log(response.data)
                        let datos = {"icon":"mdi-check-circle-outline","title":response.data.mensaje,"text":"","status":'success',"textButton":"CERRAR","modal":true}
                        this.setActiveModal(datos)
                        this.monto_deposito = '' , this.token = ''
                        this.getSaldoCajaChica()
                    }
                }catch(e)
                {
                    if(e.response.status == 400){
                        this.title = 'Ocurrio un error'
                        this.text = e.response.data.mensaje
                        this.confirm = false
                        this.modal_alert = true 
                    }
                    
                } 
            }
            
        },

        confirmDelete(item){
            this.id_delete = item.id
            this.monto_delete = parseFloat(item.monto)
            this.title = 'Estas seguro de eliminar el registro?'
            this.text = `Se eliminara de manera permanente el monto:$${item.monto}.00 del motivo: ${item.motivo} `
            this.confirm = true
            this.modal_alert = true
        },

        async deleteSalida(){
            try
            {
                let data = {"monto":this.monto_delete,"id":this.id_delete,"action":'delete'}
                const response = await axios.post(`/ventas/dineroCajaChica`,data)
                if(response.status == 200){
                    this.getAllCajaChica()
                    this.getSaldoCajaChica()
                    this.closeModalDelete()
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        closeModalDelete(){
            this.id_delete = null
            this.modal_alert = false
            this.title = ''
            this.text = ''
            this.confirm = false
        }
    }
}
</script>

<style lang="scss">
    .btn-salida{
        width: 100% !important;
        background-color: #2057a5;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 12px;
        &:hover{
            background-color: #133769;
        }
    }
    
</style>