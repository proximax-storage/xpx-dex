import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    meta: {
      requiresNotAuth: true
    }
  },
  {
    path: '/create-new-signup',
    name: 'New Signup',
    component: () =>
      import(/* webpackChunkName: "CreateNewSignup.vue" */ '../views/signup/CreateNewSignup.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: true
    }
  },
  {
    path: '/select-signup-type',
    name: 'Signup Type',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/signup/SelectTypeSignup.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: true
    }
  },
  {
    path: '/create-from-privateKey',
    name: 'Create from private key',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/signup/CreateFromPrivateKey.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: true
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach(async (to, from, next) => {
  const hideMenu = to.matched.some(record => record.meta.hideMenu)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresNotAuth = to.matched.some(record => record.meta.requiresNotAuth)
  if (hideMenu) {
    store.commit('SHOW_MENU', false)
  } else {
    store.commit('SHOW_MENU', true)
  }
  const isLogged = false
  if (requiresAuth && !isLogged) {
    next('/')
  } else if (requiresNotAuth && isLogged) {
    next('/home')
  } else {
    next()
  }
})
export default router
