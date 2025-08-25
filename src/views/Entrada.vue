<template>
   <v-app id="fondo">
    <v-container>
        <v-card class="elevation-0">
            <v-card-title>
                {{ tituloFormulario }} ({{ tipo_entrada }}) 
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="botones">
                    <v-btn
                        color="cyan darken-1"
                        class="white--text"
                        @click="registrar()"
                    >
                        registrar
                    </v-btn>
                    <v-btn
                        color="red"
                        class="white--text"
                        :loading="loading1"
                        @click="borrar()"
                    >
                    borrar
                    </v-btn>
                </v-btn-toggle>
             
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-form ref="validacion">
                    <span class="font-weight-black">DATOS GENERALES</span>
                    <v-row class="mt-3">
                        <v-col
                            cols="12"
                            sm="2"
                        >
                            <v-menu
                                v-model="menuFecha"
                                :close-on-content-click="false"
                                :nudge-right="80"
                                transition="fab-transition"
                                offset-y
                                min-width="auto"
                            >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="fecha_entrada"
                                    label="Fecha*"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    dense
                                    color="#15395A"
                                    class="my-text"
                                    :rules="$rules.required"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="editedItem.fecha_entrada"
                                @input="menuFecha = false"
                                color="#15395A"
                                locale="es"
                                class="caption"  
                                :max="nowDate"
                            
                            ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="5"
                        >
                            <v-text-field
                                label="Número de solicitud*"
                                v-model="editedItem.num_solicitud"
                                type="text"
                                autocomplete="off"
                                dense
                                color="#15395A"
                                class="text-md-body-1 my-text"
                                :rules="$rules.required"
                                clearable
                            >
                            </v-text-field>
                        </v-col>
                          <v-col
                                cols="12"
                                sm="4"
                            >
                            <v-text-field
                                label="Entregado por*"
                                v-model="editedItem.entregado_por"
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
                            <v-autocomplete
                                label="Seleccione un despacho*"
                                v-model="editedItem.fk_despacho"
                                :items="despachos"
                                item-value="id_despacho"
                                item-text="despacho"
                                type="text"
                                autocomplete="off"
                                dense
                                color="#15395A"
                                class="text-md-body-1 my-text"
                                :rules="$rules.required"
                                no-data-text="No hay datos disponibles"
                                @change="getSolicitudEntrada()"
                            >
                            </v-autocomplete>
                            </v-col>
                    </v-row>
                    <v-divider v-if="!allSelected"></v-divider>
                </v-form>

                <v-form ref="validacionDetalle">
                    <v-container>
                    <span class="font-weight-black">DETALLE DE ARTÍCULOS A SOLICITAR({{  articulosSelececionados }})</span>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            :disabled="!selected.length"
                            :loading="loading"
                            color="red"
                            text
                            @click="next"
                        >
                                <v-icon>delete</v-icon>
                            limpiar detalle
                        </v-btn>
                    </v-card-actions>
                        <v-row
                            align="center"
                            justify="start"
                            class="mt-3"
                        >
                            <v-col
                                v-for="(selection, i) in selections"
                                    :key="selection.id_articulo"
                                    class="shrink"
                                    cols="12"
                                >
                                <v-alert
                                    dense
                                    border="left"
                                    type="success"
                                 
                                    outlined
                                >
                                <span class="text-lg-h6"> {{ selection.categoria }} {{ selection.color }}<strong>({{ selection.codigo }}) </strong>DE LA IMPRESORA {{ selection.marca }} <strong> {{ selection.modelo }} </strong></span>
                                <v-row>
                                    <v-col
                                        cols="12"
                                        sm="2"
                                    >
                                    <v-text-field
                                        v-model="selection.cantidad_solicitada"
                                        label="Cantidad"
                                        type="number"
                                        :min="1"
                                        autocomplete="off"
                                        color="#15395A"
                                        class="text-md-body-1 my-text mx-3"
                                        :rules="numberRule"
                                    >
                                    </v-text-field>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                   <v-btn
                                        color="red"
                                        text
                                        rounded
                                        class="elevation-0"
                                        :disabled="loading"
                                        @click="seleccionar(i, selection, selected)"
                                    ><v-icon>close</v-icon>
                                    </v-btn>
                                </v-row>
                                </v-alert>
                            </v-col>
                        </v-row>
                        
                        <v-col
                            v-if="!allSelected"
                                cols="12"
                                sm="6"
                            >
                            <v-text-field
                                ref="search"
                                v-model="search"
                                full-width
                                hide-details
                                label="Buscar"
                                single-line
                                class="caption my-text"
                                color="#1A5276"  
                                append-icon="mdi-magnify"
                                placeholder="Busqueda"
                                
                            ></v-text-field>
                        </v-col>
                    </v-container>
                </v-form>
                <v-data-table
                    :headers="headers"
                    :items="desserts"
                    :items-per-page="5"
                    :search="search"
                    class="elevation-0 mt-3"
                    no-results-text="No hay datos disponibles"
                    loading-text="Cargando datos por favor espere..." 
                    no-data-text="No hay datos disponibles"
                    :footer-props="{itemsPerPageText:'Artículos por páginas'}"
                >  
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                        v-if="!selected.includes(item)"
                        :key="item.id_articulo"
                        :disabled="loading"
                        color="green"
                        dark
                        small
                        rounded
                        class="elevation-0"
                        @click="elegir(item)"
                    >elegir
                    </v-btn>
                </template>
                </v-data-table>
                <v-divider></v-divider>
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
<script src="sweetalert2.all.min.js"></script>
<script>
import API from '@/api'
import { mapState, mapActions } from 'vuex'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            titulo:-1,
            botones:null,
            search:'',
            menuFecha:false,
            loading: false,
            loading1: false,
            nowDate: new Date().toISOString().slice(0,10),
            overlay:false,
            opacity:0,
            tipo_entrada:'',
            editedItem:{
                fecha_entrada: null,
                 fk_despacho:'',
                fk_tipo_solicitud:1,
                fk_tipo_entrada:'',
                tipo_accion:'ENTRADA',
                usuario:'',
                entregado_por:'',
                num_solicitud:'',
                articulos:
                [
                   {
                    no_item:1,
                    codigo:'',
                    fk_articulo:'',
                    referencia:'',
                    categoria:'',
                    marca:'',
                    modelo:'',
                    color:'',
                    cantidad_solicitada:'',
                   }
                ],
            },
            despachos:[],
            tipo_entradas:[],
            desserts:[],
            selected: [],
             headers: 
            [
                { text: 'Categoría', sortable: false, value: 'categoria', class: "white--text grey darken-3"},
                { text: 'Código', value: 'codigo',class: "white--text grey darken-3"},
                { text: 'Modelo de tinta', value: 'referencia', class: "white--text grey darken-3"},
                { text: 'Marca', value: 'marca', class: "white--text grey darken-3", sortable:false},
                { text: 'Impresora', value: 'modelo', class: "white--text grey darken-3"},
                { text: 'Color', value: 'color', class: "white--text grey darken-3", sortable:false},
                { text: 'Acción', value: 'actions',class: "white--text grey darken-3"},
                
            ],
            numberRule: 
            [
                value => !!value || 'Campo obligatorio.',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],

        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloFormulario(){
            return this.titulo === -1 ? 'SOLICITUD DE ENTRADA' : '';
        },

        cantArrayArticulo () {
            return this.editedItem.articulos.length
        },

        articulosSelececionados(){
            return this.selections.length
        },

        fecha_entrada: {
            get() {
                return this.formatoFechaEntrada(this.editedItem.fecha_entrada)
            },
            set() {
                this.editedItem.fecha_entrada = null
            }
        },

        allSelected () {
            return this.selected.length === this.desserts.length
        },
      categories () {
        const search = this.search.toLowerCase()

        if (!search) return this.desserts

        return this.desserts.filter(item => {
          const text = item.modelo.toLowerCase()

          return text.indexOf(search) > -1
        })
      },

      selections () {
        const selections = []

        for (const selection of this.selected) {
          selections.push(selection)
          
        }


        return selections
      },
    },

    watch: {
        selected () {
        this.search = ''
       
        },
    },

    mounted() {
        this.informacion()
    },

    methods: {
        ...mapActions(['mostrarSolicitudPendientes']),
        informacion(){
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                this.$router.push({path:'/'})
            }

            this.loginDatos.usuario = usuario
            this.mostrarData()
        },

        mostrarData(){
            this.mostrarDespachos()
            this.limpiarDataArticulosDetalle()
            this.mostrarArticulos()
            this.mostrarTipoEntradas()
        },

        async mostrarTipoEntradas(){
            const respuesta = await API.get('tipo_entradas')
            this.tipo_entradas = respuesta.data.data
            return
        },

        limpiarDataArticulosDetalle(){
            this.editedItem.articulos = []
        },

        formatoFechaEntrada (fechEntrada) {
            if (!fechEntrada) return null
                const [year, month, day] = fechEntrada.split('-')
            return `${day}/${month}/${year}`
        },

        async mostrarDespachos(){
            const respuesta = await API.get('despachos_por_entrada')
            this.despachos = respuesta.data.data
            return
        },

         getSolicitudEntrada(){
            if (this.editedItem.fk_despacho !== null) {
                let objEntrada = this.tipo_entradas.find(data =>data.fk_despacho === this.editedItem.fk_despacho)
                this.tipo_entrada = objEntrada.tipo_entrada;
                this.editedItem.fk_tipo_entrada = objEntrada.id_tipo_entrada;
            } else {
                this.tipo_entrada = null
            }
        },

        async mostrarArticulos(){
            const respuesta = await API.get('articulos')
            this.desserts = respuesta.data.data
            return
        },

        next () {
            this.loading = true
            setTimeout(() => {
            this.search = ''
            this.selected = []
            this.loading = false
            this.$refs.validacionDetalle.resetValidation()
            this.$refs.validacionDetalle.reset()
            this.editedItem.articulos.length = []
            }, 2000)
      },

        
        registrar(){
            for (let index = 0; index <this.selections.length; index++) {
               var cantidad = parseInt(this.selections[index].cantidad_solicitada)
            }
            for (let index1 = 0; index1 < this.editedItem.articulos.length; index1++) {
               this.editedItem.articulos[index1].cantidad_solicitada = cantidad;
            }
        
            let perfil = JSON.parse(localStorage.getItem('usuario'))
            this.editedItem.usuario = perfil.usuario
            if (this.editedItem.articulos.length == 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'No se encuentra ningun artículo a solicitar',
                    showConfirmButton: false,
                    timer: 1500
                }) 
            } else {
                
                const registrarData = async()=>{
                    let perfil = JSON.parse(localStorage.getItem('usuario'))
                    this.editedItem.usuario = perfil.usuario
                    if (this.$refs.validacionDetalle.validate() && this.$refs.validacion.validate()){
                        const respuesta = await API.post('solicitudes', this.editedItem)
                        if (respuesta.data.ok == true) {
                        const {id} = respuesta.data.data
                            localStorage.setItem('id_solicitud', id)
                            this.mostrarSolicitudPendientes()
                            this.overlay = true
                            setTimeout(()=>{
                                this.overlay = false
                                this.mensajeRegistroExitoso(respuesta.data.exitoso)
                                this.$router.push({path:'/editar-solicitud-entrada'})
                            },2000)
                        } else if (respuesta.data.ok == false) {
                            this.mensajeErrorRegistro(respuesta.data.errorRegistro)
                        } else if (respuesta.data.existe) {
                        this.mensajeRegistroExisteNumSolicitud(respuesta.data.existe)
                            
                        }
                    } else {
                        Swal.fire({
                        icon:'warning',
                        title:'Faltan campos obligatorios',
                        showConfirmButton:false,
                        timer:2000
                        }) 
                    }
                }
                    return registrarData();
            
                } 
        },

        mensajeRegistroExitoso(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeRegistroExisteNumSolicitud(existe){
            Swal.fire({
                icon:'warning',
                title: existe,
                showConfirmButton:false,
                timer:3000
            })
        },

        mensajeErrorRegistro(errorRegistro){
            Swal.fire({
                icon: 'error',
                title:errorRegistro,
                showConfirmButton:false,
                timer:2000
            })
        },

        borrar(){
            this.loading1 = true
            setTimeout(() => {
                this.search = ''
                this.selected = []
                this.loading1 = false
                this.$refs.validacion.resetValidation()
                this.$refs.validacion.reset()
                this.$refs.validacionDetalle.resetValidation()
                this.$refs.validacionDetalle.reset()
                this.editedItem.articulos.length = []
            }, 2000)
        },

        seleccionar(i, selection, selected){
            selection.cantidad_solicitada = ''
            selected.splice(i, 1)
            this.editedItem.articulos.splice(i, 1)
        },

        elegir(item){
            item.cantidad_solicitada = 1
            this.selected.push(item)
            this.editedItem.articulos.push({
                 no_item: this.cantArrayArticulo + 1,
                fk_articulo:item.id_articulo,
                codigo:item.codigo,
                cantidad_solicitada: 1,
                
        })
        }
     
      }
}
</script>
<style>
#fondo{
     background:#D7DBDD;
 }

 #titulo{
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
 }

.my-text input{
    text-transform: uppercase;
}

#toolbar{
    border-left: 5px solid teal;
}

</style>