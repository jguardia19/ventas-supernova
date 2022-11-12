<template>
  <v-container class="mt-3">
    <transition 
            enter-active-class="animate__animated animate__fadeInUp"
            leave-active-class="animate__animated animate__fadeOutUp"
            mode="out-in">
            <component 
            :is='component'  
            :orden="Orden" 
            :estatus="Estatus"
            :saldoDisponible="saldo"
            @close="closeViewData"
            @updateStatus="modificarEstatus"
            @updatedHistorial="actualizarHistorial"
            @alerta="alertConfirm"
            ></component>
    </transition>

    <v-dialog v-model="modal_confirm" max-width="400">
            <v-card class="card_confirm">
                <v-card-text>
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-icon :color="modal_confirm_data.status" class="card_confirm__icon">{{modal_confirm_data.icon}}</v-icon>
                            <h1 class="card_confirm__title">{{modal_confirm_data.title}} </h1>
                            <p class="card_confirm__text">{{modal_confirm_data.texto}} </p>
                        </v-col>
                        <v-col cols="12" class="text-right">
                            <v-btn text color="error" @click="modal_confirm = false">CANCELAR</v-btn>
                        </v-col>
                    </v-row>  
                </v-card-text>
            </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12">
        <v-card class="px-5 py-8" elevation="0">
          <v-row class="mt-2">
            <v-col cols="12" sm="6" md="4" lg="3" class="d-flex">
              <v-text-field
                outlined
                label="Buscar Folio"
                placeholder="000-00"
                type="text"
                v-model="orden"
                @keypress.enter="getAllPedidoOrden(orden)"
              ></v-text-field>
              <v-btn class="primary btn-search" @click="getAllPedidoOrden(orden)">Buscar folio</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3" class="d-flex">
                
                <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="fecha_pedidos"
                persistent
                width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="fecha_pedidos"
                    label="Fecha de pedidos"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="fecha_pedidos" scrollable  :max="fechaMax">
                  <v-spacer></v-spacer>
                  <v-btn text color="error" @click="modal = false">
                    Cancelar
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(fecha_pedidos)">
                    Elegir
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-btn class="primary btn-search" @click="getAllPedidosDate(fecha_pedidos)">Buscar</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="6" class="d-flex justify-space-end">
                <v-card class="px-3 py-3" elevation="2" width="800" v-if="history.fullName != ''">
                    <v-card-title>
                        <h5 class="primary--text">Ultimo registro editado</h5>
                    </v-card-title>
                    <v-row>
                      <v-col cols="2" class="text-center">
                        <v-avatar color="primary">
                            <span class="white--text text-h5">{{avatar}} </span>
                        </v-avatar>
                      </v-col>
                      <v-col cols="4" class="text-center">
                        <p>Nombre Completo</p>
                        <span class="primary--text" >{{history.fullName}} </span>
                      </v-col>
                      <v-col cols="3" class="text-center">
                            <p>Orden:</p>
                            <v-chip color="success" label> {{history.orden}} </v-chip>
                      </v-col>
                      <v-col cols="3" class="text-center">
                            <p>Paqueteria</p>
                            <v-chip color="primary" outlined label>{{history.paqueteria}} </v-chip>
                      </v-col>
                    </v-row>
                </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="px-5 py-3" elevation="0">
          <v-card-title>
            <v-icon class="mr-2" color="primary" large>mdi-file-check</v-icon>
            Ventas Procesadas
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-data-table
            :headers="header"
            :items="pedidos"
            :search="search"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            mobile-breakpoint="0"
            :key="1"
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
                  >${{ item.total}}
                </span>
              </v-chip>
              
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="warning"
                    class="mr-2"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="viewData(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <a style="text-decoration:none" :href="`https://www.importadorasupernova.com/mipdf/imprimirreg.php?orden=${item.orden}&id=${item.id} `" target="_blank">
                      <v-btn
                      color="error"
                      class="mr-2"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                  </a>
                </template>
                <span>Imprimir</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import updateDatosOrden from '@/components/update-datos-orden.vue'
import {mapMutations} from 'vuex'
export default {
    components:{updateDatosOrden},
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 100,
      search: "",
      pedidos: [],
      fecha_pedidos:(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modal:false,
      orden:'',
      ordenPedido:'',
      idClient:'',
      component:'',
      Orden:'',
      Estatus:'',
      saldo:0,

      history:{
          orden:'',
          fullName:'',
          paqueteria:'',  
          estatus:'',
      },

      modal_confirm:false,
      modal_confirm_data:{
        status:'warning',
        icon:'mdi-alert',
        title:'Peticion incompleta',
        texto:'',
      },

      header: [
        {
          text: "#",
          value: "number",
          align: "center",
          class: "primary white--text px-0 mx-0",
        },
        {
          text: "Cliente",
          value: "nombres",
          align: "center",
          class: "primary white--text px-0 mx-0",
        },
        {
          text: "Orden",
          value: "Orden",
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
          text: "Cantidad de productos",
          value: "cant",
          align: "center",
          class: "primary white--text px-0 mx-0",
        },
        {
          text: "Total de ventas",
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
    };
  },

  mounted() {
    this.setActiveOverlay()
    this.getAllPedidosPagados();

    if(navigator.onLine) {
      console.log('hay internet')
    } else {
      console.log('no hay internet')
    }

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

    avatar(){
      return this.history.fullName[0]
    }
  },

  methods: {

    ...mapMutations('overlay',['setActiveOverlay','setDesactiveOverlay']),

    save(){

    },

    async getAllPedidosPagados() {
        this.closeViewData()
        try {
        const response = await axios.get(
            `/ventas/pedidosProcesados`
        );
        console.log(response.data);
        if(response.status == 200){
            if(response.data.status == 401){
              console.log(response.data.mensaje)
            }else{
              this.pedidos = response.data;
            }
            this.setDesactiveOverlay()
        }
        
        } catch (e) {
        console.log(e);
        }
    },

    async getAllPedidosDate(fecha_pedidos) {
        this.closeViewData()
        this.setActiveOverlay()
        try {
            const response = await axios.get(
            `http://localhost/supernova-almacen-api/ventas/pedidosProcesados?fecha=${fecha_pedidos}`
        );
        if(response.status == 200){
          if(response.data.status == 401){
              console.log(response.data.mensaje)
            }else{
              this.pedidos = response.data;
            }
            this.setDesactiveOverlay()   
        }
        }catch (e) {
        console.log(e);
        }
    },

    async getAllReport() {
        this.closeViewData()
        let date = new Date();
        let day = date.getDate();
        let moth = date.getMonth()+1;
        let year = date.getFullYear();
        console.log(day,moth,year)


        let datos = [];
        try {
            for(var i =0;i<7;i++){
                let fecha = ''; 
                if((day-i) < 10){
                    fecha = `${year}-${moth}-0${day-i}`;
                }else{
                    fecha = `${year}-${moth}-${day-i}`;  
                }
                
                const response = await axios.get(`http://localhost/supernova-almacen-api//ventas/pedidosProcesados?fecha=${fecha}`);
                datos.push(response.data)
            }

            console.log(datos)
        }catch (e) {
        console.log(e);
        }
    },


    async getAllPedidoOrden(orden){
        this.setActiveOverlay()
        this.closeViewData()
        try
        {
            const response = await axios.get(`http://localhost/supernova-almacen-api/ventas/pedidosProcesados?orden=${orden}`);
            if(response.status == 200){
                if(response.data.status == 401){
                  console.log(response.data.mensaje)
                }else{
                  this.pedidos = response.data;
                }
              this.setDesactiveOverlay()
            } 
        }catch(e)
        {
            console.log(e)
            this.setActiveOverlay()
        }
    },

    viewData(item){
        window.scrollTo( 0, 0);
        console.log(item)
        this.component = ''
        setTimeout(()=>{
            this.Orden = item.orden
            this.Estatus = item.estatus
            let paqueteria = item.venta_paqueteria === '' ? 0 : item.venta_paqueteria
            this.saldo =  parseFloat(paqueteria)  + parseFloat(item.saldo_pendiente)
            this.component = 'updateDatosOrden'
        },300);
        
    },

    closeViewData(){
        this.component = ''
        this.Orden = ''
    },

    modificarEstatus(estatus){
        this.Estatus = estatus
    },
     
    alertConfirm(mensaje){
      this.modal_confirm_data.texto = mensaje
      this.modal_confirm = true
    },

    actualizarHistorial(historial){
       this.history = {}
       this.history = Object.assign({}, historial)
       this.getAllPedidosPagados()
    }


    }
};
</script>

<style lang="sass">
.btn-search 
  height: 55px !important
  margin-left: -4px !important
  border-top-left-radius: 0px !important
  border-bottom-left-radius: 0px !important


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


.fade-enter-from,.fade-leave-to
    opacity: 0
    
.fade-enter-active,.fade-leave-active
    transition: opacity 0.1s ease-out

.v-text-field fieldset, .v-text-field .v-input__control 
    margin-bottom: 0px !important
</style>