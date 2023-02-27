<template>
    <div class="container-login">
        <div class="form-login">
            <mensaje-login></mensaje-login>
            <img src="@/assets/logo-supernova-blue.png" alt="" width="160">
            <v-row class="mt-2">
                <v-col cols="12">
                    <v-text-field type="email" outlined label="Usuario" v-model="loginModel.username" append-icon="mdi-account"> </v-text-field>
                    <v-text-field type="password" outlined label="Contraseña"  v-model="loginModel.password" append-icon="mdi-lock" @keypress.enter="loginSession()"> </v-text-field>
                    <v-btn class="primary" @click="loginSession()" style="width: 100%;">ENTRAR</v-btn>
                </v-col>
            </v-row>

        </div>
    </div>
</template>

<script>
import MensajeLogin from '@/components/elements/MensajeLogin.vue'
import {mapActions} from 'vuex'
export default {
  components: { MensajeLogin },
    data(){
        return{
            loginModel:{
                username:'',
                password:''
            }
        }
    },

    methods:{
        ...mapActions('login',['Login']),

        loginSession(){
            this.Login(this.loginModel)
            // try
            // {
            //     await axios.post(`/login`,this.loginModel).then((response)=>{
            //         if(response.status == 200){
            //             sessionStorage.setItem('token',response.data.token)
            //             sessionStorage.setItem('user',response.data.user)
            //             sessionStorage.setItem('expire',response.data.expire_token)
            //             sessionStorage.setItem('id',response.data.id);
            //             this.$router.push('/home')
            //         }
            //     }).catch(async (error) => {
            //         console.log(error.response)
            //     });

            // }catch(e)
            // {
            //     console.log(e)
            // }
        }
    }
}
</script>

<style lang="scss">

    .container-login{
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      .form-login{
        width: 380px;
        height:auto;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-sizing: border-box;
        text-align: center;
        @media(max-width:450px){
            width: 87%;
        }
      }
    }

</style>