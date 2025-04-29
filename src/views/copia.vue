<template>
    <v-app id="fondo">
     <v-container>
         <v-card>
             <v-toolbar flat>
                     <v-toolbar-title id="titulo">
                     <span>{{ tituloTabla }}</span>
                     </v-toolbar-title>
                 </v-toolbar>
                 <v-divider></v-divider>
                 <v-card-text>
                     <v-stepper
                         v-model="e6"
                         vertical
                         class="elevation-0"
                     >
                         <v-stepper-step
                             :complete="e6 > 1"
                             step="1"
                             color="#15395A"
                         >
                     
                         Datos Generales
                         </v-stepper-step>
 
                         <v-stepper-content step="1">
                             <v-form ref="validacion">
                                 <v-row>
                                     <v-col
                                         cols="12"
                                         sm="6"
                                         md="2"
                                     >
                                         <v-menu
                                             v-model="menuFecha"
                                             :close-on-content-click="false"
                                             :nudge-left="80"
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
                                     <v-col>
                                        
                                     </v-col>
 
                                 </v-row>
 
                             </v-form>
                             
                         <v-btn
                             color="primary"
                             @click="e6 = 2"
                         >
                             Continue
                         </v-btn>
                         <v-btn text>
                             Cancel
                         </v-btn>
                         </v-stepper-content>
 
                         <v-stepper-step
                         :complete="e6 > 2"
                         step="2"
                         >
                         Configure analytics for this app
                         </v-stepper-step>
 
                         <v-stepper-content step="2">
                         <v-card
                             color="grey lighten-1"
                             class="mb-12"
                             height="200px"
                         ></v-card>
                         <v-btn
                             color="primary"
                             @click="e6 = 3"
                         >
                             Continue
                         </v-btn>
                         <v-btn text>
                             Cancel
                         </v-btn>
                         </v-stepper-content>
 
                         <v-stepper-step
                         :complete="e6 > 3"
                         step="3"
                         >
                         Select an ad format and name ad unit
                         </v-stepper-step>
 
                         <v-stepper-content step="3">
                         <v-card
                             color="grey lighten-1"
                             class="mb-12"
                             height="200px"
                         ></v-card>
                         <v-btn
                             color="primary"
                             @click="e6 = 4"
                         >
                             Continue
                         </v-btn>
                         <v-btn text>
                             Cancel
                         </v-btn>
                         </v-stepper-content>
 
                         <v-stepper-step step="4">
                         View setup instructions
                         </v-stepper-step>
                         <v-stepper-content step="4">
                         <v-card
                             color="grey lighten-1"
                             class="mb-12"
                             height="200px"
                         ></v-card>
                         <v-btn
                             color="primary"
                             @click="e6 = 1"
                         >
                             Continue
                         </v-btn>
                         <v-btn text>
                             Cancel
                         </v-btn>
                         </v-stepper-content>
                     </v-stepper>
                 </v-card-text>
         </v-card>
       <!--  <v-toolbar flat>
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
         class="elevation-1"
         >
         <template v-slot:[`item.cantidad_solicitada`]="props">
             <v-row>
                 <v-col
                 cols="12"
                 sm="6"
             >
                 <v-text-field
                     v-model="props.item.cantidad_solicitada"
                     outlined
                     label="Cantidad"
                     @input="getdata"
                     type="number"
                     :min="1"
                     class="mt-2"
                     :rules="props.item.checkear ? numberRule : []"
                    
                 >
                 </v-text-field>
             </v-col>
             <v-checkbox
                 v-model="props.item.checkear"
                 class="mx-10"
                 value="Seleccionado"
                
                 
                 @click="elegir(props.item)"
             >p
             </v-checkbox>
             </v-row>
            
         </template>
         </v-data-table> -->
 
     </v-container>
     
   
    </v-app>
 </template>
 <script>
 import API from '@/api'
 import { mapState } from 'vuex'
 export default {
    
   data() {
     return {
         search:'',
         e6: 1,
         titulo:-1,
         menuFecha:false,
         nowDate: new Date().toISOString().slice(0,10),
         despachos:[],
         headers: [
         { text: 'Categoría', sortable: false, value: 'categoria', class: "white--text grey darken-3"},
         { text: 'Código', value: 'codigo',class: "white--text grey darken-3"},
         { text: 'Referencia', value: 'referencia', class: "white--text grey darken-3"},
         { text: 'Marca', value: 'marca', class: "white--text grey darken-3", sortable:false},
         { text: 'Impresora', value: 'modelo', class: "white--text grey darken-3"},
         { text: 'Color', value: 'color', class: "white--text grey darken-3", sortable:false},
         { text: 'Cantidad Solicitada', value: 'cantidad_solicitada',class: "white--text grey darken-3"},
         { text: '¿Seleccionar artículo?', value: 'checkear',class: "white--text grey darken-3"},
       
       ],
       desserts: [],
       numberRule: 
       [
           value => !!value || 'Campo obligatorio.',
           v => v > 0 || 'El valor debe ser mayor a cero'
       ],
       
   },
    /*  mounted() {
         this.informacion()
     }, */
 
   computed: {
     ...mapState(['loginDatos']),
     tituloTabla(){
         return this.titulo === -1 ? 'Solicitud de Entrada' : ''
     },
 
     fecha_entrada: {
         get() {
             return this.formatoFechaEntrada(this.editedItem.fecha_entrada)
         },
         set() {
             this.editedItem.fecha_entrada = null
         }
     },
     
   },
  
   methods: {
     informacion(){
         const usuario = localStorage.getItem('usuario');
         if (!usuario) {
             this.$router.push({path:'/'})
         }
 
         this.loginDatos.usuario = usuario
         this.mostrarData()
     },
     getdata() {
       console.log(this.desserts[0].cantidad_solicitada);
     },
     mostrarData(){
         this.mostrarDespachos()
         this.mostrarArticulos()
     },
 
         async mostrarDespachos(){
             const respuesta = await API.get('despachos_por_entrada')
             this.despachos = respuesta.data.data
             return
         },
 
         async mostrarArticulos(){
             //this.cargando = true
             const respuesta = await API.get('articulos')
             this.desserts = respuesta.data.data
             //this.cargando = false
             //this.editedItem.articulos = []
             return
         },
 
         elegir(props){
             console.log(props);
             
         }
 }
 }
 </script>
 <style scoped>
 #fondo{
     background: #f2f3f4;
 }
 
 #titulo{
     font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
 }
 
 .my-text input{
     text-transform: uppercase;
 }
 </style>