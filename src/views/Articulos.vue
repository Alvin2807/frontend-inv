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
                    :footer-props="{itemsPerPageText:'Artículos por páginas'}"
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
                   <crear-articulos :solicitudArticulo="2" @cerrarModalArticulo='cerrarModalArticulo()' @mostrarArticulos='mostrarArticulos()'></crear-articulos>

                </v-dialog>
                <v-dialog
                    v-model="dialogEditar"
                    persistent
                    max-width="800px"
                    transition="fab-transition"
                >
                    <v-card>
                        <v-toolbar flat>
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
                        <v-card-title>
                            <span>{{ tituloCrear }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="validacionEditar">
                                <v-row class="mt-3">
                                    <v-col
                                        cols="12"
                                        sm="3"
                                    >
                                        <v-text-field
                                            label="Código"
                                            v-model="editedItem.codigo"
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
                                        sm="3"
                                    >
                                        <v-text-field
                                            label="Referencia"
                                            v-model="editedItem.referencia"
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
                                        sm="6"
                                    >
                                        <v-autocomplete
                                            label="Seleccione una categoria"
                                            v-model="editedItem.fk_categoria"
                                            :items="categorias"
                                            item-value="id_categoria"
                                            item-text="categoria"
                                            type="text"
                                            autocomplete="off"
                                            dense
                                            color="#15395A"
                                            class="text-md-body-1 my-text"
                                            :rules="$rules.required"
                                            no-data-text="No hay datos disponibles"
                                        >
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="4"
                                    >
                                        <v-autocomplete
                                            label="Seleccione una marca"
                                            v-model="editedItem.fk_marca"
                                            :items="marcas"
                                            item-value="id_marca"
                                            item-text="marca"
                                            type="text"
                                            autocomplete="off"
                                            dense
                                            color="#15395A"
                                            class="text-md-body-1 my-text"
                                            :rules="$rules.required"
                                            no-data-text="No hay datos disponibles"
                                            @change="mostrarModelosArticulos(editedItem.fk_marca)"
                                        >
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        sm="5"
                                    >
                                        <v-autocomplete
                                            label="Seleccione un modelo de impresora"
                                            v-model="editedItem.fk_modelo"
                                            :items="modelos"
                                            item-value="id_modelo"
                                            item-text="modelo"
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
                                        sm="3"
                                    >
                                        <v-autocomplete
                                            label="Seleccione un color"
                                            v-model="editedItem.fk_color"
                                            :items="colores"
                                            item-value="id_color"
                                            item-text="color"
                                            type="text"
                                            autocomplete="off"
                                            dense
                                            color="#15395A"
                                            class="text-md-body-1 my-text"
                                            no-data-text="No hay datos disponibles"
                                        >

                                        </v-autocomplete>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <div class="mx-auto">
                                <v-btn
                                    color="blue-grey darken-4"
                                    x-large
                                    :loading="btnGuardar"
                                    class="white--text"
                                    @click="guardar()"
                                >
                                guardar cambios
                                </v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>

                </v-dialog>
        </v-container>
    </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import API from '@/api'
import { mapState } from 'vuex';
import CrearArticulos from '../components/CrearArticulos.vue'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    components:{
        CrearArticulos
    },
    data() {
        return {
            titulo:-1,
            search:'',
            loader:null,
            cargando:true,
            btnGuardar:false,
            overlay:false,
            dialogEditar:false,
            dialog:false,
            opacity:0,
            toggle_exclusive: '',
            editedItem:{
                codigo:'',
                referencia:'',
                fk_categoria:'',
                fk_marca:'',
                fk_modelo:'',
                fk_color:'',
                usuario:''
            },
            categorias:[],
            marcas:[],
            modelos:[],
            colores:[],
            desserts:[],
            campos:
            [
                {text:'Código', value:'codigo', class: "white--text grey darken-3"},
                {text:'Referencia', value:'referencia', class: "white--text grey darken-3"},
                {text:'Categoría', value:'categoria', class: "white--text grey darken-3"},
                {text:'Marca', value:'marca', class: "white--text grey darken-3"},
                {text:'Impresora', value:'modelo', class: "white--text grey darken-3",sortable:false},
                {text:'Color', value:'color', class: "white--text grey darken-3", sortable:false},
                {text:'Stock', value:'stock', class: "white--text grey darken-3", sortable:false},
                {text:'Status', value:'estado', class: "white--text grey darken-3", sortable:false},
                {text: 'Acción', value: 'actions', sortable: false, class: "white--text grey darken-3" },
            ]
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloData(){
            return this.titulo === -1 ? 'Formulario de Artículos' : ''
        },

        tituloTabla(){
            return this.titulo === -1 ? 'Artículos' : ''
        },

        tituloCrear(){
            return this.titulo === -1 ? 'Editar Artículo' : ''
        }
    },

    watch: {
        loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
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
            this.mostrarArticulos()
        },

        async mostrarArticulos(){
            this.cargando = true
            const respuesta = await API.get('articulos')
            this.desserts = respuesta.data.data
            this.cargando = false
            return
        },

        abirModalCrear(){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                this.dialog = true
                
            },2000)
        },

        cerrarModalEditar(){
            this.dialogEditar = false
            this.limpiarModalEditar()
        },

        cerrarModalArticulo(){
            this.dialog = false
           
        },

        limpiarModalEditar(){
            this.$refs.validacionEditar.resetValidation()
            this.$refs.validacionEditar.reset()
        },

        async mostrarModelosArticulos(fk_marca){
            if (fk_marca !==null) {
                const respuesta = await API.get('select_modelo_marca/' + fk_marca)
                this.modelos = respuesta.data.data;
                
            } else {
                this.modelos = []
                return
            }
        },

        async mostrarCategorias(){
            const respuesta = await API.get('categorias')
            this.categorias = respuesta.data.data
            return
        },

        async mostrarMarcas(){
            const respuesta = await API.get('marcas')
            this.marcas = respuesta.data.data
            return
        },

        async mostrarColores(){
            const respuesta = await API.get('colores')
            this.colores = respuesta.data.data
            return
        },


        elegir(item){
            this.overlay = true
            setTimeout(()=>{
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.mostrarCategorias()
                this.mostrarMarcas()
                this.mostrarColores()
                this.mostrarModelosArticulos(item.fk_marca)
                this.dialogEditar = true
                this.overlay = false
            },1500)
        },

      guardar(){
           if (this.$refs.validacionEditar.validate()) {
            let perfil = JSON.parse(localStorage.getItem('usuario'))
            this.loader = 'btnGuardar'
            this.editedItem.usuario = perfil.usuario
            const guardarData = async()=>{
                
                try {
                   const respuesta = await API.put('editar_articulo', this.editedItem) 
                   if (respuesta.data.ok == true) {
                    if (respuesta.data.existe) {
                        this.mensajeEditarExiste(respuesta.data.existe)
                    } else {
                        this.mensajeEditarExitoso(respuesta.data.exitoso)
                        this.mostrarArticulos()
                        this.dialogEditar = false
                    }
                    
                   } else if (respuesta.data.ok == false) {
                    this.mensajeEditarError(respuesta.data.errorArticuloEditar)
                   }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error consulte con el administrador del sistema',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
            return guardarData()
           }
            
        },

        mensajeEditarExiste(existe){
            Swal.fire({
                icon:'warning',
                text:existe,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeEditarExitoso(exitoso){
            Swal.fire({
                icon:'success',
                text:exitoso,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeEditarError(errorArticuloEditar){
            Swal.fire({
                icon:'error',
                title:errorArticuloEditar,
                showConfirmButton:false,
                timer:2000
            })
        }
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