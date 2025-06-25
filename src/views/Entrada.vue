<template>
    <v-app id="fondo">
        <v-container>
            <v-stepper
                v-model="formulario"
                vertical
            >
                <v-toolbar flat id="titulo">
                    <v-toolbar-title>
                        {{ tituloFormulario }} ({{ tipo_entrada }}) 
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
                       </v-form>
                    </v-card-text>
                </v-card>
                <v-btn
                    color="#15395A"
                    dark
                    @click="formulario = 2"
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
                <h3 id="datosFormulario">Detalles de Artículos({{  cantArrayArticulo }})</h3>
               
                </v-stepper-step>

                <v-stepper-content step="2">
                <v-card>
                    <v-card-text>
                    <v-alert
                        dense
                        type="warning"
                        text
                        v-model="alerta"
                    >
                        No se encontro ningún <strong>artículo</strong> en el detalle
                    </v-alert>
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
                        <v-btn
                            color="#15395A"
                            dark
                            @click="formulario = 1"
                        >
                            atras
                            <v-icon>skip_previous</v-icon>
                        </v-btn>
                       
                    </v-card-text>
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
import API from '@/api'
import { mapState, mapActions } from 'vuex'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    
    data() {
        return {
            formulario:1,
            titulo:-1,
            botones:null,
            menuFecha:false,
            tipo_entrada:'',
            nowDate: new Date().toISOString().slice(0,10),
            editeIndex:-1,
            cargando:false,
            search:'',
            alerta:false,
            menu2: false,
            modal2: false,
            overlay:false,
            opacity:0,
            despachos:[],
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
            numberRule: 
            [
                value => !!value || 'Campo obligatorio.',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],
            reglaNum:
            [
                value => !!value || 'Campo obligatorio.',
                value => (value && value.length == 10) || 'El campo debe de tener maximo 10 caracteres',
                v => v > 0 || 'El valor debe ser mayor a cero'
            ],
            editedItem:{
                fecha_entrada:null,
                fk_despacho:'',
                fk_tipo_solicitud:1,
                fk_tipo_entrada:'',
                tipo_accion:'ENTRADA',
                usuario:'',
                entregado_por:'',
                num_solicitud:'',
                mes:'',
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
        }
    },

    mounted() {
        this.informacion()
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloFormulario(){
            return this.titulo === -1 ? 'SOLICITUD DE ENTRADA' : '';
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


        limpiarDataArticulosDetalle(){
            this.editedItem.articulos = []
        },

        async mostrarArticulos(){
             this.cargando = true
             const respuesta = await API.get('articulos')
             this.desserts = respuesta.data.data
             this.cargando = false
             if (this.editedItem.articulos.length == 0) {
                this.alerta = true
             }
             return
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

        getSolicitudEntrada(){
            if (this.editedItem.fk_despacho !== null) {
                let objEntrada = this.tipo_entradas.find(data =>data.fk_despacho === this.editedItem.fk_despacho)
                this.tipo_entrada = objEntrada.tipo_entrada;
                this.editedItem.fk_tipo_entrada = objEntrada.id_tipo_entrada;
            } else {
                this.tipo_entrada = null
            }
        },

        updateItem () {
            this.editedItem.articulos.forEach((data, i) => {
            data.item = i + 1
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

        registrar(){
            let perfil = JSON.parse(localStorage.getItem('usuario'))  
            this.editedItem.usuario = perfil.usuario
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
                    if (this.$refs.validarDetalle.validate() && this.$refs.validacion.validate()){
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
        

            mensajeInfoNoExisteArticuloDetalle(){
                Swal.fire({
                    icon: 'info',
                    title: 'Faltan campos obligatorios o no hay ningún atrículo en el detalle',
                    showConfirmButton: false,
                    timer: 2000
                })
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

            limmpiarTodosCampos(){
                this.$refs.validacion.resetValidation()
                this.$refs.validarDetalle.resetValidation()
                this.$refs.validacion.reset()
                this.$refs.validarDetalle.reset()
                this.formulario = 1
                this.editedItem.articulos.length = []
            },

            borrar(){
               this.limmpiarTodosCampos()
            },
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