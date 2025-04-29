<template>
    <v-app id="fondo">
        <v-container>
            <v-toolbar flat>
                <v-toolbar-title id="titulo">
                    {{ tituloTabla }}
                </v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-col
                    cols="12"
                    sm="6"
                >
                    <v-text-field
                        v-model="search"
                        label="Buscar"
                        single-line
                        dense
                        hide-details
                        clearable
                        class="caption"
                        color="#1A5276"  
                        placeholder="Buscar"
                        append-icon="mdi-magnify"
                    >
                    </v-text-field>
                </v-col>
              
            </v-toolbar>
            <v-divider></v-divider>
            <v-card class="elevation-1">
                <v-card-text>
                    <v-data-table
                        no-data-text="No hay datos disponibles"
                        :footer-props="{itemsPerPageText:'Solicitudes por páginas'}"
                        :items-per-page="5"
                        :items="desserts"
                        :headers="campos"
                        :loading="cargando"
                        :search="search"
                         no-results-text="No hay datos disponibles"
                        loading-text="Cargando datos por favor espere..."
                    >
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            dark
                            text
                            color="green"
                            @click="verSolicitud(item)"
                        >
                        <v-icon>visibility</v-icon>
                        </v-btn>
                    </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
            <v-overlay
            :value="overlay"
            :opacity="opacity"
            >
            <v-progress-circular
                indeterminate
                size="180"
                width="15"
                color="#170d73"
            >
            </v-progress-circular>
            </v-overlay>
        </v-container>

    </v-app>
</template>
<script>
import API from '@/api'
import { mapState } from 'vuex';
export default {
    data() {
        return {
            titulo:-1,
            desserts:[],
            cargando:false,
            search:'',
            overlay:false,
            opacity:0,
            campos:
            [
                {text:'Tipo de Solicitud', value:'tipo_solicitud', class: "white--text grey darken-3"},
                {text:'Despacho', value:'despacho', class: "white--text grey darken-3"},
                {text:'Fecha de Entrada', value:'fecha_entrada', class: "white--text grey darken-3"},
                {text:'Fecha de Salida', value:'fecha_salida', class: "white--text grey darken-3"},
                {text:'Incidencia', value:'incidencia', class: "white--text grey darken-3"},
                {text:'Cnt. Solicitada', value:'cantidad_solicitada', class: "white--text grey darken-3"},
                {text: 'Ver Solicitud', value: 'actions', sortable: false, class: "white--text grey darken-3" },
               
            ]
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloTabla(){
            return this.titulo === -1 ? 'Solicitudes Pendientes' : ''
        },

    },

   mounted() {
    this.informacion()
   },

    methods: {
        informacion(){
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                this.$router.push({path:'/'})
            }

            this.loginDatos.usuario = usuario
            this.mostrarSolicitudes()
        },

       async mostrarSolicitudes(){
        this.cargando = true
        const respuesta = await API.get('solicitudes')
        this.desserts = respuesta.data.data
        this.cargando = false
        return
        },

        verSolicitud(item){
            if (item.tipo_solicitud == 'ENTRADA') {
                this.overlay = true
                setTimeout(()=>{
                    this.overlay = false
                    this.$router.push({path:'/editar-solicitud-entrada'})
                },1500)
            }
            
        }
    },
}
</script>
<style scoped>
#fondo{
    background: #f2f3f4;
}

#titulo{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>