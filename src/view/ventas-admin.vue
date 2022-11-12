<template>
    <v-container class="mt-3 contenedor">
        <v-row>
            <v-col cols="12">
                <v-card elevation="3" class="px-4 mt-3">
                    <v-data-table :headers="cabecera" :items="tiposUsuario" class="py-7">
                        <template v-slot:top>
                        <v-toolbar flat class="pb-5">
                            <v-row>
                            <v-col cols="6" class="d-flex">
                                <v-icon large color="primary">mdi-account-switch</v-icon>
                                <h2 class="primary--text mt-2 ml-3">Tipo de usuarios</h2>
                            </v-col>
                            <v-col cols="6" class="text-right">
                                <v-btn class="primary" @click="addTypeUser()">
                                <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                AGREGAR TIPO DE USUARIO
                                </v-btn>
                            </v-col>
                            </v-row>
                        </v-toolbar>
                        </template>
                        <template v-slot:[`item.act`]="{ item }">
                            <v-row>
                                <v-col cols="6" class="mx-auto d-flex justify-space-around" style="align-items:center">
                                    <v-chip label color="success" v-if="item.estatus_tipo">Activo</v-chip>
                                    <v-chip label color="error" v-else>Inactivo </v-chip>
                                    <v-switch
                                        inset
                                        color="success"
                                        v-model="item.estatus_tipo"
                                        @change="updateTypeUser(item)"   
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
                                    @click="viewModulesTypeUser(item)"
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
                                @click="editType(item)"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            </template>
                            <span>Editar registro</span>
                        </v-tooltip>
                            <v-tooltip bottom >
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    class="mr-2"
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    :disabled="!item.estatus_tipo"
                                    @click="configPermisosUsuario(item)"
                                >
                                    <v-icon>mdi-account-settings</v-icon>
                                </v-btn>
                                </template>
                                <span>Configurar permisos</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                    </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="modal_tipo" max-width="500">
            <v-card>
                <v-card-title>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <h3 class="primary--text">{{titleFormType}}</h3>  
                        <v-btn fab color="error" small @click="closeModalType()"><v-icon>mdi-close</v-icon> </v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                <v-row class="mt-3">
                    <v-col cols="12">
                        <v-text-field type="text" label="Nombre del tipo de usuario" v-model="tipo.nombre_tipo_usuario" outlined></v-text-field>
                        <v-radio-group row v-model="tipo.estatus_tipo" >
                            <v-radio :value="true"  color="success" label="Activo"></v-radio>
                            <v-radio :value="false" color="error"  label="Inactivo"></v-radio>
                        </v-radio-group>
                    </v-col>
                </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-col cols="12" class="text-right">
                        <v-btn text class="mr-2" color="error" @click="closeModalType()">CANCELAR</v-btn>
                        <v-btn class="primary" v-if="action == 1" @click="createTypeUser()">Guardar</v-btn>
                        <v-btn class="warning" v-else @click="updateTypeUser(tipo)">Actualizar</v-btn>
                    </v-col>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modal_permisos" max-width="50%">
                <v-card>
                    <v-card-title>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-space-between">
                                <h3 class="primary--text">{{titlePermisos}} </h3>  
                            <v-btn fab color="error" small @click="closeModalPermisos()"><v-icon>mdi-close</v-icon> </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <v-col cols="12">
                                <v-simple-table v-if="modulos.length > 0">
                                    <template v-slot:default>
                                    <thead class="primary">
                                        <tr>
                                            <th class="text-center white--text">
                                                Nombre Modulo
                                            </th>
                                            <th class="text-center white--text">
                                                Ruta
                                            </th>
                                            <th class="text-center white--text">
                                                Icono
                                            </th>
                                            <th class="text-center white--text">
                                                Permisos de vista
                                            </th>
                                            <th class="text-center white--text">
                                                Permisos de Edicion 
                                            </th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>     
                                        <tr
                                        v-for="item in modulos"
                                        :key="item.id"
                                        >
                                            <td class="text-center">{{ item.nombre_modulo }}</td>
                                            <td class="text-center">{{ item.ruta }}</td>
                                            <td class="text-center">
                                                <v-icon color="primary">{{item.icono}} </v-icon>
                                            </td>
                                            <td class="text-center" v-if="actionPermisos == 1">
                                                <v-col cols="6" class="mx-auto">
                                                    <v-switch
                                                        inset
                                                        color="success"
                                                        v-model="item.addView"
                                                        @change="addViewActionModule(item)"   
                                                    ></v-switch>  
                                                </v-col>
                                            </td>
                                            <td class="text-center" v-if="actionPermisos == 1">
                                                <v-col cols="6" class="mx-auto">
                                                    <v-switch
                                                        inset
                                                        color="success"
                                                        v-model="item.addEdit"
                                                        @change="addEditActionModule(item)"   
                                                    ></v-switch>  
                                                </v-col>
                                            </td>
                                            <td class="text-center" v-if="actionPermisos == 2">
                                                <v-icon color="success" v-if="item.view">mdi-check-bold</v-icon>
                                                <v-icon color="error" v-else>mdi-close</v-icon>    
                                            </td>
                                            <td class="text-center" v-if="actionPermisos == 2">
                                                <v-icon color="success" v-if="item.edit">mdi-check-bold</v-icon>
                                                <v-icon color="error" v-else>mdi-close</v-icon>      
                                            </td>
                                        </tr>
                                    </tbody>
                                    </template>
                                </v-simple-table>
                                <v-alert type="warning" v-else>
                                    <h3>Aun no hay permisos asignados para este usuario</h3>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-col cols="12" class="text-right">
                            <v-btn class="primary" @click="submitDataPermisos()" v-if="actionPermisos == 1">Guardar</v-btn>
                        </v-col>
                    </v-card-actions>
                </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            tiposUsuario:[],
            modulos:[],
            modal_tipo:false,
            modal_permisos:false,
            action:1,
            actionPermisos:1,
            name_type:'',
            tipo:{
                id:null,
                nombre_tipo_usuario:'',
                estatus_tipo:true
            },

            data:{
                permisos:[], 
            },
            agregar:false,
            idTipo:null,

            cabecera:[
                {
                text: "ID",
                value: "id",
                align: "center",
                class: "primary white--text px-0 mx-0",
                },
                {
                text: "Tipo usuario",
                value: "nombre_tipo_usuario",
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
        }
    },

    mounted(){
        this.getAllTypeUsers()
        this.getAllModules()
    },

    computed:{

        //variable computada para titulo de modal para crear tipo de usuario
        titleFormType(){
            return this.action == 1 ? 'Crear tipo de usuario' : 'Editar tipo de usuario'
        },

        //variable computada para titulo de modal de permisos
        titlePermisos(){
            return this.actionPermisos == 1 ? 'Gestionar permisos' : `Permisos asignado a: ${this.name_type}`
        }
    },

    methods:{

        // funcion para cargar los modulos registrados en la BD
        async getAllModules(){
            try{
                const response = await axios.get(`/adminVentas/modulos`);
                this.modulos = response.data
            }catch(e){
                console.log(e)
            }
        },

        //funcion para traer todos los tipos de usuarios activos e inactivos
        async getAllTypeUsers(){
            try{
                const response = await axios.get(`/adminVentas/tipoUsuarios`);
                this.tiposUsuario = response.data
            }catch(e){
                console.log(e)
            }
        },

        //metodo para definir accion de crear o editar tipo de usuario
        addTypeUser(){
            this.action = 1
            this.tipo.id = null,this.tipo.nombre_tipo_usuario = '', this.estatus_tipo = ''
            this.modal_tipo = true
        },

           //funcion para crear un tipo de usuario nuevo
        async createTypeUser(){
            try{
                let data = {"nombre_tipo_usuario":this.tipo.nombre_tipo_usuario,"estatus":this.tipo.estatus_tipo === true ? "1" : "0"}
                const response = await axios.post(`/adminVentas/tipoUsuarios`,data);
                if(response.status == 200){
                    this.getAllTypeUsers()
                    this.modal_tipo = false
                    this.tipo.nombre_tipo_usuario = '',this.tipo.estatus_tipo = true
                }
            }catch(e){
                console.log(e)
            }
        },

        //funcion para cargar modal de edicion de tipo
        editType(item){
            this.action = 2
            this.tipo.id = item.id  
            this.tipo.nombre_tipo_usuario = item.nombre_tipo_usuario
            this.tipo.estatus_tipo = item.estatus_tipo
            this.modal_tipo = true
        },

        //metodo para consultar los permisos del tipo de usuario
        async configPermisosUsuario(item){

            try{
                //consultamos los permisos segun el tipo de usuario
                const response = await axios.get(`/adminVentas/permisosBodega?id=${item.id}`);
                if(response.status == 200){
                    let modules = response.data;
                    //si el tipo de usuario ya posee algun registro de permisos
                    if(response.data.length > 0){
                        //actualizamos el reegustro de los modulos en vacio
                        //por si se realizo alguna accion anterior y se modifico el array de modulos
                        await this.getAllModules()
                        // se inicia un ciclo para recorrer segun la cantidad de modulos asignados al 
                        // tipo de usuario en base a la cantidad de modulos
                        for(let i=0;i<modules.length;i++){
                             for(let j=0;j<this.modulos.length;j++){
                                // se compara si el modulo registrado existe en los modulos
                                // y se cambia la data segun el registro del tipo de usuarioi
                                if(modules[i].id_modulo == this.modulos[j].id){
                                    this.modulos[j].addView = modules[i].addView;
                                    this.modulos[j].addEdit = modules[i].addEdit;
                                }
                             }
                        }
                    }else{
                        //sino existe registro abrimos los modulos tal cual 
                        this.getAllModules()
                    }
                }
             }catch(e){
                console.log(e)
             }
             //despues del proceso asignamos id al idTipo para registrar y aperturamos modal
            this.actionPermisos = 1
            this.idTipo = item.id
            this.modal_permisos = true
        },

        //funcion para asignar un registro a los permisos de vista
        addViewActionModule(item){
            //se filtra si el registro de este modulo ya se hizo localmente en permisos
            const filtro = this.data.permisos.filter(modulo => modulo.id_modulo === item.id);

            // si es asi se modifica el campo de habilitacion de vista
            if(filtro.length > 0){
                const mapeo =  this.data.permisos.map((ite)=>{
                    ite.addView = item.addView === true ? "1" : "0"
                    return ite;
                });
                this.data.permisos = mapeo;
            }else{
                //caso contrario se hace un llamado a la funcion que realiza push personalizado
                item.id_tipo = this.idTipo
                this.asignarPermisos(item);
            }
        },
         //funcion para asignar un registro a los permisos de edicion
        addEditActionModule(item){
            //se filtra si el registro de este modulo ya se hizo localmente en permisos
            const filtro = this.data.permisos.filter(modulo => modulo.id_modulo === item.id);

            // si es asi se modifica el campo de habilitacion de edicion
            if(filtro.length > 0){
                const mapeo =  this.data.permisos.map((ite)=>{
                    ite.addEdit = item.addEdit === true ? "1" : "0"
                    return ite;
                });
                this.data.permisos = mapeo;
            }else{
                //caso contrario se hace un llamado a la funcion que realiza push personalizado
                item.id_tipo = this.idTipo
                this.asignarPermisos(item);
            }
        },

        //funcion que realiza un push personalizado a permisos
        asignarPermisos(data){
            let datos = {"id_tipo":data.id_tipo,"id_modulo":data.id,"addView":data.addView === true ? "1" : "0","addEdit":data.addEdit === true ? "1" : "0"}
            this.data.permisos.push(datos);
        },

        //metodo para enviar data a registrar en tabla de permisos por tipo de usuario
        async submitDataPermisos(){
            try{
                const response = await axios.post(`/adminVentas/permisosBodega`,this.data);
                console.log(response.data);
                if(response.status == 200){ 
                    this.modal_permisos = false
                    this.data.permisos = []
                }
            }catch(e){
                console.log(e)
            }
        },
        
        //funcion para actualizar datos de tipo de usuario
        async updateTypeUser(item){
            try{
                let data = {"nombre_tipo_usuario":item.nombre_tipo_usuario,"estatus":item.estatus_tipo === true ? "1" : "0"}
                const response = await axios.put(`/adminVentas/tipoUsuarios?id=${item.id}`,data);
                if(response.status == 200){
                    this.getAllTypeUsers()
                    this.modal_tipo = false
                    this.tipo.nombre_tipo_usuario = '',this.tipo.estatus_tipo = true
                }
            }catch(e){
                console.log(e);
            }
        },

        //metodo para ver los modulos asignados al tipo de usuario
        async viewModulesTypeUser(item){
            this.name_type = item.nombre_tipo_usuario
            try{
                const response = await axios.get(`/adminVentas/permisosBodega?type=${item.id}`);
                this.modulos = response.data
                this.actionPermisos = 2                
                this.modal_permisos = true
            }catch(e){
                console.log(e)
            }
        },



        //cerrar modal tipo usuario
        closeModalType(){
            this.tipo.id = null,this.tipo.nombre_tipo_usuario = '', this.estatus_tipo = ''
            this.modal_tipo = false
        },
        
        //cerrar modal de permisos
        closeModalPermisos(){
            this.getAllModules()
            this.modal_permisos = false
        }
    }
}
</script>

<style>

</style>