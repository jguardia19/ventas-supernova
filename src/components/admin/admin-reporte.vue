<template>
    <v-container class="mt-3">
        <v-row>
            <v-col cols="12">
                <v-card class="px-3 py-3">
                    <v-alert type="info">
                        Seleccione producto por codigo y rango de fechas
                    </v-alert>
                    <v-row>
                        <v-col cols="3">
                            <v-autocomplete label="Selecciona el producto" :items="productos" item-text="fullname"
                                item-value="codigo" outlined v-model="producto" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field label="Fecha inicio" :max="fechaMax" v-model="datos.fecha_inicio" outlined
                                type="date"></v-text-field>
                        </v-col>
                        <v-col cols="3" v-if="datos.fecha_inicio">
                            <v-text-field label="Fecha fin" outlined type="date" v-model="datos.fecha_fin"
                                :min="datos.fecha_inicio"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" class="mt-3" @click="searchInforme()">Buscar</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4">
                            <v-card class="px-5 py-5" v-if="cantidad_pedida">
                                <v-chip label color="primary" class="mb-2">
                                    Codigo: {{ producto.codigo }}
                                </v-chip> <br>
                                <p color="primary--text" style="margin-bottom:0px">{{ producto.nombre }} </p>
                                <p>Cantidad de pz vendidas en esa fecha: <v-chip color="success">{{ cantidad_pedida }}
                                    </v-chip> </p>
                                <v-card-actions>
                                    <v-row>
                                        <v-col cols="12" class="text-right">
                                            <v-btn class="primary"> <v-icon class="mr-1">mdi-plus</v-icon> Agregar a
                                                Pedido</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-actions>
                            </v-card>

                            <v-alert type="error" outlined v-if="noResults">
                                No se vendio ese producto en estas fechas
                            </v-alert>
                        </v-col>
                        <v-col cols="8">
                            <v-card class="px-5 py-3" elevation="0">
                                <v-card-title>
                                    <v-icon class="mr-2" color="primary" large>mdi-file-multiple</v-icon>
                                    Pedido
                                    <v-spacer></v-spacer>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-data-table :headers="header" :items="pedido" :search="search" :page.sync="page"
                                    :items-per-page="itemsPerPage" mobile-breakpoint="0">
                                    <template v-slot:[`item.number`]="{ index }">
                                        <span>{{ index + 1 }} </span>
                                    </template>

                                </v-data-table>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            page: 1,
            pageCount: 0,
            itemsPerPage: 100,
            search: "",
            pedido: [],
            productos: [],
            producto: {},
            datos: {
                codigo: '',
                fecha_inicio: '',
                fecha_fin: ''
            },
            cantidad_pedida: null,
            noResults: false,
            header: [
            {
            text: "código",
            value: "Codigo",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
            {
            text: "imagen",
            value: "image",
            align: "center",
            class: "primary white--text px-0 mx-0",
            },
            {
            text: "Nombre del poducto",
            value: "Orden",
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
    mounted() {
        this.getAllProductos()
    },

    computed: {
        //variable computada para restringir busqueda en calendario
        fechaMax() {
            const d = new Date()
            let day = d.getDate()
            let month = d.getMonth()
            let year = d.getFullYear()

            month += 1;

            day = ('0' + day).slice(-2);
            month = ('0' + month).slice(-2);

            return `${year}-${month}-${day}`
        },
    },
    methods: {
        async getAllProductos() {
            try {
                const response = await axios.get(`/productos/productos`);
                if (response.status == 200) {
                    this.productos = response.data
                }
            } catch (e) {
                console.log(e)
            }
        },

        async searchInforme() {
            this.noResults = false
            this.datos.codigo = this.producto.codigo
            try {
                const response = await axios.post(`/admin/reporte`, this.datos)
                if (response.status == 200) {
                    this.noResults = response.data.cantidad_pedida === null ? true : false
                    this.cantidad_pedida = response.data.cantidad_pedida
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style></style>