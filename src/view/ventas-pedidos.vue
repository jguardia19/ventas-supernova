<template>
  <v-container class="mt-3">
    <v-dialog max-width="400" v-model="modal_qr">
       <v-card>
             <qr-code 
                    style="positio"
                      v-bind="attrs"
                      v-on="on"
                        :text="`https://www.importadorasupernova.com/mipdf/imprimirreg.php?orden=${ordenPedido}&id=${idClient}`"
                        size="400"
                        color="#2057a5"
                        bg-color="#fff" 
                        error-level="L">
                    </qr-code>
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
            <v-col cols="12" sm="6" md="4" lg="3" class="d-flex">
              <v-btn class="primary" @click="$router.push('/pedidos/newPedido')"><v-icon>mdi-plus</v-icon> Agregar pedido</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="px-5 py-3" elevation="0">
          <v-card-title>
            <v-icon class="mr-2" color="primary" large>mdi-file-multiple</v-icon>
            Pedidos
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
              <span class="primary px-2 py-2 white--text"
                >${{ item.total}}
              </span>
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
                    @click="$router.push(`/pedidos/procesar/${item.orden}`)"
                  >
                    <v-icon>mdi-cart-arrow-right</v-icon>
                  </v-btn>
                </template>
                <span>Procesar venta</span>
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="black"
                    class="mr-2"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="viewQR(item)"
                  >
                    <v-icon>mdi-qrcode</v-icon>
                  </v-btn>
                </template>
                <span>QR</span>
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
import {mapMutations} from 'vuex'
export default {
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
      modal_qr:false,
      ordenPedido:'',
      idClient:'',

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
    //this.setActiveOverlay()
    this.getAllPedidosPagados();
    //this.getAllReport()
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
  },

  methods: {

    ...mapMutations('overlay',['setActiveOverlay','setDesactiveOverlay']),

    save(){

    },

    async getAllPedidosPagados() {
        try {
          const response =  await axios.get(`/ventas/pedidos`)
              if(response.status == 200){
                  this.pedidos = response.data;
              }   
              this.setDesactiveOverlay()
        } catch (e) {
          this.setDesactiveOverlay()
        }
    },

    async getAllPedidosDate(fecha_pedidos) {
        this.setActiveOverlay()
        try {
            const response = await axios.get(`/ventas/pedidos?fecha=${fecha_pedidos}`);
            if(response.status == 200){
                console.log('data',response.data) 
                this.pedidos = response.data;  
            }
            this.setDesactiveOverlay()
        }catch (e) {
            console.log(e);
            this.setDesactiveOverlay()
        }
    },

    async getAllReport() {
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
                
                const response = await axios.get(`/ventas/pedidos?fecha=${fecha}`);
                datos.push(response.data)
            }


            console.log(datos)
        }catch (e) {
        console.log(e);
        }
    },


    async getAllPedidoOrden(orden){
        this.setActiveOverlay()
        try
        {
            await axios.get(`/ventas/pedidos?orden=${orden}`).then((response)=>{
              if(response.status == 200){
                this.pedidos = response.data;  
              } 
            }).catch((error)=>{
              console.error(error)
            });
            this.setDesactiveOverlay() 
           
        }catch(e)
        {
            console.log(e)
            this.setActiveOverlay()
        }
    },

    viewQR(item){
      this.ordenPedido = item.orden
      this.idClient  = item.id
      this.modal_qr = true
    }

    }
};
</script>

<style laang="scss">
.btn-search {
  height: 55px !important;
  margin-left: -4px !important;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}
.v-text-field fieldset, .v-text-field .v-input__control {
    margin-bottom: 0px !important;
}
</style>