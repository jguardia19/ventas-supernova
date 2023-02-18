<template>
    <v-app id="inspire" class="login">
        <slot/>
        <footer>Copyright © 2022 All Rights Reserved by Importadora Supernova.</footer>
    </v-app>
    
</template>

<script>
export default {
}
</script>

<style lang="scss">
    .login{
        // background-image: url('../assets/background-bodega-desk.jpg') !important;
        // background-repeat: no-repeat !important;
        // background-position: center !important;
        // background-size: cover !important;
        background:linear-gradient(180deg, rgba(44, 138, 245, 0.8), rgba(3, 46, 120) 70.71%) !important;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        @media(max-width:620px){
            // background-image: url('../assets/background-supernova-mob.png') !important;
        }
        
    }

</style>