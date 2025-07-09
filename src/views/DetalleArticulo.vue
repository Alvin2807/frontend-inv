<template>
    <v-app id="fondo">
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
              <v-btn
                color="teal"
                class="white--text elevation-0"
                large
                @click="imprimir()"
              >imprimir
              <v-icon>print</v-icon>
              </v-btn>
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
                      @change="verMes()"
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
import { jsPDF } from "jspdf";
import mpImg from '@/assets/LogoMP.js'
import logoSPA from '@/assets/logoSPA.js'
import autoTable from 'jspdf-autotable'
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
            totalItem:'',
            selectedOption: '',
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
        },

        imprimir(){
          this.totalItem = this.total;
            const fecha = new Date();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const año = fecha.getFullYear();
            const fechaEnNumero = `${dia}/${mes}/${año}`;

          
            const doc = new jsPDF("a4");
            const pageCount = doc.internal.getNumberOfPages()
            const addFooters = doc =>{
                for (var i = 1; i <= pageCount; i++) {
                    doc.setPage(i)
                    doc.text('Página ' + String(i) + ' de ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
                        align: 'center'
                    })
                }

              doc.setFont('helvetica', 'italic')
              var xc = 3; var yc = 3;
              doc.setFontSize(10);
              doc.text( xc , yc, 'Impresión: ' + fechaEnNumero, 'left').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var x = 100; var y = 10;
              doc.setFontSize(12);
              doc.text( x , y, "República de Panamá", 'center').setFont(undefined, 'normal');
              doc.addImage(mpImg , "PNG", 70, 15, 25, 25);
              doc.addImage(logoSPA , "PNG", 97, 15, 30, 25);

              doc.setFont('helvetica', 'italic')
              var xa = 100; var ya = 47;
              doc.setFontSize(12);
              doc.text( xa , ya, "Ministerio Público", 'center').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xb = 100; var yb = 54;
              doc.setFontSize(12);
              doc.text( xb , yb, "Unidad de Informática de Colón", 'center').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xf = 100; var yf = 62;
              doc.setFontSize(10);
              doc.text( xf , yf, "DETALLE DE ENTRADA - " + this.editedItem.categoria + ' ' + this.editedItem.codigo, 'center').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xg = 10; var yg = 80;
              doc.setFontSize(10);
              doc.text( xg , yg, 'Código:', 'left').setFont(undefined, 'bold');

              doc.setFont('helvetica', 'italic')
              var xj = 25; var yj = 80;
              doc.setFontSize(10);
              doc.text( xj , yj, this.editedItem.codigo, 'left').setFont(undefined, 'bold');

              doc.setFont('helvetica', 'italic')
              var xk = 10; var yk = 90;
              doc.setFontSize(10);
              doc.text( xk , yk, 'Marca:', 'left').setFont(undefined, 'normal');

              var lxa = 10; // largo x
              var lyiza = 72; // largo y izquierdo
              var lydra = 72; // largo y derecho
              var anchoa = 205;
              doc.line(lxa, lyiza, anchoa, lydra).setFont(undefined, 'bold');
              doc.setLineWidth(0.1);

              var lxas = 10; // largo x
              var lyizas = 115; // largo y izquierdo
              var lydras = 115; // largo y derecho
              var anchoas = 205;
              doc.line(lxas, lyizas, anchoas, lydras).setFont(undefined, 'bold');
              doc.setLineWidth(0.1);

              doc.setFont('helvetica', 'italic')
              var xn = 25; var yn = 90;
              doc.setFontSize(10);
              doc.text( xn , yn, this.editedItem.marca, 'left').setFont(undefined, 'bold');

              doc.setFont('helvetica', 'italic')
              var xy = 10; var yy = 100;
              doc.setFontSize(10);
              doc.text( xy , yy, 'Impresora:', 'left').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xw = 30; var yw = 100;
              doc.setFontSize(10);
              doc.text( xw , yw, this.editedItem.modelo, 'left').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xr = 10; var yr = 110;
              doc.setFontSize(10);
              doc.text( xr , yr, 'Color:', 'left').setFont(undefined, 'normal');

              doc.setFont('helvetica', 'italic')
              var xz = 25; var yz = 110;
              doc.setFontSize(10);
              doc.text( xz , yz, this.editedItem.color, 'left').setFont(undefined, 'normal');

                  let datosPDF = []
                  let arrayDatos = []
                    for (let index = 0; index <this.desserts.length; index++) {
               
                      arrayDatos[0] = this.desserts[index].fecha_entrada
                      arrayDatos[1] = this.desserts[index].tipo_entrada
                      arrayDatos[2] = this.desserts[index].num_solicitud
                      arrayDatos[3] = this.desserts[index].entregado_por
                      arrayDatos[4] = this.desserts[index].despacho
                      arrayDatos[5] = this.desserts[index].mes
                      arrayDatos[6] = this.desserts[index].cantidad_solicitada
                      datosPDF.push(arrayDatos)
                      arrayDatos = []
                        
                    }

                    var ladoy = 118 +1
                    autoTable(doc,
                    {
                        styles: {overflow: 'linebreak', fontSize: 10},
                        startY: ladoy,
                        theme: 'grid',
                        tableWidth: 'auto',
                        headStyles :{fillColor : [44, 62, 80]},
                        head: [['Fecha de Entrada','Tipo de Entrada','Num. de Solicitud','Entregado Por','Despacho','Mes','cantidad']],
                        body: datosPDF
                    }
                    )

                    doc.setFont('helvetica', 'italic')
                    var xze = 125;  
                    y = doc.lastAutoTable.finalY + 10
                    doc.setFontSize(15);
                    doc.text( xze , y, 'Total: ' + this.totalItem + ' Unidades entradas','left').setFont(undefined, 'normal');

            }
            addFooters(doc)
            doc.autoPrint();
            doc.output('dataurlnewwindow', 'DETALLE ' + this.editedItem.categoria + ' ' + this.editedItem.codigo); 
          
        },

        verMes(){
         
          const words = this.desserts;
          const result = words.filter((mes) => mes.mes == this.search);
          this.desserts = result;
          if (this.desserts == '') {
           return this.desserts = this.editedItem.detalles
          }
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

#fondo{
     background: #f2f3f4;
 }

</style>