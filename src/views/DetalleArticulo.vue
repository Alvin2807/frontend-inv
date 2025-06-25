<template>
    <v-app>
      <v-container>
        <template>
          <v-stepper
            v-model="formulario"
            vertical
          >
            <v-toolbar flat id="titulo">
              <v-toolbar-title>
                {{ tituloFormulario }} - {{ editedItem.categoria }} DE LA IMPRESORA {{ editedItem.modelo }} {{ editedItem.color }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn></v-btn>
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
                  <v-form>
                    <v-row>
                      <v-col 
                        cols="12"
                        sm="2"
                      >
                        <v-text-field
                          label="Código"
                          v-model="editedItem.codigo"
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
                          label="Referencia"
                          v-model="editedItem.referencia"
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
                        sm="4"
                      >
                        <v-text-field
                          label="Categoría"
                          v-model="editedItem.categoria"
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
                          label="Marca"
                          v-model="editedItem.marca"
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
                          label="Impresora"
                          v-model="editedItem.modelo"
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
                        sm="2"
                      >
                        <v-text-field
                          label="Color"
                          v-model="editedItem.color"
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
            <h3 id="datosFormulario">Detalle del Artículo</h3>
            </v-stepper-step>

            <v-stepper-content step="2">
                <v-tabs horizontal color="#15395A">
                  <v-tab>
                   
                   Busqueda por mes
                  </v-tab>
                 
                  <v-tab-item>
                     <v-toolbar flat>
                <v-spacer></v-spacer>
                <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-autocomplete
                      label="Buscar por mes"
                      v-model="search"
                      :items="mesesEntradas"
                      item-value="mes"
                      item-text="mes"
                      type="text"
                      autocomplete="off"
                      dense
                      color="#15395A"
                      class="text-md-body-1 my-text mt-3"
                      no-data-text="No hay datos disponibles"
                      clearable
                    >
                    </v-autocomplete>
                </v-col>
               
                </v-toolbar>
                    <h2>Cantidad Entrada:({{ total }})</h2>
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
                  </v-tab-item>
                </v-tabs>
            
               
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
        </template>

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
            cargandoDatos:false,
            buscar:'',
            menuFecha:false,
            headers: 
            [
                {text:'Fecha de Entrada', value: 'fecha_entrada',class: "white--text grey darken-3"},
                {text:'Tipo de Entrada', value: 'tipo_entrada',class: "white--text grey darken-3"},
                {text:'Núm. de solicitud', value: 'num_solicitud',class: "white--text grey darken-3"},
                {text:'Entregado Por', value: 'entregado_por',class: "white--text grey darken-3"},
                {text:'Despacho', value: 'despacho',class: "white--text grey darken-3"},
                {text:'Mes', value: 'mes',class: "white--text grey darken-3"},
                {text:'Cantidad', value: 'cantidad_solicitada',class: "white--text grey darken-3", filterable:false},
             
                
            
            ],

            desserts: [],
            meses:[],
            mesesEntradas:[],
            editedItem:{
              detalles:
              [
                {

                }
              ]
            },
        }
    },

    computed: {
      ...mapState(['loginDatos','datos']),
      tituloFormulario(){
        return this.titulo === -1 ? 'DETALLE DE ENTRADA' : '';
      },

      filteredItems() {
        if (!this.search) {
          return this.desserts;
        }
        const searchTerm = this.search.toLowerCase();
        return this.desserts.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          )
        );
    },

      total() {
       return this.filteredItems.reduce((sum, item) => sum + item.cantidad_solicitada, 0);
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
            this.MostrarMesesEntrada()
            this.MesesEntrada()
        },

        async mostrarData(){
            const detalleArticulo = localStorage.getItem('id_articulo')
            if (! detalleArticulo) {
                this.$router.push({path:'/'})
            }
            const respuesta = await API.get('detalle_de_entrada_articulo/' + detalleArticulo)
            this.editedItem = respuesta.data.data;
            this.desserts = this.editedItem.detalles;
            return
        },

        async MostrarMesesEntrada(){
          this.cargandoDatos = true
          const respuesta = await API.get('meses_articulos_entradas/' + localStorage.getItem('id_articulo'))
          this.meses = respuesta.data.data
          this.cargandoDatos = false
          return
        },

         async MesesEntrada(){
          const respuesta = await API.get('meses_entrada/' + localStorage.getItem('id_articulo'))
          this.mesesEntradas = respuesta.data.data
          return
        }

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

</style>