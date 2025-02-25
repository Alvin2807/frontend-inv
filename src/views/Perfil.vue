<template>
    <div>
        <sistema-menu/>
        
    </div>
    
</template>
<script>
import SistemaMenu from '../components/SistemaMenu.vue' 
import { mapState } from 'vuex';
export default {
    components:{
        SistemaMenu
    },
    data() {
        return {
           titulo:-1,
        }
    },

    computed: {
       ...mapState(['loginDatos']),
       tituloData(){
        return this.titulo === -1 ? 'Bienvenido a' : ''
       }
    },
}
</script>