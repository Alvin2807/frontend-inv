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

      {
        path: '/solicitudes-pendientes',
        name: 'Solicitud',

        component: () =>
            import ('../views/Solicitud.vue'),
        //meta: { requireAuth: true }
    },

    {
      path: '/crear-solicitud-de-entrada',
      name: 'Entrada',

      component: () =>
          import ('../views/Entrada.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/crear-solicitud-de-salida',
      name: 'Salida',

      component: () =>
          import ('../views/Salida.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/editar-solicitud-entrada',
      name: 'EditarEntrada',

      component: () =>
          import ('../views/EditarEntrada.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/articulos_entradas',
      name: 'ArticulosEntradas',

      component: () =>
          import ('../views/ArticulosEntradas.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/lista_de_entradas',
      name: 'ListaEntrada',

      component: () =>
          import ('../views/ListaEntrada.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/detalle_de_constancia_de_entrada',
      name: 'DetalleEntrada',

      component: () =>
          import ('../views/DetalleEntrada.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/detalle_de_num_trans',
      name: 'DetalleTrans',

      component: () =>
          import ('../views/DetalleTrans.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/detalle_de_articulo_x_entrada',
      name: 'DetalleArticulo',

      component: () =>
          import ('../views/DetalleArticulo.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/editar_salida',
      name: 'EditarSalida',

      component: () =>
          import ('../views/EditarSalida.vue'),
      //meta: { requireAuth: true }
    },

    {
      path: '/nomenclaturas',
      name: 'Nomenclatura',

      component: () =>
          import ('../views/Nomeclatura.vue'),
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
