<template>
    <v-app id="fondo">
        <v-container  fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md3>
                    <v-card class="elevation-5 rounded-lg">
                        <v-card-title>
                            <v-spacer></v-spacer>
                            <img  height="100px"  :src="require('../assets/ministerio.png')"/>
                            <img  class="mx-5"  height="100px" :src="require('../assets/sistema.png')" />
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <v-toolbar flat>
                            <v-toolbar-title class="mx-auto">
                                <span id="titulo">
                                {{ tituloSistema }}
                            </span>
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="validacion">
                                <v-row>
                                    <v-col
                                        cols="12"
                                        sm="12"
                                    >
                                    <v-text-field
                                        v-model="editedItem.usuario"
                                        outlined
                                        label="Usuario"
                                        type="text"
                                        color="#15395A"
                                        prepend-inner-icon="person"
                                        :rules="reglasValidacion"
                                        autocomplete="off"
                                        dense
                                    >
                                    </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                    <v-text-field
                                        v-model="editedItem.password"
                                        :type="showPassword ? 'text' : 'password'"
                                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                        @click:append="showPassword = ! showPassword"
                                        outlined
                                        label="Contraseña"
                                        color="#15395A"
                                        prepend-inner-icon="lock"
                                        autocomplete="off"
                                        dense
                                        :rules="reglasValidacion"
                                    >
                                    </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                block
                                x-large
                                color="#15395A"
                                class="white--text"
                                :loading="loading"
                                :disabled="loading"
                                @click="acceder()"
                            >
                            acceder
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        <v-footer 
            padless
            color="blue-grey darken-4"
            class="white--text"
        >
        <v-col
            class="text-center"
            cols="12"
        >
         {{ new Date().getFullYear() }} — <strong>Unidad de Informática Colón</strong>
        </v-col>
        </v-footer>
    </v-app>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import API from '@/api'
export default {
    data() {
        return {
            titulo:-1,
            showPassword: false,
            loader: null,
            loading: false,
            alert:true,
            alert2:true,
            invalida:'',
            errorLogin:'',
            reglasValidacion: [
                (v) => !!v || 'Campo obligatorio',
            ],
            editedItem:{
                usuario:'',
                password:''
            }
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

    computed: {
        ...mapState(['loginDatos']),
        tituloData(){
            return this.titulo === -1 ? 'Unidad de Informática de Colón' : ''
        },

        tituloSistema(){
            return this.titulo === -1 ? 'Sistema de Inventario Insumos' : ''
        },

        usuarioInvalido(){
            return this.invalida;
        },

        usuarioError(){
            return this.errorLogin;
        }
    },

    mounted() {
        this.alert = false
        this.alert2 = false
    },

    methods: {
        ...mapMutations(['mostrarDetallesLogin']),
       acceder(){
            if (this.$refs.validacion.validate()) {
                this.loader = 'loading'
                API.post('iniciar_sesion', this.editedItem)
                .then(respuesta=>{
                    if (respuesta.data.ok == true) {
                        this.mostrarDetallesLogin(respuesta.data.data)
                        localStorage.setItem('usuario', JSON.stringify(respuesta.data.data))
                        this.$router.push({path:'/inicio'})
                    
                    } else if (respuesta.data.ok == false) {
                        this.errorLogin = respuesta.data.error
                        this.alert2 = true
                    } else {
                        this.invalida = respuesta.data.message
                        this.alert = true
                    }
                })
                
            }
            
        }
    },
}
</script>
<style>
#titulo{
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 25px;
    color: #030213bd;
    font-weight: bold;
}
#fondo{
    background: linear-gradient(#010520bd, #8bb5c5), rgba(0,0,0,0.8);
}
#formulario{
    border-left: solid 10px #15395A;
}
</style>