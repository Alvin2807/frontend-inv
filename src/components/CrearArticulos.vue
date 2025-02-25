<template>
    <v-card>
        <v-toolbar flat>
            <v-spacer></v-spacer>
                <v-btn
                    id="btnCerrar"
                    class="elevation-0"
                    @click="cerrarModalArticulo()"
                >
                X
                </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-title>
            <span>{{ tituloCrear }}</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="validacion">
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
                            @change="mostrarModelosArticulos()"
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
                :loading="btnRegistrar"
                class="white--text"
                @click="registrar()"
            >
            registrar
            </v-btn>
        </div>
        </v-card-actions>
    </v-card>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import API from '@/api'
import { mapState } from 'vuex';
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    props: {
        solicitudArticulo: {
            type: Number,
            default: 0
        },

    },
    data() {
        return {
            titulo:-1,
            btnRegistrar:false,
            loader:null,
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
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloCrear(){
            return this.titulo === -1 ? 'Crear Artículo' : ''
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
            this.mostrarData()
        },

        limpiarModal(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacion.reset()
        },

        cerrarModalArticulo: function () {
            this.$emit('cerrarModalArticulo');
            this.limpiarModal()
        },

        mostrarData(){
            this.mostrarCategorias()
            this.mostrarCategorias()
            this.mostrarMarcas()
            this.mostrarColores()
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

        async mostrarModelosArticulos(){
            if (this.editedItem.fk_marca !== null) {
                const respuesta = await API.get('select_modelo_marca/' + this.editedItem.fk_marca)
                this.modelos = respuesta.data.data;
                
            } else {
                this.modelos = []
                return
            }
        },
        

        registrar(){
            if (this.$refs.validacion.validate()) {
                //Obtener el usuario logueado
                let perfil = JSON.parse(localStorage.getItem('usuario'))
                this.loader = 'btnRegistrar'
                this.editedItem.usuario = perfil.usuario
                try {
                    API
                    .post('articulos', this.editedItem)
                    .then(respuesta=>{
                       if (respuesta.data.ok == true) {
                           if (respuesta.data.existeArticulo) {
                            this.mensajeRegistroExiste(respuesta.data.existeArticulo)
                           } else {
                            this.mensajeRegistraExitoso(respuesta.data.exitosoArticulo)
                            this.cerrarModalArticulo()
                            this.$emit('mostrarArticulos')
                           }
                       } else if (respuesta.data.ok == false) {
                            this.mensajeRegistroError(respuesta.data.errorArticulo) 
                       }
                    })
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error consulte con el administrador del sistema',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
            
        },

        mensajeRegistraExitoso(exitosoArticulo){
            Swal.fire({
                icon:'success',
                text:exitosoArticulo,
                showConfirmButton: false,
                timer:1500
            })

        },

        mensajeRegistroExiste(existeArticulo){
            Swal.fire({
                icon:'warning',
                text:existeArticulo,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeRegistroError(errorArticulo){
            Swal.fire({
                icon:'error',
                title:errorArticulo,
                showConfirmButton:false,
                timer:2000
            })
        }
    },
}
</script>