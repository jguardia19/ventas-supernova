<template>
    <v-row>
            <v-dialog v-model="modal_icons" max-width="800">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-space-between">
                                <h3 class="primary--text">Elegir icono</h3>  
                            <v-btn fab color="error" small @click="modal_icons =  false"><v-icon>mdi-close</v-icon> </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <div class="iconos">
                                <div class="icono" v-for="item of icons" :key="item.id" @click="asignedIcon(item)">
                                    <v-icon color="primary">{{item.icon}}</v-icon>
                                </div>
                            </div>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="modal_modulo" max-width="500">
                <v-card>
                    <v-form  ref="form"  lazy-validation> 
                    <v-card-title>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <h3 class="primary--text">{{formTitle}} </h3>
                            <v-btn icon color="error" @click="closeModal()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <v-col cols="12">
                                <v-alert type="info">
                                    La ruta no debe contener espacios ejemplo:rutaNueva
                                </v-alert>
                                        <v-text-field
                                            label="Nombre del módulo"
                                            placeholder="Modulo"
                                            outlined
                                            v-model="nombre_modulo"
                                            :rules="[rules.required]"
                                            @keypress="txNombres($event)"
                                        ></v-text-field>
                                        <v-text-field
                                            label="Ruta"
                                            placeholder="nombreRuta"
                                            outlined
                                            v-model="ruta"
                                            :rules="[rules.required]"
                                            @keypress="txNombres($event)"
                                        ></v-text-field>
                                        <div :class="{'select-icon':true , 'active-icon': activado}" @click="selectIcon()">
                                            <p v-if="icono_modulo === ''">Agregar icono</p>
                                            <v-icon v-else color="white" large class="ml-3">{{icono_modulo}} </v-icon>
                                            <v-icon>mdi-plus</v-icon>
                                        </div>
                                        <v-radio-group
                                            v-model="estatus_modulo"
                                            row
                                            >
                                            <v-radio
                                                label="Activo"
                                                :value="true"
                                                color="success"
                                            ></v-radio>
                                            <v-radio
                                                label="Inactivo"
                                                :value="false"
                                                color="error"
                                            ></v-radio>
                                        </v-radio-group>

                                        <transition
                                            enter-active-class="animate__animated animate__fadeInUp"
                                            leave-active-class="animate__animated animate__fadeOutUp"
                                            mode="out-in"
                                        >
                                            <v-alert type="error" v-if="error">{{mensaje}} </v-alert>
                                        </transition>
                                </v-col>
                            </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-col cols="12" class="text-right">
                            <v-btn text color="error" @click="closeModal" class="mr-2">CANCELAR</v-btn>
                            <v-btn class="warning" v-if="action === 'edit'" @click="updateTypeUser(id_updated)">Actualizar</v-btn>
                            <v-btn class="primary" v-if="action === 'add'" @click="submitDataModulo()">Guardar</v-btn>
                        </v-col>
                    </v-card-actions>
                    </v-form>
                </v-card>
            </v-dialog>
            <v-col cols="12">
                <v-card elevation="3" class="px-4 mt-3">
                    <v-data-table 
                    :headers="cabecera" 
                    :items="modulos" 
                    class="py-7"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    mobile-breakpoint="0"
                    >
                        <template v-slot:top>
                        <v-toolbar flat class="pb-5">
                            <v-row>
                            <v-col cols="6" class="d-flex">
                                <v-icon large color="primary">mdi-account</v-icon>
                                <h2 class="primary--text mt-2 ml-3">Modulos</h2>
                            </v-col>
                            <v-col cols="6" class="text-right">
                                <v-btn class="primary" @click="addModulo()">
                                <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                AGREGAR  MODULO NUEVO
                                </v-btn>
                            </v-col>
                            </v-row>
                        </v-toolbar>
                        </template>
                        <template v-slot:[`item.modulo`]="{ item }">
                            <v-chip label color="primary"><v-icon class="mr-2">mdi-view-module</v-icon>{{item.nombre_modulo}}  </v-chip>
                        </template>
                        <template v-slot:[`item.icon`]="{ item }">
                            <v-chip label color="deep-purple darken-2"><v-icon color="white">{{item.icono}} </v-icon></v-chip>
                        </template>

                        <template v-slot:[`item.act`]="{ item }">
                            <v-row>
                                <v-col cols="6" class="mx-auto d-flex justify-space-around" style="align-items:center">
                                    <v-chip label color="success" v-if="item.estatus_modulo">Activo</v-chip>
                                    <v-chip label color="error" v-else>Inactivo </v-chip>
                                    <v-switch
                                        inset
                                        color="success"
                                        @change="updateModuloEstatus(item)"
                                        v-model="item.estatus_modulo"
                                    ></v-switch>
                                </v-col>
                            </v-row>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="info"
                                    class="mr-2"
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                                </template>
                                <span>Ver permisos</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="warning"
                                class="mr-2"
                                icon
                                v-bind="attrs"
                                v-on="on"
                                @click="editedModulo(item)"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            </template>
                            <span>Editar registro</span>
                        </v-tooltip>
                        </template>
                    </v-data-table>
                    </v-card>
            </v-col>
        </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            modulos:[],
            modal_modulo:false,
            modal_icons:false,
            action:'',
            nombre_modulo:'',
            ruta:'',
            icono_modulo:'',
            icons:[],
            activado:false,
            estatus_modulo:true,
            error:false,
            id_updated:null,
            mensaje:'',
            cabecera:[
                {
                text: "ID",
                value: "id",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Nombre del modulo",
                value: "modulo",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Ruta",
                value: "ruta",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "icono",
                value: "icon",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Activo",
                    value: "act",
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
            rules: {
                required: value => !!value || 'Campo requerido',
                emailMatch: () => (`The email and password you entered don't match`),
            },
        }
    },

    mounted(){
        this.getAllModulos()
        this.getAllIcons()
    },

    computed:{
        //variable computada para titulo modal
        formTitle(){
            return this.action === 'add' ? 'Agregar modulo' : 'Actualizar modulo'
        }
    },

    methods:{

        //metodo que solo permite solo texto, ni numeros ni caracteres especiales
        //en campo para generar nombre de la ruta
        txNombres(event) {
            if ((event.keyCode != 32) && (event.keyCode < 65) || (event.keyCode > 90) && (event.keyCode < 97) || (event.keyCode > 122))
                event.returnValue = false;
        },

        //metodo creado para validar el nombre de la ruta
        validateRuta(){
            if(this.ruta === ''){
                return ''
            }else{
                let palabras = this.ruta.split(" ");
                for(let i=1;i<palabras.length;i++){
                    palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1);
                }
                palabras[0] = palabras[0][0].toLowerCase() + palabras[0].substr(1);
                let caracteres = palabras.toString().replaceAll(',','');

                return caracteres;  
            }
        },
        //funcion que  trae todos los modulos activos e inactivos
        async getAllModulos(){
            try
            {
                const response = await axios.get(`/adminVentas/modulos?all=all`)
                if(response.status == 200){
                    this.modulos = response.data
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        //metodo conectado a la API , de iconos ..
        async getAllIcons(){
            try{
                const response = await axios.get(`/admin/icons`);
                this.icons = response.data
            }catch(e){
                console.log(e)
            }
        },

        //metodo que setea la accion de add y apertura el modal
        addModulo(){
            this.action = 'add'
            this.modal_modulo = true
        },

        //metodo para asignar icono a las variables
        asignedIcon(item){
            this.icono_modulo = item.icon
            this.activado = true
            this.modal_icons = false
        },

        //metodo que permite abrir el modal de iconos
        selectIcon(){
            this.modal_icons = true
        },

        //funcion para agregar un nuevo modulo
        async submitDataModulo(){
            if (this.$refs.form.validate()){
                const  ruta =  this.validateRuta()
                try{
                    let data = {
                        "nombre_modulo":this.nombre_modulo,
                        "ruta": `/${ruta}`,
                        "icono_modulo":this.icono_modulo,
                        "estatus_modulo":this.estatus_modulo === true ? 1 : 0
                    }

                    const response = await axios.post(`/adminVentas/modulos`, data);
                    if(response.status == 200){
                        this.getAllModulos()
                        this.closeModal()
                    }

                }catch(e){
                    this.mensaje = e.response.data.mensaje
                    this.error = true
                    setTimeout(()=>{
                        this.error = false
                    },2000);
                    console.log(e)
                }
            }else{
                this.mensaje = 'Debes llenar todos los campos requeridos'
                this.error = true
                setTimeout(()=>{
                    this.error = false
                },2000);
                
            }
        },

        //metodo de edit para obtener los datos para editar
        editedModulo(item){
            this.id_updated = item.id
            this.nombre_modulo = item.nombre_modulo
            this.ruta = item.ruta.replaceAll('/','')
            this.activado = true
            this.icono_modulo = item.icono
            this.estatus_modulo = item.estatus_modulo
            this.action = 'edit'
            this.modal_modulo = true
        },

        //funcion para actualizar modulo
        async updateTypeUser(id){
            try{
                const  ruta =  this.validateRuta()
                let data = {
                    "nombre_modulo":this.nombre_modulo,
                    "ruta": `/${ruta}`,
                    "icono_modulo":this.icono_modulo,
                    "estatus_modulo":this.estatus_modulo === true ? 1 : 0
                }
                const response = await axios.put(`/adminVentas/modulos?id=${id}`,data)
                if(response.status == 200){
                    this.getAllModulos()
                    this.closeModal()
                }
            }catch(e)
            {
                console.log(e)
            }
        },

        //funcion para actualizar estatus de modulo
        async updateModuloEstatus(modulo){
            try{
                let data = {
                        "nombre_modulo":modulo.nombre_modulo,
                        "ruta": modulo.ruta,
                        "icono_modulo":modulo.icono,
                        "estatus_modulo":modulo.estatus_modulo === true ? 1 : 0
                    }
                const id = modulo.id
                const response = await axios.put(`/adminVentas/modulos?id=${id}`,data)
                if(response.status == 200){
                    alert(response.data.mensaje)
                    this.getAllModulos()
                }
            }catch(e){
                console.log(e)
            }
        },

        //metodo para cerrar el modulo
        closeModal(){
            this.modal_modulo = false
            this.nombre_modulo = ''
            this.ruta = ''
            this.icono_modulo = ''
            this.activado = false
            this.id_updated = null
        }


    }
}
</script>

<style lang="scss">
     .select-icon{
        width: 100%;
        height:55px;
        border: 1px solid rgba(0, 0, 0, 0.42);
        margin-bottom: 20px ;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        padding: 5px;
        box-sizing: border-box;
        align-items: center;
        cursor: pointer;
        &:hover{
            background-color: rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 1);
        }
        p{
            margin-top: 10px;
        }
    }
    .iconos{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .icono{
         width: 40px;
         height: 40px;
         border: 1px solid #d3d3d3;
         cursor: pointer;
         display: flex;
         justify-content: center;
         align-items: center;
         margin-right: 3px;
         margin-bottom: 3px;
         &:hover{
            background-color: rgb(49, 142, 49);
            .v-icon{
                color: #fff !important;
            }
         }
      }
    }
     .active-icon{
        background: #2057a5 !important;
    }
</style>