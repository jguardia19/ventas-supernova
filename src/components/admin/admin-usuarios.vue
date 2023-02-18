<template>
    <v-row>
        <v-dialog v-model="modal_user" max-width="500">
            <v-card>
                <v-form ref="form" lazy-validation>
                    <v-card-title>
                        <v-col cols="12" class="d-flex justify-space-between">
                            <h3 class="primary--text">{{ formTitle }} </h3>
                            <v-btn icon color="error" @click="closeModal()">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="mt-3">
                            <v-col cols="12">
                                <v-text-field label="Email usuario" placeholder="admin" :rules="[rules.required]"
                                    outlined v-model="email" suffix="@supernova.com"></v-text-field>
                                <v-autocomplete :items="tipo_users" item-text="nombre_tipo_usuario" item-value="id"
                                    outlined v-model="tipo_usuario"></v-autocomplete>
                                <v-text-field :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required]" :type="showPassword ? 'text' : 'password'"
                                    name="input-10-2" label="Contraseña" hint="minimo 8 caracteres"
                                    class="input-group--focused" v-model="password" outlined
                                    @click:append="showPassword = !showPassword" v-if="action === 'add'"></v-text-field>
                                <v-text-field :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :rules="[rules.required]" :type="showConfirmPassword ? 'text' : 'password'"
                                    name="input-10-2" label="Confirmar Contraseña" hint="minimo 8 caracteres"
                                    class="input-group--focused" v-model="passwordConfirm" outlined
                                    @click:append="showConfirmPassword = !showConfirmPassword"
                                    v-if="action === 'add'"></v-text-field>
                                <v-radio-group v-model="estado_user" row>
                                    <v-radio label="Activo" :value="true" color="success"></v-radio>
                                    <v-radio label="Inactivo" :value="false" color="error"></v-radio>
                                </v-radio-group>
                                <transition enter-active-class="animate__animated animate__fadeInUp"
                                    leave-active-class="animate__animated animate__fadeOutUp" mode="out-in">
                                    <v-alert type="error" v-if="error">{{ mensaje }}</v-alert>
                                </transition>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-col cols="12" class="text-right">
                            <v-btn text color="error" @click="closeModal" class="mr-2">CANCELAR</v-btn>
                            <v-btn class="warning" v-if="action === 'edit'"
                                @click="updateUser(id_update)">Actualizar</v-btn>
                            <v-btn class="primary" v-if="action === 'add'" @click="submitDataUser()">Guardar</v-btn>
                        </v-col>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <v-col cols="12">
            <v-card elevation="3" class="px-4 mt-3">
                <v-data-table :headers="cabecera" :items="usuarios" class="py-7" :page.sync="page"
                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                    <template v-slot:top>
                        <v-toolbar flat class="pb-5">
                            <v-row>
                                <v-col cols="6" class="d-flex">
                                    <v-icon large color="primary">mdi-account</v-icon>
                                    <h2 class="primary--text mt-2 ml-3">Usuarios</h2>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <v-btn class="primary" @click="addUser()">
                                        <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                        AGREGAR USUARIO NUEVO
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.act`]="{ item }">
                        <span v-if="item.tipo_usuario === '1'">
                            <v-chip label color="success" v-if="item.estado_user">Activo</v-chip>
                        </span>
                        <v-row v-else>
                            <v-col cols="6" class="mx-auto d-flex justify-space-around" style="align-items:center">
                                <v-chip label color="success" v-if="item.estado_user">Activo</v-chip>
                                <v-chip label color="error" v-else>Inactivo </v-chip>
                                <v-switch inset color="success" v-model="item.estado_user"
                                    @change="updateUserEstatus(item)"></v-switch>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <!-- <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="info" class="mr-2" icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-eye</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver permisos</span>
                        </v-tooltip> -->
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="warning" class="mr-2" icon v-bind="attrs" v-on="on"
                                    @click="editedUser(item)"
                                    :disabled="item.tipo_usuario === '1'"
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
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 50,
            usuarios: [],
            tipo_users: [],
            modal_user: false,
            action: 'add',
            error: false,
            mensaje: '',
            email: '',
            password: '',
            tipo_usuario: null,
            passwordConfirm: '',
            estado_user: true,
            showPassword: false,
            showConfirmPassword: false,
            id_update: null,
            cabecera: [
                {
                    text: "ID",
                    value: "id",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Nombre usuario",
                    value: "email_user",
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
            rules: {
                required: value => !!value || 'Campo requerido',
                emailMatch: () => (`The email and password you entered don't match`),
            },
        }
    },

    mounted() {
        this.getAllUsers()
        this.getAllTipoUsuarios()

    },

    computed: {
        //variable computada para el titulo del modal
        formTitle() {
            return this.action === 'add' ? 'Agregar usuario' : 'Actualizar usuario'
        }
    },

    methods: {
        //funcion para traer todos los usuarios
        async getAllUsers() {
            try {
                const response = await axios.get(`/adminVentas/usuarios`)
                if (response.status == 200) {
                    this.usuarios = response.data
                }
            } catch (e) {
                console.log(e)
            }
        },

        //metodo para traer tipos de usuarios activos
        async getAllTipoUsuarios() {
            try {
                const response = await axios.get(`/adminVentas/tipoUsuarios?activos=activos`)
                if (response.status == 200) {
                    this.tipo_users = response.data
                }
            } catch (e) {
                console.log(e)
            }
        },

        //metodo para agregar usuario
        addUser() {
            this.action = 'add'
            this.modal_user = true
        },

        //funcion para guardar datos de un nuevo usuario
        async submitDataUser() {
            if (this.$refs.form.validate()) {
                if (this.password === this.passwordConfirm) {
                    let data = {
                        "email_user": `${this.email}@supernova.com`,
                        "pass_user": this.password,
                        "tipo_usuario": this.tipo_usuario,
                        "estado_user": this.estado_user === true ? 1 : 0
                    }

                    const response = await axios.post(`/adminVentas/usuarios`, data);
                    if (response.status == 200) {
                        this.getAllUsers()
                        this.closeModal()
                    }
                } else {
                    this.mensaje = 'Ambas contraseñas deben coincidir'
                    this.error = true
                    this.showPassword = true
                    this.showConfirmPassword = true
                    setTimeout(() => {
                        this.error = false
                    }, 2000);
                }
            } else {
                this.mensaje = 'Debes llenar todos los campos requeridos'
                this.error = true
                setTimeout(() => {
                    this.error = false
                }, 2000);

            }
        },

        //metodo para sincronizar informacion pára editar
        editedUser(item) {
            this.action = 'edit'
            this.id_update = item.id
            let usuario = item.email_user.replace('@supernova.com', '')
            this.email = usuario
            this.tipo_usuario = item.tipo_usuario
            this.estado_user = item.estado_user
            this.modal_user = true
        },

        //funcion para actualizar datos de  un usuario
        async updateUser(id) {
            try {
                let data = {
                    "email_user": `${this.email}@supernova.com`,
                    "tipo_usuario": this.tipo_usuario,
                    "estado_user": this.estado_user === true ? 1 : 0
                }
                const response = await axios.put(`/adminVentas/usuarios?id=${id}`, data)
                if (response.status == 200) {
                    alert(response.data.mensaje)
                    this.getAllUsers()
                    this.closeModal()
                }
            } catch (e) {
                console.log(e)
            }
        },
    
        //funcion para actualizar estatus de un usuario
        async updateUserEstatus(user) {
            try {
                let data = {
                    "email_user": user.email_user,
                    "tipo_usuario": user.tipo_usuario,
                    "estado_user": user.estado_user === true ? 1 : 0
                }
                const id = user.id
                const response = await axios.put(`/adminVentas/usuarios?id=${id}`, data)
                if (response.status == 200) {
                    alert(response.data.mensaje)
                    this.getAllUsers()
                }
            } catch (e) {
                console.log(e)
            }
        },

        //metodo para cerrar modal de crear usuario e inicializar los datos
        closeModal() {
            this.modal_user = false
            this.email = ''
            this.password = ''
            this.tipo_usaurio = null
            this.passwordConfirm = ''
            this.estado_user = true
            this.showPassword = false
            this.showConfirmPassword = false
        }


    }
}
</script>

<style>

</style>