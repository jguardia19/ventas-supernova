<template>
    <v-row class="mt-3 pb-5">
        <v-col cols="12">
            <div class="container-information">
                <div class="data-personal-usuario">
                    <h2 class="primary--text">DATOS PERSONALES DEL CLIENTE</h2>
                    <div class="data-user">
                        <div class="datos">
                            <v-avatar color="#00796B" class="white--text mt-5 mb-3">{{ avatarInicial }} </v-avatar>
                            <h3 v-if="cliente.sin_procesar.nombre">{{ cliente.sin_procesar.nombre }} </h3>
                            <h3>{{ cliente.sin_procesar.apellido }} </h3>
                            <p class="mt-2"><v-icon color="#F57F17">mdi-email</v-icon>{{ cliente.sin_procesar.correo }} </p>
                            <p><v-icon color="#00ACC1">mdi-phone</v-icon>{{ cliente.sin_procesar.telefono }} </p>
                            <div class="pedidos">
                                <v-chip label color="primary" class="white--text">Total Pedidos : {{ cliente.ordenes.length }}  </v-chip> <br>
                                <v-chip label color="#00C853" class="white--text mt-2">Procesados: {{ cliente.ordenes.length - cliente.sin_procesar.total_pedidos_sin_procesar }}  </v-chip>
                                <v-chip label color="#C62828" class="white--text mt-2 ml-2">Sin procesar: {{ cliente.sin_procesar.total_pedidos_sin_procesar }}  </v-chip>
                            </div>
                        </div>
                        <hr>
                        <div class="data-information">
                            <v-row>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-map-marker</v-icon><b>Direccion :</b> <br>
                                        {{ cliente.sin_procesar.direccion }}</p>
                                </v-col>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-home-city</v-icon><b>Ciudad :</b> <br> {{ cliente.sin_procesar.ciudad }}
                                    </p>
                                </v-col>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-home-city</v-icon><b>Estado :</b> <br> {{ cliente.sin_procesar.estado }}
                                    </p>
                                </v-col>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-home-group</v-icon><b>Colonia :</b> <br> {{ cliente.sin_procesar.colonia }}
                                    </p>
                                </v-col>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-card-account-mail</v-icon><b>Codigo Postal :</b> <br>
                                        {{ cliente.sin_procesar.codigop }} </p>
                                </v-col>
                                <v-col cols="6" class="information-item">
                                    <p><v-icon>mdi-badge-account-horizontal-outline</v-icon><b>RFC:</b> <br>
                                        {{ cliente.sin_procesar.rfc }} </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="8" class="mx-auto">
                                    <v-row>
                                        <v-col cols="6" class="text-center">
                                            <p class="primary--text">Procesados:</p>
                                            <v-progress-circular
                                                :rotate="0"
                                                :size="100"
                                                :width="15"
                                                v-model="porcentajeProcesados"
                                                color="#00C853"
                                                >
                                                {{ porcentajeProcesados }} %
                                            </v-progress-circular>
                                        </v-col>
                                        <v-col cols="6" class="text-center">
                                            <p class="primary--text">Sin procesar:</p>
                                            <v-progress-circular
                                                :rotate="0"
                                                :size="100"
                                                :width="15"
                                                v-model="porcentajeSinProcesar"
                                                color="#C62828"
                                                >
                                                {{ porcentajeSinProcesar }} %
                                            </v-progress-circular>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </div>

                <div class="data-productos">
                    <h3>Productos con mas demandas:</h3>
                    <div class="container-productos">
                        <div class="item-producto" v-for="(product, index) of cliente.productos_clientes" :key="index">
                            <v-row>
                                <v-col cols="2" class="text-center">
                                    <v-icon color="success">mdi-tag</v-icon>
                                </v-col>
                                <v-col cols="4">
                                    <v-chip color="warning">Codigo:{{ product.codigo }} </v-chip>
                                </v-col>
                                <v-col cols="2" class="text-center">
                                    <span>{{ product.cantidad }} pz</span>
                                </v-col>
                                <v-col cols="4">
                                    <v-chip label outlined color="primary">
                                        Orden: {{ product.orden }}
                                    </v-chip>

                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-pedidos">
                <v-row>
                    <v-col cols="9">
                        <h2 class="primary--text mt-1 mb-0 ml-3"><v-icon large color="primary">mdi-clipboard</v-icon>Folios</h2>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field outlined label="Buscar Folio por número de orden" append-icon="mdi-magnify" v-model="search" > </v-text-field>
                    </v-col>
                </v-row>
                
                <v-data-table :headers="cabecera" :items="cliente.ordenes" class="py-7" :search="search" :page.sync="page"
                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                    <!-- <template v-slot:[`item.folio`]="{ item }">
                        <span v-if="item.procesado">{{ item.orden }}</span>
                        <span class="error--text" v-else><v-icon color="error">mdi-alert</v-icon> {{ item.orden }} </span>
                    </template> -->
                    <template v-slot:[`item.client`]="{ item }">
                        <span
                            :class="{ 'primary--text': item.procesado, 'error--text': !item.procesado }">{{ item.nombres }}</span>
                        <v-chip class="ml-2" outlined color="error" v-if="!item.procesado"> No procesado </v-chip>
                    </template>
                    <template v-slot:[`item.package`]="{ item }">
                        <v-chip color="primary" outlined label v-if="item.procesado"><v-icon>mdi-truck</v-icon>
                            {{ item.paqueteria }}</v-chip>
                        <v-chip outlined color="error" label v-else><v-icon>mdi-truck-remove</v-icon> {{ item.paqueteria }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.cant`]="{ item }">
                        <v-chip color="warning">
                            {{ item.cantidad }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.Total`]="{ item }">
                        <v-chip color="success" label>
                            {{ item.total }}
                        </v-chip>
                    </template>

                </v-data-table>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            cliente: [],
            page: 1,
            pageCount: 0,
            itemsPerPage: 10,
            valor:50,
            search:'',
            cabecera: [
                {
                    text: "Orden",
                    value: "orden",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Cliente",
                    value: "client",
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
                    text: "Cantidad de productos(pz)",
                    value: "cant",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Total($)",
                    value: "Total",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Fecha emitido",
                    value: "fecha",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                },
                {
                    text: "Fecha procesado",
                    value: "fecha_procesado",
                    align: "center",
                    class: "primary white--text px-0 mx-0",
                }
            ],
        }
    },

    mounted() {
        this.viewClient(this.$route.params.id)
    },
    computed:{
        avatarInicial(){
            let avatar = '';
            if(this.cliente.sin_procesar){
                avatar = `${this.cliente.sin_procesar.nombre[0]}${this.cliente.sin_procesar.apellido[0]}`;
            }
            return avatar;
        },
        porcentajeProcesados(){
            let procesados = this.cliente.ordenes.length - this.cliente.sin_procesar.total_pedidos_sin_procesar;
            let total = (procesados * 100 / this.cliente.ordenes.length).toFixed(2)
            return total;
        },

        porcentajeSinProcesar(){
            let porcentaje = (this.cliente.sin_procesar.total_pedidos_sin_procesar * 100 / this.cliente.ordenes.length).toFixed(2)
            return porcentaje;
        }
    },

    methods: {
        async viewClient(id) {
            try {
                let data = { "id_usuario": id }
                const response = await axios.post(`/admin/clientes`, data)
                if (response.status == 200) {
                    this.cliente = response.data
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss">
.container-information {
    width: 80%;
    margin: auto;
    height: 500px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    @media(max-width:1500px){
        width: 90%;
    }
    @media(max-width:1300px){
        width: 100%;
    }


    .data-personal-usuario {
        width: 60%;
        background-color: #fff;
        border-radius: 8px;
        height: 500px;
        padding: 20px;
        box-sizing: border-box;
        h2{
            margin-bottom: 5px;
        }
        .data-user {
            width: 100%;
            height: 370px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .datos {
                width: 30%;
                height: 350px;
                text-align: center;

                .v-avatar {
                    width: 80px !important;
                    height: 80px !important;
                    font-size: 20px;
                }
            }

            hr {
                width: 2px;
                height: 320px;
                transform: rotate(0.5turn);
                background-color: #dbd7d7;
                border: none;
            }

            .data-information {
                width: 60%;
                height: 350px;
                padding: 15px;
                box-sizing: border-box;

                .information-item {
                    p {
                        line-height: 15px;
                        font-size: 18px;

                        .v-icon {
                            color: #2057a5;
                            margin-right: 5px;
                        }

                        b {
                            color: #2057a5;
                        }
                    }
                }
            }
        }
    }

    .data-productos {
        width: 38%;
        background-color: #fff;
        border-radius: 8px;
        height: 500px;
        padding: 15px;
        box-sizing: border-box;

        .container-productos {
            width: 100%;
            height: 400px;
            margin-top: 10px;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 10px;
            box-sizing: border-box;
            &::-webkit-scrollbar {
                display: none;
            }
            .item-producto {
                width: 100%;
                height: 55px;
                background-color: #fff;
                box-shadow: 0px 1px 12px 2px #b7b3b3;
                margin-top: 15px;
                margin-bottom: 30px;
                border-radius: 5px;
            }
        }

    }
}

.container-pedidos {
    width: 80%;
    height: auto;
    background-color: #fff;
    border-radius: 15px;
    margin: 20px auto;
    padding: 15px;
    @media(max-width:1500px){
        width: 90%;
    }
    .v-application .py-7 {
        padding-top: 5px !important;
        padding-bottom: 28px !important;
    }
}</style>