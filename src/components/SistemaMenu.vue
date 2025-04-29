<template>
    <v-app>
            <v-navigation-drawer
                v-model="drawer"
                app
            >
                <template v-slot:prepend>
                    <v-list-item two-line>
                        <v-list-item-avatar>
                           <v-icon size="50px">account_circle</v-icon>
                        </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ loginDatos.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ loginDatos.apellido }}</v-list-item-subtitle>
                    </v-list-item-content>
                    </v-list-item>
                </template>
                <v-divider></v-divider>

                <v-list-item>
                    <v-list-item-content>
                    <v-list-item-title class="text-md-body-1">
                        <v-icon>menu</v-icon> Menu
                    </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list>
                <v-list-group
                    v-for="item in items"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                    color="#15395A"
                >
                    <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="child in item.items"
                        :key="child.title"
                        link
                        color="#15395A"
                        :to="child.path"

                    >
                    <v-list-item-content>
                        <v-list-item-title>{{ child.title }}</v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                </v-list>

                
            </v-navigation-drawer>
           

            <v-app-bar app color="#15395A" dark>
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

                <v-spacer></v-spacer>
                <v-toolbar-title>
                    <img height="50px" :src="require('../assets/ministerio.png')"/>
                    <span>{{ tituloData }}</span>
                    <img height="50px" :src="require('../assets/sistema.png')"/>
                </v-toolbar-title>
                
                <v-spacer></v-spacer>
                <v-tab>
                    <v-badge
                    color="red"
                    :content=contarSolicitudes
                    class="mr-8"
                    v-if="contarSolicitudes > 0"
                >
                    <v-icon
                        @click="verNotificacion()"
                    >
                        notifications_active
                    </v-icon>
                    </v-badge>
                </v-tab>
            </v-app-bar>
            <v-overlay
                :value="overlay"
                :opacity="opacity"
            >
            <v-progress-circular
                indeterminate
                size="180"
                width="15"
                color="#000080"
            >
            </v-progress-circular>
            </v-overlay>
            <router-view/>
    </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            titulo:-1,
            drawer:null,
            loader:null,
            overlay:false,
            opacity:0,
            items: 
            [
                {
                action: 'mdi-ticket',
                items: 
                    [
                        { title: 'Artículos', path:'/articulos'}
                    ],
                title: 'Parametros',
                },

                {
                action: 'description',
                items: 
                    [
                        { title: 'Crear Entrada', path:'/crear-solicitud-de-entrada'}
                    ],
                title: 'Solicitudes',
                },

            ],
        }
    },

    computed: {
        
        ...mapState(['loginDatos','pendientes']),
        tituloData(){
            return this.titulo === -1 ? 'Sistema Inventario de Insumos' : ''
        },

        contarSolicitudes(){
            return this.pendientes
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
       this.mostrarPerfilLogin()
    },

    methods: {
        ...mapMutations(['mostrarDetallesLogin']),
        ...mapActions(['mostrarSolicitudPendientes']),
        mostrarPerfilLogin(){
            const detallesLogin = localStorage.getItem('usuario');
            this.mostrarDetallesLogin(JSON.parse(detallesLogin))
            this.mostrarSolicitudPendientes()
            window.location.hash="no-back-button";
            window.location.hash="Again-No-back-button";//esta linea es necesaria para chrome
            window.onhashchange=function(){window.location.hash="";}

        },
        
        verNotificacion(){
            if (this.$route.name !== 'navbar')
            if (this.pendientes === 0) {
                this.mensajeNotificacion()()
            
            } else { 
                this.overlay = true
                setTimeout(() => {
                    this.overlay = false
                    this.$router.push("/solicitudes-pendientes").catch(()=>{});
                }, 
                3000
                )
            }
        },

        mensajeNotificacion(){
            Swal.fire({
                icon: 'info',
                title: 'No hay solicitudes de orden de compra pendientes',
                showConfirmButton:false,
                timer: 1000
            })
        }
    },
}
</script>