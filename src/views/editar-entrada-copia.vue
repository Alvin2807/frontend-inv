<template>
   <v-app id="fondo">
    <v-container>
        <v-stepper
            v-model="formulario"
            vertical 
        >
            <v-toolbar flat id="titulo">
                <v-toolbar-title>
                    {{ tituloFormulario }} ({{ editedItem.tipo_entrada }}) 
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="botones">
                    <v-btn
                        color="#273746"
                        class="white--text"
                        @click="confirmar()"
                    >   <v-icon class="white--text">check</v-icon>
                       confirmar
                    </v-btn>
                    <v-btn
                        color="green"
                        class="white--text"
                        @click="guardar()"
                    >   <v-icon class="white--text">save</v-icon>
                       guadar
                    </v-btn>
                    <v-btn
                        color="red"
                        class="white--text"
                        @click="eliminarSolicitud()"
                    >   <v-icon class="white--text">delete</v-icon>
                      eliminar
                    </v-btn>
                </v-btn-toggle>
            </v-toolbar>
            <v-divider></v-divider>
            <v-stepper-step
                :complete="formulario > 1"
                step="1"
                color="#15395A"
            >
            <h3 id="datosFormulario">Datos Generales</h3>
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-card class="elevation-0">
                    <v-card-text>
                        <v-form ref="validacion">
                         <v-row>
                            <v-col
                                cols="12"
                                sm="3"
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
                                @change="ver()"

                            ></v-date-picker>
                            </v-menu>
                            </v-col>

                            <v-col
                                cols="12"
                                sm="5"
                            >
                            <v-text-field
                                label="Número de solicitud"
                                v-model="editedItem.num_solicitud"
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
                                sm="4"
                            >
                            <v-text-field
                                label="Entregado por"
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
                        </v-form>
                    </v-card-text>
                    <v-btn
                        color="#15395A"
                        dark
                        @click="formulario = 2"
                    >
                        siguiente
                        <v-icon>skip_next</v-icon>
                    </v-btn>
                </v-card>
            </v-stepper-content>
            <v-stepper-step
            :complete="formulario > 2"
            step="2"
            color="#15395A"
            >
            <h3 id="datosFormulario">Detalles de Artículos({{ cantArrayArticulo }})</h3>

            </v-stepper-step>
            <v-stepper-content step="2">
                <v-card>
                    <v-card-text>
                        <v-form ref="validarDetalle">
                            <div
                                v-for="(articulo, index) in editedItem.articulos" 
                                :key="index + articulo"
                            >
                            <v-divider></v-divider>
                            <v-toolbar class="mt-3" flat id="toolbar">
                                <v-toolbar-title class="text-lg-h6">
                                    #{{ articulo.item }} 
                                    {{ articulo.categoria }} DE LA
                                    IMPRESORA {{ articulo.marca }}  {{ articulo.modelo }} {{ articulo.color }}  <span v-if="!articulo.id_detalle" class="red--text">No registrado</span>
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <div v-if="cantidadArticulos">
                                    <v-btn
                                        id="btnEliminar"
                                        class="mt-2 elevation-0"
                                        @click="eliminar(index,articulo)"
                                    >
                                    <v-icon>delete</v-icon>
                                    </v-btn>
                                </div>
                            </v-toolbar>
                            <v-container>
                                <v-row>
                                    <v-col
                                        cols="12"
                                        sm="2"
                                    >
                                    <v-text-field
                                        label="Código"
                                        v-model="articulo.codigo"
                                        type="text"
                                        autocomplete="off"
                                        dense
                                        color="#15395A"
                                        class="text-md-body-1 my-text"
                                        :rules="$rules.required"
                                        readonly
                                    >
                                    </v-text-field>
                                    </v-col>

                                    <v-col
                                        cols="12"
                                        sm="2"
                                    >
                                    <v-text-field
                                        label="Cantidad"
                                        v-model="articulo.cantidad_solicitada"
                                        type="number"
                                        autocomplete="off"
                                        dense
                                        color="#15395A"
                                        class="text-md-body-1 my-text"
                                        :min="1"
                                        :rules="numberRule"
                                    >
                                    </v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-container>
                            </div>
                        </v-form>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <h2>Cantidad Total: {{ editedItem.cantidad_solicitada }}</h2>
                        </v-toolbar>
                        <div v-if="cantidadArticulosEntrada">
                            <v-toolbar flat>
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
                            :headers="headers"
                            :items="desserts"
                            :items-per-page="5"
                            :search="search"
                            class="elevation-0 mt-3"
                            :loading="cargando"               
                            no-results-text="No hay datos disponibles"
                            loading-text="Cargando datos por favor espere..." 
                            no-data-text="No hay datos disponibles"
                            :footer-props="{itemsPerPageText:'Artículos por páginas'}" 
                            >
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn
                                    small
                                    dark
                                    rounded
                                    color="light-blue darken-1"
                                    @click="elegir(item)"
                                >elegir
                                </v-btn>
                            </template>
                            </v-data-table>
                        </div>
                    </v-card-text>
                    <v-btn
                        color="#15395A"
                        dark
                        @click="formulario = 1"
                    >
                    atras
                    <v-icon>skip_previous</v-icon>
                    </v-btn>
                </v-card>
            </v-stepper-content>
        </v-stepper>
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
import { mapState, mapActions } from 'vuex';
import 'sweetalert2/dist/sweetalert2.min.css';
import API from '@/api';
export default {
    data() {
        return {
            formulario:1,
            titulo:-1,
            botones:null,
            loader:null,
            menuFecha:false,
            tipo_entrada:'',
            cargando:false,
            overlay:false,
            opacity:0,
            search:'',
            nowDate: new Date().toISOString().slice(0,10),
            despachos:[],
            reglaNum:
            [
                value => !!value || 'Campo obligatorio.',
                value => (value && value.length == 10) || 'El campo debe de tener maximo 10 caracteres',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],

            numberRule: 
            [
                value => !!value || 'Campo obligatorio.',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],
            headers: 
            [
                { text: 'Categoría', sortable: false, value: 'categoria', class: "white--text grey darken-3"},
                { text: 'Código', value: 'codigo',class: "white--text grey darken-3"},
                { text: 'Referencia', value: 'referencia', class: "white--text grey darken-3"},
                { text: 'Marca', value: 'marca', class: "white--text grey darken-3", sortable:false},
                { text: 'Impresora', value: 'modelo', class: "white--text grey darken-3"},
                { text: 'Color', value: 'color', class: "white--text grey darken-3", sortable:false},
                { text: 'Acción', value: 'actions',class: "white--text grey darken-3"},
                
            ],
            desserts: [],
            tipo_entradas:[],
            editedItem:{
                fecha_entrada:null,
                fk_despacho:'',
                fk_tipo_solicitud:1,
                fk_tipo_entrada:'',
                id_solicitud:'',
                tipo_accion:'ENTRADA',
                usuario:'',
                entregado_por:'',
                num_solicitud:'',
               /*  articulos:
                [
                   {
                    no_item:1,
                    id_detalle:'',
                    codigo:'',
                    fk_articulo:'',
                    referencia:'',
                    categoria:'',
                    marca:'',
                    modelo:'',
                    color:'',
                    cantidad_solicitada:'',
                   
                   }
                ], */
            },
        }
    },

    computed: {
        ...mapState(['loginDatos','datos']),
        tituloFormulario(){
            return this.titulo === -1 ? 'EDITAR SOLICITUD DE ENTRADA' : '';
        },

        fecha_entrada: {
            get() {
                return this.formatoFechaEntrada(this.editedItem.fecha_entrada)
            },
            set() {
                this.editedItem.fecha_entrada = null
            }
        },

        cantArrayArticulo () {
            return this.editedItem.articulos.length
        },

        cantidadArticulos(){
            return this.editedItem.articulos.length > 1
        },

        cantidadArticulosEntrada(){
            return this.desserts.length > 0
        },
    },

    mounted() {
        this.informacion()
    },

    loader(){
        const l = this.loader
        this[l] = !this[l]
        setTimeout(() =>(this[l] = false), 1000)
        this.loader = null
    },

    methods: {
        ...mapActions(['mostrarSolicitudPendientes']),
        informacion(){
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                this.$router.push({path:'/'})
            }

            this.loginDatos.usuario = usuario
            this.mostrarData();
            
        },

       async mostrarData(){
            const solicitudes = localStorage.getItem('id_solicitud')
            if (! solicitudes) {
                this.$router.push({path:'/'})
            }
            this.datos.id_solicitud = solicitudes
            const respuesta = await API.get('detalle_de_solicitud/' + solicitudes)
            this.editedItem = respuesta.data.data
            this.mostrarDespachos()
            this.mostrarArticulos()
            this.mostrarTipoEntradas()
            this.ver()
            return
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

        async mostrarTipoEntradas(){
            const respuesta = await API.get('tipo_entradas')
            this.tipo_entradas = respuesta.data.data
            return
        },

        async mostrarArticulos(){
             this.cargando = true
             const respuesta = await API.get('articulos_disponibles_entradas')
             this.desserts = respuesta.data.data
             this.cargando = false
             return
        },

         getSolicitudEntrada(){
            if (this.editedItem.fk_despacho !== null) {
                let objEntrada = this.tipo_entradas.find(data =>data.fk_despacho === this.editedItem.fk_despacho)
                this.tipo_entrada = objEntrada.tipo_entrada;
                this.editedItem.tipo_entrada = objEntrada.tipo_entrada
                this.editedItem.fk_tipo_entrada = objEntrada.id_tipo_entrada;
            } else {
                this.tipo_entrada = null
            }
        },

        eliminar(index,articulo){
          if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()) {
            if (articulo.id_detalle) {
                Swal.fire({
                    title:'¿Estas seguro de eliminar este artículo?',
                    icon:'warning',
                    showCancelButton:true,
                    confirmButtonColor:'#3085d6',
                    cancelButtonColor:'#d33',
                    confirmButtonText:'Sí',
                    cancelButtonText:'No'
                }).then((result) => {
                if (result.isConfirmed) {
                    this.overlay = true
                    setTimeout(()=>{
                        this.overlay = false
                        const eliminarArticulo = async()=>{
                        let perfil = JSON.parse(localStorage.getItem('usuario'))
                        this.editedItem.usuario = perfil.usuario
                        const respuesta = await API.put('eliminar_articulo_solicitud', {
                            id_detalle:   articulo.id_detalle,
                            fk_articulo:  articulo.fk_articulo,
                            fk_solicitud: articulo.fk_solicitud,
                            cantidad_solicitada: articulo.cantidad_solicitada,
                            usuario:this.editedItem.usuario
                        })
                        if (respuesta.data.ok == true) {
                            this.mensajeEliminarArticulo(respuesta.data.eliminadoArticulo)
                            this.informacion()
                        } else if (respuesta.data.ok == false) {
                            this.mensajeEliminarArticuloErrorRegistro(respuesta.data.errorEliminarArticulo)
                        }
                    }
                        return eliminarArticulo();
                    },2000)
                    }
                });
            } else {
                if (this.editedItem.articulos.length > 1) {
                    this.editedItem.articulos.splice(index, 1)
                    this.updateItem()
                }
            }
          } else {
            Swal.fire({
            icon:'warning',
            title:'Faltan campos obligatorios',
            showConfirmButton:false,
            timer:2000
            }) 
          }
        },

        updateItem () {
            this.editedItem.articulos.forEach((data, i) => {
            data.item = i + 1
        })
        },

        elegir(item){
            let {articulos} = this.editedItem
            let cant = articulos.filter(data=>data.fk_articulo === item.id_articulo)
            if (cant.length > 0) {
               Swal.fire({
                icon:'warning',
                title: 'Ya existe el código ' + item.codigo + ' en el detalle de artículo',
                showConfirmButton:false,
                timer:1500
               })
            } else {
                this.editedItem.articulos.push({
                    id_detalle: item.id_detalle,
                    no_item: this.cantArrayArticulo + 1,
                    fk_articulo:item.id_articulo,
                    codigo:item.codigo,
                    categoria:item.categoria,
                    referencia:item.referencia,
                    marca:item.marca,
                    modelo:item.modelo,
                    color:item.color,
                    cantidad_solicitada: 1,
                  
                }) 
            }
        },

       guardar(){
        if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()) {
            let perfil = JSON.parse(localStorage.getItem('usuario'))
            this.editedItem.usuario = perfil.usuario
            this.overlay = true
            setTimeout(() => {
            this.overlay = false
                const guardarDatos = async()=>{
                    const respuesta = await API.put('editar_solicitud', this.editedItem)
                    if (respuesta.data.ok == true) {
                        this.informacion()
                        this.mensajeGuardarExitoso(respuesta.data.exitoso)
                    } else if (respuesta.data.ok == false) {
                        this.mensajeErrorRegistro(respuesta.data.errorRegistro)
                    }
                } 
                return guardarDatos();
            }, 2000);
            
        } else {
        Swal.fire({
            icon:'warning',
            title:'Faltan campos obligatorios',
            showConfirmButton:false,
            timer:2000
        }) 
        }
           
        },

        mensajeGuardarExitoso(exitoso){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: exitoso,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeEliminarArticulo(eliminadoArticulo){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: eliminadoArticulo,
                showConfirmButton:false,
                timer:2000
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

        mensajeEliminarArticuloErrorRegistro(errorEliminarArticulo){
            Swal.fire({
                icon: 'error',
                title:errorEliminarArticulo,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeEliminadoExitoso(eliminarSolicitud){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: eliminarSolicitud,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeConfirmarExitoso(confirmado){
            Swal.fire({
                icon:'success',
                title:'!Genial',
                text: confirmado,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeEliminadoError(errorEliminarSolicitud){
            Swal.fire({
                icon:'error',
                title:errorEliminarSolicitud,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeConfirmadoError(error){
            Swal.fire({
                icon:'error',
                title:error,
                showConfirmButton:false,
                timer:2000
            })
        },

        eliminarSolicitud(){
            Swal.fire({
                title: "¿Estas seguro de eiliminar esta solicitud?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí",
                cancelButtonText:'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()) {
                        let perfil = JSON.parse(localStorage.getItem('usuario'))
                        this.editedItem.usuario = perfil.usuario
                        this.overlay = true
                        setTimeout(() => {
                            this.overlay = false
                            const eliminarSolicitud = async()=>{
                                const respuesta = await API.put('eliminar_solicitud', this.editedItem)
                                if (respuesta.data.ok == true) {
                                    this.mostrarSolicitudPendientes()
                                    this.mensajeEliminadoExitoso(respuesta.data.eliminarSolicitud)
                                    this.$router.push({path:'/inicio'})
                                } else if (respuesta.data.ok == false) {
                                    this.mensajeEliminadoError(respuesta.data.errorEliminarSolicitud)
                                }
                            }
                            return eliminarSolicitud();
                        }, 2000);
                    } else {
                    Swal.fire({
                        icon:'warning',
                        title:'Faltan campos obligatorios',
                        showConfirmButton:false,
                        timer:2000
                    }) 
                    }
            }
            });
        
        },

        confirmar(){
            if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()) {
                let perfil = JSON.parse(localStorage.getItem('usuario'))
                this.editedItem.usuario = perfil.usuario
                this.overlay = true
                setTimeout(() => {
                    this.overlay = false
                    const confirmarDatos = async()=>{
                        const respuesta = await API.put('confirmar_solicitud', this.editedItem)
                        if (respuesta.data.ok == true) {
                            this.mostrarSolicitudPendientes()
                            this.mensajeConfirmarExitoso(respuesta.data.confirmado)
                            this.$router.push({path:'/inicio'})
                        } else if (respuesta.data.ok == false) {
                            this.mensajeConfirmadoError(respuesta.data.error)
                        }
                    }
                    return confirmarDatos();
                }, 2000);
                
            } else {
                Swal.fire({
                    icon:'warning',
                    title:'Faltan campos obligatorios',
                    showConfirmButton:false,
                    timer:2000
                }) 
            }
        },

          ver(){
                const fecha = new Date(this.editedItem.fecha_entrada); 
                const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
                this.editedItem.mes = mes 
            }
             
        }
    }

</script>
<style>
#fondo{
     background: #f2f3f4;
 }

 #titulo{
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
 }

 #datosFormulario{
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  font-size:15px;
}

#toolbar{
    border-left: 5px solid #170d73;
}

#btnEliminar:hover{
    color: white;
    background-color: red;
    font-weight: bold;
}

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

   .my-text input{
    text-transform: uppercase;
}

</style>