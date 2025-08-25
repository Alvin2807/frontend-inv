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
                <v-btn
                    color="teal"
                    class="white--text elevation-0"
                    large
                    :loading="loading"
                    :disabled="loading"
                    @click="imprimir()"
                >imprimir
                <v-icon>print</v-icon>
                </v-btn>
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
import mpImg from '@/assets/LogoMP.js'
import logoSPA from '@/assets/logoSPA.js'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
export default {
    data() {
        return {
            formulario:1,
            titulo:-1,
            search:'',
            loading: false,
            cargando:false,
            loader: null,
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
            ],

            desserts: [],
        }
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      },
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

        imprimir(){
            this.loader = 'loading'
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
            doc.setFontSize(15);
            doc.text( x , y, "República de Panamá", 'center').setFont(undefined, 'normal');
            doc.addImage(mpImg , "PNG", 70, 15, 25, 25);
            doc.addImage(logoSPA , "PNG", 97, 15, 30, 25);

            doc.setFont('helvetica', 'italic')
            var xa = 100; var ya = 47;
            doc.setFontSize(15);
            doc.text( xa , ya, "Ministerio Público", 'center').setFont(undefined, 'normal');

            doc.setFont('helvetica', 'italic')
            var xb = 100; var yb = 54;
            doc.setFontSize(15);
            doc.text( xb , yb, "Unidad de Informática de Colón", 'center').setFont(undefined, 'normal');

            doc.setFont('helvetica', 'italic')
            var xf = 100; var yf = 75;
            doc.setFontSize(15);
            doc.text( xf , yf, "ENTREGA DE " + this.editedItem.despacho, 'center').setFont(undefined, 'normal');
           
            doc.setFont('helvetica', 'italic')
            var xfa = 100; var yfa = 83;
            doc.setFontSize(15);
            doc.text( xfa , yfa, this.editedItem.tipo_entrada + ' - ' + this.editedItem.num_solicitud, 'center').setFont(undefined, 'normal');
            
            let datosPDF = []
            let arrayDatos = []
            for (let index = 0; index <this.desserts.length; index++) {
                arrayDatos[0] = this.desserts[index].codigo
                arrayDatos[1] = this.desserts[index].categoria
                arrayDatos[2] = this.desserts[index].marca
                arrayDatos[3] = this.desserts[index].modelo
                arrayDatos[4] = this.desserts[index].color
                arrayDatos[5] = this.desserts[index].cantidad_solicitada
                datosPDF.push(arrayDatos)
                arrayDatos = []
                
            }

            var ladoy = 95 +1
            autoTable(doc,
            {
                styles: {overflow: 'linebreak', fontSize: 10},
                startY: ladoy,
                theme: 'plain',
                tableWidth: 'auto',
                headStyles :{fillColor : [191, 201, 202]},
                head: [['Código', 'Categoría', 'marca', 'Impresora', 'color', 'Cantidad']],
                body: datosPDF
            }
            )

          
            doc.setFont('helvetica', 'italic')
            var xze = 105;  
            y = doc.lastAutoTable.finalY + 10
            doc.setFontSize(15);
            doc.text( xze , y, 'Se entregarón un total de ' + this.editedItem.cantidad_solicitada + ' insumos','left').setFont(undefined, 'normal');

            doc.setFont('helvetica', 'italic')
            var xzey = 105;  
            y = doc.lastAutoTable.finalY + 20
            doc.setFontSize(15);
            doc.text( xzey , y, 'Entregado por: ' + this.editedItem.entregado_por,'left').setFont(undefined, 'normal');

            doc.setFont('helvetica', 'italic')
            var xzex = 105;  
            y = doc.lastAutoTable.finalY + 27
            doc.setFontSize(15);
            doc.text( xzex , y, 'Fecha: ' + this.editedItem.fecha_entrada,'left').setFont(undefined, 'normal');
            /* doc.setFont('helvetica', 'italic')
            var xg = 10; var yg = 95;
            doc.setFontSize(12);
            doc.text( xg , yg, 'Num. Trans:', 'left').setFont(undefined, 'bold'); */

            /* doc.setFont('helvetica', 'italic')
            var xj = 37; var yj = 95;
            doc.setFontSize(12);
            doc.text( xj , yj, this.editedItem.num_solicitud, 'left').setFont(undefined, 'bold'); */

            

           
            }

            addFooters(doc)
            doc.autoPrint();
            doc.output('dataurlnewwindow', this.editedItem.tipo_entrada + ' ' + this.editedItem.num_solicitud); 
    },
    }
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