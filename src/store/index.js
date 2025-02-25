import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginDatos: {
      apellido: '',
      cedula: '',
      correo: '',
      nombre: '',
      usuario: '',

  },
    loginInfo:''
  },
  getters: {
  },
  mutations: {
    accederLogin(state, payload){
      state.loginInfo = payload
    },

    mostrarDetallesLogin(state, payload) {
      state.loginDatos = payload
    },
    
  },
  actions: {
    iniciarSession(context){
      API 
      .post('iniciar_sesion')
      .then(respuesta=>{
        context.commit('accederLogin', respuesta.data)
      })
    }
  },
  modules: {
  }
})
