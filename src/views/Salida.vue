<template>
    <v-app id="fondo">
     <v-container>
        <v-card>
            <v-stepper
                v-model="formulario"
                vertical
            >
                <v-toolbar flat id="titulo">
                <v-toolbar-title>
                    {{ tituloFormulario }}
                </v-toolbar-title>
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
                            @click="borrar()"
                        >
                            borrar
                        </v-btn>

                    </v-btn-toggle>
                </v-toolbar>
                <v-stepper-step
                :complete="formulario > 1"
                step="1"
                color="#15395A"
                >
                <h3 id="datosFormulario">Datos Generales</h3>
                </v-stepper-step>

                <v-stepper-content step="1" >
                <v-card class="elevation-0" v-if="totalArticulos !== 0">
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
                                        v-model="fecha_incidencia"
                                        label="Fecha de solicitud*"
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
                                    v-model="editedItem.fecha_incidencia"
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
                                    sm="2"
                                >
                                <v-text-field
                                    label="Incidencia*"
                                    v-model="editedItem.incidencia"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    :rules="$rules.required"
                                    :maxLength="6"
                                    :counter="6"
                                    clearable
                                >
                                </v-text-field>
                                </v-col>
                            </v-row>
                            <v-toolbar 
                                flat
                                class="text-md-body-1"
                                >
                                <v-toolbar-title> Entregado por:</v-toolbar-title>
                            </v-toolbar>
                            <v-row>
                                <v-switch
                                    v-model="switch1"
                                    label="Mí persona"
                                    color="green"
                                    @click="verMiTecnico()"
                                >
                                </v-switch>
                            
                                <v-col
                                    cols="12"
                                    sm="4"
                                >
                                <v-autocomplete
                                    label="Otros Técnicos*"
                                    v-model="editedItem.entregado_por"
                                    :items="tecnicos"
                                    item-value="name"
                                    item-text="name"
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
                            </v-row>
                             <v-toolbar 
                                flat
                                class="text-md-body-1"
                                >
                                <v-toolbar-title>Entregar insumo hacía:</v-toolbar-title>
                            </v-toolbar>
                            <v-row>
                                <v-switch
                                    v-model="switch2"
                                    label="Mí despacho"
                                    dense
                                    color="green"
                                    
                                    @click="verMiDespacho()"
                                    @change="mostrarNomenclaturasMidespacho()"
                                >
                                </v-switch>
                               
                            
                                <v-col
                                    cols="12"
                                    sm="6"
                                >
                                <v-autocomplete
                                    label="Otro Despacho*"
                                    v-model="editedItem.fk_despacho"
                                    :items="despachos"
                                    item-value="fk_despacho"
                                    item-text="despacho"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    :rules="$rules.required"
                                    no-data-text="No hay datos disponibles"
                                   @change="mostrarNomenclaturas(editedItem.fk_despacho)"
                                >
                                </v-autocomplete>
                                </v-col>
                                 <v-col
                                    cols="12"
                                    sm="4"
                                >
                                <v-autocomplete
                                    label="Nombre de Impresora*"
                                    v-model="editedItem.fk_nomenclatura"
                                    :items="nomenclaturas"
                                    item-value="id_nomenclatura"
                                    item-text="nomenclatura"
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
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-btn
                    color="#15395A"
                    dark
                    v-if="totalArticulos !== 0"
                   @click="btnSiguiente()"
                >
                siguiente
                <v-icon>skip_next</v-icon>
                </v-btn>
                </v-stepper-content>

                <v-stepper-step
                    :complete="formulario > 2"
                    step="2"
                    color="#15395A"
                >
                <h3 id="datosFormulario">Detalles de Artículos</h3>
                </v-stepper-step>

                <v-stepper-content step="2">
                <v-card class="elevation-0" v-if="totalArticulos !== 0">
                    <v-card-text>
                        <v-alert
                            dense
                            type="warning"
                            text
                            v-model="alerta"
                        >
                            No se encontro ningún <strong>artículo</strong> en el detalle
                        </v-alert>
                        <v-form ref="validacionDetalle">
                            <div
                            v-for="(articulo, index) in editedItem.articulos"
                            :key="index + articulo"
                            >
                            <v-divider></v-divider>
                            <v-toolbar class="mt-3" flat id="toolbar">
                                <v-toolbar-title class="text-lg-h6">
                                    #{{ articulo.no_item }} 
                                    {{ articulo.categoria }} DE LA
                                    IMPRESORA {{ articulo.marca }}  {{ articulo.modelo }} {{ articulo.color }}
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn
                                    id="btnEliminar"
                                    class="mt-2 elevation-0"
                                    @click="eliminar(index)"
                                >
                                <v-icon>delete</v-icon>
                                </v-btn>
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
                                        label="Cantidad*"
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
                    </v-card-text>
                </v-card>
                <v-btn
                    color="#15395A"
                    dark
                    @click="formulario = 1"
                >
                atras
                    <v-icon>skip_previous</v-icon>
                </v-btn>
                </v-stepper-content>
            </v-stepper>
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
import { mapState, mapActions} from 'vuex';
import API from '@/api'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            formulario:1,
            titulo:-1,
            menuFecha:false,
            nowDate: new Date().toISOString().slice(0,10),
            despachos:[],
            tecnicos:[],
            marcas:[],
            radios: null,
            switch1: false,
            switch2:false,
            cargando:false,
            alerta:false,
            overlay:false,
            opacity:0,
            totalArticulos:'',
            search:'',
            botones:null,
            editedItem:{
                fecha_incidencia:null,
                incidencia:'',
                entregado_por:'',
                fk_despacho:'',
                fk_tipo_solicitud:2,
                tipo_accion:'SALIDA',
                usuario:'',
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
                ]
            },

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
            nomenclaturas:[],
            numberRule: 
            [
                value => !!value || 'Campo obligatorio.',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],
        }
    },

    mounted() {
        this.informacion()
         
    },

    computed: {
      ...mapState(['loginDatos','datos']),
      tituloFormulario(){
        return this.titulo === -1 ? 'SOLICITUD DE SALIDA' : '';
      },

        fecha_incidencia: {
            get() {
                return this.formatoFechaIncidencia(this.editedItem.fecha_incidencia)
            },
            set() {
                this.editedItem.fecha_incidencia = null
            }
        },

        cantArrayArticulo () {
            return this.editedItem.articulos.length
        },
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

        formatoFechaIncidencia (fechIncidencia) {
            if (!fechIncidencia) return null
                const [year, month, day] = fechIncidencia.split('-')
            return `${day}/${month}/${year}`
        },

        mostrarData(){
            this.mostrarDespachos()
            this.mostrarUsuarios()
            this.mostrarArticulos()
            this.limpiarDataArticulosDetalle()
        },

        async mostrarArticulos(){
            this.cargando = true
             const respuesta = await API.get('mostrar_articulos_disponibles')
             this.desserts = respuesta.data.data
             this.totalArticulos = respuesta.data.total
             this.cargando = false
              if (this.editedItem.articulos.length == 0) {
                this.alerta = true
             }
             if (this.totalArticulos == 0) {
                 Swal.fire({
                    icon:'warning',
                    title:'No se puede realizar una salida porque no existe ningún artículo en stock.',
                    showConfirmButton:false,
                    timer:5000,
                    
                })
                 this.$router.push({path:'/inicio'})
             }
             return
        },

        
       /*  async mostrarNomenclatura(){
             const respuesta = await API.get('nomenclaturas')
             this.nomenclaturas = respuesta.data.data
             return
        }, */

        async mostrarNomenclaturas(fk_despacho){
             if (fk_despacho !==null) {
                const respuesta = await API.get('nomenclaturas_por_despacho/' + fk_despacho)
                this.nomenclaturas = respuesta.data.data;
                
            } else {
                this.nomenclaturas = []
                return
            }
        },

        async mostrarDespachos(){
            const id_despacho = localStorage.getItem('id_despacho');
             if (!id_despacho) {
                this.$router.push({path:'/'})
            }
            const respuesta = await API.get('despachos_x_nomenclaturas/' + id_despacho)
            this.despachos = respuesta.data.data
            return
        },

        async mostrarUsuarios(){
             const id_usuario = localStorage.getItem('id_usuario');
             if (! id_usuario) {
                this.$router.push({path:'/'})
            }
            const respuesta = await API.get('usuarios/' + id_usuario)
            this.tecnicos = respuesta.data.data
            return
        },

        verMiTecnico(){
            let perfil = JSON.parse(localStorage.getItem('usuario'))
            this.editedItem.entregado_por = perfil.name
            if (this.switch1 == true) {
                this.tecnicos = []
            } else {
                this.mostrarUsuarios()
            }
        },

      async  verMiDespacho(){
            let perfil = JSON.parse(localStorage.getItem('usuario'))
            this.editedItem.fk_despacho = perfil.fk_despacho
            if (this.switch2 == true) {
            this.despachos = []
            const respuesta = await API.get('nomenclaturas_por_despacho/' + this.editedItem.fk_despacho)
            this.nomenclaturas = respuesta.data.data
            } else {
                this.mostrarDespachos()
            }
        },

        async mostrarNomenclaturasMidespacho(fk_despacho){
             if (fk_despacho !==null) {
                const respuesta = await API.get('nomenclaturas_por_despacho/' + fk_despacho)
                this.nomenclaturas = respuesta.data.data;
                
            } else {
                this.nomenclaturas = []
                return
            }
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
                
                 this.alerta = false
            }
            
        },

         limpiarDataArticulosDetalle(){
            this.editedItem.articulos = []
        },

        updateItem () {
            this.editedItem.articulos.forEach((data, i) => {
            data.no_item = i + 1
        })
        },

        eliminar(index){
            this.editedItem.articulos.splice(index, 1)
            this.updateItem()
            if (this.editedItem.articulos.length > 0) {
                this.alerta = false
            } else {
                this.alerta = true
            }
        },

        registrar(){
            if (this.editedItem.articulos.length == 0) {
                Swal.fire({
                icon: 'warning',
                title: 'No se encuentra ningun artículo en el detalle',
                showConfirmButton: false,
                timer: 1500
                }) 
            } else {
                const registrarData = async()=>{
                let perfil = JSON.parse(localStorage.getItem('usuario'))  
                this.editedItem.usuario = perfil.usuario
                if (this.$refs.validacionDetalle.validate() && this.$refs.validacion.validate()) {
                    const respuesta = await API.post('registrar_salida', this.editedItem)
                    if (respuesta.data.ok == true) {
                        const {id} = respuesta.data.data
                        localStorage.setItem('id_solicitud', id)
                        this.mostrarSolicitudPendientes()
                        this.overlay = true
                        setTimeout(()=>{
                            this.overlay = false
                            this.mensajeRegistroExitoso(respuesta.data.exitoso)
                            this.$router.push({path:'/editar_salida'})
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
                return registrarData()
                   
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

        mensajeErrorRegistro(errorRegistro){
            Swal.fire({
                icon: 'error',
                title:errorRegistro,
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

        borrar(){
            this.limmpiarTodosCampos()
        },

        limmpiarTodosCampos(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacionDetalle.resetValidation()
            this.$refs.validacion.reset()
            this.$refs.validacionDetalle.reset()
            this.formulario = 1
            this.editedItem.articulos.length = []
            this.nomenclaturas = []
        },

        btnSiguiente(){
            if (this.$refs.validacion.validate()) {
                this.formulario = 2
            } 
        }


     

        


    },
}
</script>
<style>
#fondo{
     background: #f2f3f4;
 }

 #titulo{
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
 }

 .my-text input{
    text-transform: uppercase;
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
</style>