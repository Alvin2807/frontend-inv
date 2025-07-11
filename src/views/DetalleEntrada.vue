<template>
   <v-app id="fondo">
    <v-container>
        <v-stepper
            v-model="formulario"
            vertical
        >
            <v-toolbar flat id="titulo">
              <v-toolbar-title>
                {{ tituloFormulario }} CON NÚMERO DE SOLICITUD {{ editedItem.num_solicitud }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
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
                    <v-form>
                        <v-row>
                            <v-col 
                                cols="12"
                                sm="2"
                            >
                                <v-text-field
                                    label="Fecha de Entrada"
                                    v-model="editedItem.fecha_entrada"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    readonly
                                >
                                </v-text-field>
                            </v-col>
                            <v-col 
                                cols="12"
                                sm="3"
                            >
                                <v-text-field
                                    label="Tipo de Entrada"
                                    v-model="editedItem.tipo_entrada"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    readonly
                                >
                                </v-text-field>
                            </v-col>
                            <v-col 
                                cols="12"
                                sm="3"
                            >
                                <v-text-field
                                    label="Número de Solicitud"
                                    v-model="editedItem.num_solicitud"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    readonly
                                >
                                </v-text-field>
                            </v-col>
                            <v-col 
                                cols="12"
                                sm="3"
                            >
                                <v-text-field
                                    label="Entregado Por"
                                    v-model="editedItem.entregado_por"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    readonly
                                >
                                </v-text-field>
                            </v-col>
                            <v-col 
                                cols="12"
                                sm="12"
                            >
                                <v-text-field
                                    label="Despacho"
                                    v-model="editedItem.despacho"
                                    type="text"
                                    autocomplete="off"
                                    dense
                                    color="#15395A"
                                    class="text-md-body-1 my-text"
                                    readonly
                                >
                                </v-text-field>
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
            <h3 id="datosFormulario">Detalle de Solicitud</h3>
            </v-stepper-step>

            <v-stepper-content step="2">
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
                 <h2>Cantidad Entrada:({{ editedItem.cantidad_solicitada }})</h2>
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

                </v-data-table>
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
    </v-container>

   </v-app>
</template>
<script>
import { mapState } from 'vuex';
import API from '@/api'
export default {
    data() {
        return {
            formulario:1,
            titulo:-1,
            search:'',
            cargando:false,
            editedItem:{
                articulos:[
                    {

                    }
                ],
            },
            headers: 
            [
                {text:'Código', value: 'codigo',class: "white--text grey darken-3"},
                {text:'Categoría', value: 'categoria',class: "white--text grey darken-3"},
                {text:'Marca', value: 'marca',class: "white--text grey darken-3"},
                {text:'Impresora', value: 'modelo',class: "white--text grey darken-3"},
                {text:'Color', value: 'color',class: "white--text grey darken-3"},
                {text:'Cantidad', value: 'cantidad_solicitada',class: "white--text grey darken-3"},
                /*  {text:'Tipo de Entrada', value: 'tipo_entrada',class: "white--text grey darken-3"},
                {text:'Núm. de solicitud', value: 'num_solicitud',class: "white--text grey darken-3"},
                {text:'Entregado Por', value: 'entregado_por',class: "white--text grey darken-3"},
                {text:'Despacho', value: 'despacho',class: "white--text grey darken-3"},
                {text:'Mes', value: 'mes',class: "white--text grey darken-3"},
                {text:'Cantidad', value: 'cantidad_solicitada',class: "white--text grey darken-3", filterable:false}, */
            ],

            desserts: [],
        }
    },

    computed: {
      ...mapState(['loginDatos','datos']),
      tituloFormulario(){
        return this.titulo === -1 ? 'DETALLE DE ENTRADA' : '';
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
            this.mostrarData();
           /*  this.MostrarMesesEntrada()
            this.MesesEntrada() */
           
        },

         async mostrarData(){
           
            const detalleEntrada = localStorage.getItem('id_solicitud')
            if (! detalleEntrada) {
                this.$router.push({path:'/'})
            }
            const respuesta = await API.get('detalle_de_entrada/' + detalleEntrada)
            this.editedItem = respuesta.data.data;
            this.cargando = true
            this.desserts = this.editedItem.articulos;
            this.cargando = false
            return
        },
    },
}
</script>
<style>
#titulo{
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
 }

 #datosFormulario{
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  font-size:15px;
}

.my-text input{
    text-transform: uppercase;
}

#fondo{
     background: #f2f3f4;
 }

</style>