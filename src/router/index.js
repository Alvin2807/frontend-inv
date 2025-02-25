import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component:Login
  },
  {
    path: '/inicio',
    name: 'Inicio',
    component: () => import('../views/Inicio.vue'),
    meta: {requireAuth: true},
    children: 
    [

      {
          path: '/articulos',
          name: 'Articulos',

          component: () =>
              import ('../views/Articulos.vue'),
          //meta: { requireAuth: true }
      },

  ]
   
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Usamos to para verificar si requiera autenticación
  const protectedRoute = to.meta.requireAuth ? to.meta.requireAuth : false
      // Procedemos a verificar el token
  if (protectedRoute && store.state.loginDatos.usuario === '') {
      next({ name: 'Login' })
  } else {
      next()
  }


})
export default router
