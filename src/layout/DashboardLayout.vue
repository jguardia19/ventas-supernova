<template>
  <v-app id="inspire">
      <v-app-bar
      app
      color="primary"
      dark
    >
    <div class="logo">
        <a href="/pedidos"> <img src="@/assets/icon-white-supernova.png" alt="" width="60px" style="margin-top:25px"></a>
        <div class="title text-center"> 
          <h2 class="mt-2">VENTAS</h2>
          <h4>Supernova</h4>
        </div>
    </div>

    <!-- icon para menu mobile -->
    <div class="btn-mobile">
      <v-btn icon color="white" @click="menuOpenClose()">
        <v-icon large>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>

    <!-- menu central -->
    <div class="menu-ventas">
        <v-list-item
          v-for="(item,index) of routes"
          :key="index"
          :to="item.ruta"
          color="white"
        >
          <span class="badge" v-if="item.ruta === '/pedidos'">{{countPedidos}} </span>
          <span class="badge" v-if="item.ruta === '/creditos'">{{countPedidosCredito}} </span>
          <span class="badge" v-if="item.ruta === '/procesados'">{{countProcesados}} </span>
          <span class="badge" v-if="item.ruta === '/almacen'">{{countAlmacen}} </span>
          <span class="badge" v-if="item.ruta === '/carritoCompras'">{{countCarritos}} </span>
          <v-list-item-title :to="item.path">
            <v-icon>{{ item.icono }}</v-icon> <br>
            {{ item.nombre_modulo }}
        </v-list-item-title>
        </v-list-item>
    </div> 

      <!-- boton para modo dark  -->
      <v-btn @click="$vuetify.theme.dark = ! $vuetify.theme.dark" text color="white">
        <v-icon v-if="$vuetify.theme.dark">mdi-moon-waning-crescent</v-icon>
        <v-icon v-else>mdi-white-balance-sunny</v-icon>
          Dark mode
      </v-btn>

      <div class="text-center logout-session">
          <v-menu>
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <span>{{user}}</span>
                  <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="white"
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  >
                    <v-icon dark color="primary">
                        mdi-account
                    </v-icon>
                  </v-btn>
                </template>
                    <span>Cerrar sesion</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                      <v-btn icon color="primary" @click="Logout()">
                        <v-icon>mdi-logout</v-icon>
                      </v-btn>             
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn text color="primary" @click="Logout()"> Cerrar Sessión</v-btn> 
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                    color="error"
                    text
                    @click="fav = !fav"
                    >
                      Cancelar
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card> 
          </v-menu>
      </div>



    </v-app-bar>
    <v-main class="mt-3">
      <v-container>
        <slot />
      </v-container>
      
    </v-main>

   <transition 
        enter-active-class="animate__animated animate__fadeInLeft"
        leave-active-class="animate__animated animate__fadeOutLeft"
        mode="out-in">
    <div class="menu-mobile" v-if="menu_mobile"> 
     
        <div class="card-menu light" v-if="menu" >
          <v-btn icon color="error" class="btn-close-menu-mobile" @click="menuOpenClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
              <v-list dense>
                <v-subheader>Importadora Supernova</v-subheader>
                  <v-list-item-group
                    v-model="selectedItem"
                    color="primary"
                  >
                    <v-list-item
                      v-for="(item, i) in routes"
                      :key="i"
                      :to="item.ruta"
                      @click="menuOpenClose()"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="item.icono"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title >
                          {{item.nombre_modulo}} 
                          <v-chip color="error" v-if="item.ruta === '/pedidos'"> {{countPedidos}} </v-chip>
                          <v-chip color="error" v-if="item.ruta === '/creditos'"> {{countPedidosCredito}} </v-chip>
                          <v-chip color="error" v-if="item.ruta === '/procesados'"> {{countProcesados}} </v-chip>
                          <v-chip color="error" v-if="item.ruta === '/almacen'"> {{countAlmacen}} </v-chip>
                          <v-chip color="error" v-if="item.ruta === '/carritoCompras'"> {{countCarritos}} </v-chip>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
        </div>
    </div> 
     </transition>
  </v-app>

</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import axios from 'axios'
export default {
  data() {
    return {
      on_drawer: true,
      menu_mobile:false,
      menu:false,
      selectedItem: 0,
      user:sessionStorage.getItem('user'),
      routes: [],
      notification: false,
      pedidos:false,
      pedidosVip:false,
      titulo:''
    };
  },

  mounted(){
      this.viewModulesTypeUser()
      this.Permisos()
      this.getAllPedidosPagados()
      this.getAllPedidosCredito()
      this.getAllPedidosProcesados()
      this.getAllPedidosAlmacen()
      this.findAllCarritos()
  },

  computed:{
    ...mapGetters('pedidos',['countPedidos','countPedidosCredito','countProcesados','countAlmacen','countCarritos']),
  },

  methods: {

    ...mapActions('pedidos',['getAllPedidosPagados','getAllPedidosCredito','getAllPedidosProcesados','getAllPedidosAlmacen','findAllCarritos']),

    ...mapActions('login',['Logout']),
    
    ...mapActions('permisos',['Permisos']),

    //metodo para ver los modulos asignados al tipo de usuario
        async viewModulesTypeUser(){
            let id = parseInt(sessionStorage.getItem('type_user'));
            try{
                const response = await axios.get(`/adminVentas/permisosBodega?type=${id}`);
                let data = response.data
                data.forEach(element => {
                    if(element.view && element.edit){
                        this.routes.push(element)
                    }
                });
            }catch(e){
                console.log(e)
            }
        },

    menuOpenClose(){
      this.menu_mobile = !this.menu_mobile
      this.menu = !this.menu
    }
  },
};
</script>

<style lang="scss">


.menu-ventas{
    width: 67%;
    display: flex;
    margin:100px auto !important;
    height: 95px;
    padding-top: 25px;
    @media(max-width:1300px){
      width: 85%;
    } 
    @media(max-width:960px){
      width: 100%;
    }
    @media(max-width:850px){
      display: none;
    }
    .v-list-item{
    text-align: center;
    width: 50px !important;
    }
}

.btn-mobile{
  display: none;
  @media(max-width:850px){
      display: block;
  }
}

.logo{
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
  @media(max-width:1300px){
      margin-left: 0px;
  }  
  @media(max-width:960px){
    display: none;
  }
  .title{
    height: 50px;
    @media(max-width:1300px){
      display: none;
    }  
  }
}

.menu-mobile{
  top: 0;
  left: .0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.671);
  position:fixed;
  z-index: 10;
  .card-menu{
    width: 60%;
    height: 100vh;
    background-color: #fff;
    .btn-close-menu-mobile{
      position: absolute;
      right: 40%;
      top: 5px;
    }
  }
}

.badge{
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: red;
  color: #fff;
  z-index: 2;
  top: 2px;
  right: 3px;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}

 .logout-session{
      position: absolute;
      right: 15px;
      top: 45px;
      @media(max-width:1300px){
        right: -3px;
        top: 54px;
      }
      @media(max-width:960px){
        top: 20px;
      }
  }
</style>