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
                >
                </v-divider>
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
                        class="caption my-text"
                        color="#1A5276"  
                        placeholder="Buscar"
                        append-icon="mdi-magnify"
                    >
                    </v-text-field>
                </v-col>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card class="elevation-0">
                <v-card-text>
                    <v-data-table
                        no-data-text="No hay datos disponibles"
                        :footer-props="{itemsPerPageText:'Artículos por páginas'}"
                        :items-per-page="5"
                        :items="desserts"
                        :headers="campos"
                        :loading="cargando"
                        :search="search"
                        class="elevation-0"
                         no-results-text="No hay datos disponibles"
                        loading-text="Cargando datos por favor espere..."
                    >
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-btn
                                dark
                                text
                                color="green"
                                @click="verDetalle(item)"
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
import { mapState } from 'vuex';
import API from '@/api'
export default {
    data() {
        return {
            titulo:-1, 
            search:'',
            cargando:false,
            overlay:false,
            opacity:0,
            campos:
            [
                {text:'Código', value:'codigo', class: "white--text grey darken-3"},
                {text:'Categoría', value:'categoria', class: "white--text grey darken-3", filterable:false},
                {text:'Referencia', value:'referencia', class: "white--text grey darken-3",filterable:false},
                {text:'Marca', value:'marca', class: "white--text grey darken-3",filterable:false},
                {text:'Impresora', value:'modelo', class: "white--text grey darken-3",filterable:false},
                {text:'Color', value:'color', class: "white--text grey darken-3",filterable:false},
                {text:'Cantidad entrada', value:'cantidad_entrada', class: "white--text grey darken-3",filterable:false},
                {text: 'Ver Detalle', value: 'actions', sortable: false, class: "white--text grey darken-3" },
            ],
            desserts:[],
        }
    },

    computed: {
        ...mapState(['loginDatos']),
         tituloTabla(){
            return this.titulo === -1 ? 'ENTRADAS POR ARTÍCULOS' : ''
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
        const respuesta = await API.get('articulos_entradas')
        this.desserts = respuesta.data.data
        this.cargando = false
        return
    },

    verDetalle(item){
       if (item.id_articulo) {
        this.overlay = true
        setTimeout(()=>{
            this.overlay = false
            localStorage.setItem('id_articulo', item.id_articulo)
            this.$router.push({path:'/detalle_de_articulo_x_entrada'})
        },1500)
       }
            
    }

   },
}
</script>
<style>
#titulo{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

#fondo{
    background: #f2f3f4;
}

.my-text input{
    text-transform: uppercase;
}

</style>