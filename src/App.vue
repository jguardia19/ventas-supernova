<template>
  <v-app>
       
        <overlay-await></overlay-await>
        <alert-mensaje></alert-mensaje>
        <notification-ventas></notification-ventas>
        
        <component :is="layout">
            <router-view :layout.sync="layout"/>
        </component>
       <footer>Copyright © 2022 All Rights Reserved by Importadora Supernova.</footer>
  </v-app>
</template>

<script>
import AlertMensaje from './components/elements/alertMensaje.vue';
import NotificationVentas from './components/elements/notificationVentas.vue';
import OverlayAwait from './components/elements/OverlayAwait.vue';
const defaultLayout = 'dashboard-layout'
export default {
  components: { OverlayAwait,AlertMensaje, NotificationVentas },
  name: 'App',

  data: () => ({
    //
  }),

   computed: {
        layout (){
          return (this.$route.meta.layout || defaultLayout)  
        }
    },
};
</script>
<style lang="scss">
  header{
    height: 95px !important;
    box-shadow: none !important;
    @media(max-width:850px){
      height: 65px !important;
    }
  }

  main{
    padding: 57px 0px 0px !important;
    @media(max-width:850px){
      padding: 28px 0px 0px !important;
    }
  }

  .v-main__wrap {
    background:linear-gradient(180deg, rgba(44, 138, 245, 0.8), rgba(3, 46, 120) 70.71%) !important;
    color: #2a2929; 
  }
  
  @media (min-width: 960px){
    .container {
      max-width: 100% !important;
    }
  }

  footer{
    background-color: transparent !important;
    color: #fff;
    bottom: 0;
    position: fixed;
    width: 100%;
    text-align: center;
  }


</style>
