import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    datos:
    {
      id_solicitud:''
    },
    loginDatos: {
      apellido: '',
      cedula: '',
      correo: '',
      nombre: '',
      usuario: '',

  },
    loginInfo:'',
    pendientes: '',
  },
  getters: {
  },
  mutations: {
    accederLogin(state, payload){
      state.loginInfo = payload
    },

    mostarAriculosPendientes(state, payload) {
      state.datos = payload
    },

    mostrarDetallesLogin(state, payload) {
      state.loginDatos = payload
    },

    totalSolicitud(state, payload) {
      state.pendientes = payload
      state.Pendientes = payload
    },
    
  },
  actions: {
    iniciarSession(context){
      API 
      .post('iniciar_sesion')
      .then(respuesta=>{
        context.commit('accederLogin', respuesta.data)
      })
    },

    mostrarSolicitudPendientes(context){
      API.get('solicitudes')
      .then(respuesta=>{
        context.commit('totalSolicitud', respuesta.data.Pendientes)
      })
    }
  },
  modules: {
  }
})
