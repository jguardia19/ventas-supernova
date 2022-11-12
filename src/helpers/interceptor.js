import axios from 'axios'
//import router from '@/router'
import store from '@/store'

export default function setup(){
    axios.interceptors.request.use(async(config) => {
        //console.log(config)
        if(config.url === 'http://localhost/supernova-almacen-api/login'){
            const axiosNoInterceptor = axios.create()
            await axiosNoInterceptor.post(config.url,config.data).then(async(response)=>{
                console.log('auth resonse no interceptor')
                return response
            }).catch(async(error) =>{
                //console.log(error.response)
                return Promise.reject(error)
            }) ;
        }else{
            const token = sessionStorage.getItem('token');
            const expire = sessionStorage.getItem('expire');

            if(token && expire){
                console.log('entrando a interceptor')
                config.headers.Authorization = token
                // let dateActual = new Date();
                // let remainTime = (new Date(expire))
            } 
        }

        
        return config;
    }, async(error)=>{
        console.log('response error');
        console.log(error.response)
        return Promise.reject(error);
    });

    axios.interceptors.response.use(async(response) =>{
        console.log(response.data.status)
        if(response.data.status == 401){
            console.log(response.data.mensaje)
            store.commit('alert/setActiveAlert',response.data.mensaje)
            return response
        }else{
            return response
        }
        
    }, async(error) =>{
        console.log('capturando error')
        return Promise.reject(error);
        
    })
}