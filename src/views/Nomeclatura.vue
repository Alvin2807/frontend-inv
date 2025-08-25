<template>
    <v-app id="fondo">
        <v-container>
            <v-btn
                color="cyan darken-1"
                class="white--text elevation-0"
                large
                @click="abirModalCrear()"
            >
            <v-icon>create</v-icon>
            crear
            </v-btn>
            <v-toolbar flat>
                <v-toolbar-title id="titulo">{{ tituloTabla }}</v-toolbar-title>
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
            <v-data-table
                no-data-text="No hay datos disponibles"
                :footer-props="{itemsPerPageText:'Nomenclaturas por páginas'}"
                :items-per-page="5"
                :headers="campos"
                :loading="cargando"
                loading-text="Cargando datos por favor espere..."
                :items="desserts"
                :search="search"
                no-results-text="No hay datos disponibles"   
                >
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                        rounded
                        small
                        dark
                        v-if="item.tiene_historial != 'SI'"
                        color="green"
                        @click="elegir(item)"
                    >
                    editar
                    </v-btn>
                </template>
            </v-data-table>
            <v-overlay
            :value="overlay"
            :opacity="opacity"
            >
            <v-progress-circular
                indeterminate
                size="180"
                width="15"
                color="#000080"
            >
            </v-progress-circular>

            </v-overlay>
            <v-dialog
                v-model="dialog"
                persistent
                max-width="800px"
                transition="fab-transition"
            >
            <v-card>
                <v-toolbar flat>
                    <v-card-title>
                        <span>{{ tituloCrear }}</span>
                    </v-card-title>
                    <v-spacer></v-spacer>    
                    <v-btn
                        id="btnCerrar"
                        class="elevation-0"
                        @click="cerrarModalEditar()"
                    >
                    X
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-row class="mt-3">
                            <v-col
                                cols="12"
                                sm="12"
                            >
                            <v-autocomplete
                                label="Seleccione un despacho"
                                v-model="editedItem.fk_despacho"
                                :items="despachos"
                                item-value="id_despacho"
                                item-text="despacho"
                                type="text"
                                autocomplete="off"
                                dense
                                color="#15395A"
                                class="text-md-body-1 my-text"
                                no-data-text="No hay datos disponibles"
                                :rules="$rules.required"
                            >
                            </v-autocomplete>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="12"
                            >
                            <v-text-field
                                label="Nomenclatura de impresora"
                                v-model="editedItem.nomenclatura"
                                type="text"
                                autocomplete="off"
                                dense
                                color="#15395A"
                                class="text-md-body-1 my-text"
                                :rules="$rules.required"
                            >
                            </v-text-field>
                            </v-col>

                            <v-col
                                cols="12"
                                sm="12"
                            >
                                <v-combobox
                                    v-model="chips"
                                    :items="items"
                                    item-value="id_articulo"
                                    item-text="codigo"
                                    chips
                                    clearable
                                    label="Insumos que utiliza la impresora"
                                    multiple
                                    prepend-icon="mdi-filter-variant"
                                    
                                >
                                    <template v-slot:selection="{ attrs, item, select, selected }">
                                    <v-chip
                                        v-bind="attrs"
                                        :input-value="selected"
                                        close
                                        @click="select"
                                        @click:close="remove(item)"
                                    >
                                        <strong>({{ item.categoria }}) DE LA IMPRESORA ({{ item.modelo }}) {{ item.color }}</strong>&nbsp;
                                       
                                    </v-chip>
                                    <v-text-field></v-text-field>
                                    </template>
                                </v-combobox>

                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
            </v-card>
            </v-dialog>
        </v-container>

    </v-app>
</template>
<script>
import API from '@/api'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            titulo:-1,
            search:'',
            cargando:true,
            overlay:false,
            opacity:0,
            dialog:false,
            desserts:[],
            despachos:[],
            campos:
            [
                {text:'Despacho', value:'despacho', class: "white--text grey darken-3"},
                {text:'Nomenclatura', value:'nomenclatura', class: "white--text grey darken-3"},
                {text:'Código', value:'codigo', class: "white--text grey darken-3"},
               
            ],
            chips: [],
            items: [],
            editedItem:{
                fk_despacho:'',
                nomenclatura:''
            }
        }
    },

    computed: {
        ...mapState(['loginDatos']),
         tituloTabla(){
            return this.titulo === -1 ? 'Nomenclaturas' : ''
        },

        tituloCrear(){
            return this.titulo === -1 ? 'Crear Nomenclatura' : ''
        }
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
            this.mostrarArticulos()
            //this.mostrarNomenclaturas()
        },

        async mostrarNomenclaturas(){
            this.cargando = true
            const respuesta = await API.get('articulos')
            this.desserts = respuesta.data.data
            this.cargando = false
            return
        },

        async mostrarArticulos(){
            const respuesta = await API.get('articulos_sin_nomenclaturas')
            console.log(this.items = respuesta.data.data);
            
            
            
           
        },

        abirModalCrear(){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                this.dialog = true
                
            },2000)
        },

        cerrarModalEditar(){
            this.dialog = false
            //this.limpiarModalEditar()
        },

        remove (item) {
        this.chips.splice(this.chips.indexOf(item), 1)
      },
    },
}
</script>
<style>
#fondo{
    background: #f2f3f4;
}

.my-text input{
    text-transform: uppercase;
}

#btnCerrar:hover{
    color: white;
    background-color: red;
    font-weight: bold;
}

#titulo{
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>