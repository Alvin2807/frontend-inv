<template>
    <v-app id="fondo">
        <v-container fill-height fluid>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md3>
                    <v-card class="elevation-5" id="formulario">
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                                <img  class="mt-8" height="80px"  :src="require('../assets/ministerio.png')"/>
                                <img  class="mx-3 mt-8"  height="80px" :src="require('../assets/sistema.png')" />
                         
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-title class="mt-5">
                            <span id="titulo" class="mx-auto">
                                {{ tituloData }}
                            </span>
                        </v-card-title>
                       
                           
                       
                        <v-card-text>
                            <v-form>
                            <v-row class="mt-1">
                                <v-col
                                cols="12"
                                sm="12"
                                >
                                <v-text-field
                                    v-model="editedItem.usuario"
                                    filled
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
                                    filled
                                    label="Contraseña"
                                    type=password
                                    color="#15395A"
                                    prepend-inner-icon="password"
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
                            <v-spacer></v-spacer>
                                <v-btn class="elevation-0" color="#15395A" dark
                                    @click="acceder()"
                                >
                                <v-icon class="mx-1">login</v-icon>
                                acceder
                                </v-btn>
                        </v-card-actions>

                    </v-card>

                </v-flex>

            </v-layout>

        
        </v-container>
    </v-app>
</template>
<script>
export default {
    data() {
        return {
            titulo:-1,
            reglasValidacion: [
                (v) => !!v || 'Campo obligatorio',
            ],
            editedItem:{
                usuario:'',
                password:''
            }
        }
    },

    computed: {
        tituloData(){
            return this.titulo === -1 ? 'Sistema Inventario de Insumos' : ''
        }
    },

    methods: {
        acceder(){
            this.$router.push({path:'/inicio'})
        }
    },
}
</script>
<style>
#titulo{
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    font-size: 25px;
}
#fondo{
    background: linear-gradient(#ec8f8f,#467aac);
}
#formulario{
    border-left: solid 10px #15395A;
}
</style>