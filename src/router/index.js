import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Log In',
    component: () => import(/* webpackChunkName: "SelectTypeSignup" */ '../views/login/LogIn.vue'),
    meta: {}
  },
  {
    path: '/searchOfferts',
    name: 'Search Offerts ',
    component: () =>
      import(/* webpackChunkName: "searchOfferts" */ '../views/searchOffers/TypeSearchOffers.vue'),
    meta: {}
  },
  {
    path: '/newOffer',
    name: 'new Offer ',
    component: () =>
      import(/* webpackChunkName: "searchOfferts" */ '../views/newOffer/createNewOffer.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/home',
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
      hideMenu: false
    }
  },
  {
    path: '/select-signup-type',
    name: 'Signup Type',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/signup/SelectTypeSignup.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: false
    }
  },
  {
    path: '/take-offers',
    name: 'take offers',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/takeOffers/TakeOffers.vue'),
    meta: {
      requiresAuth: true,
      // requiresNotAuth: true,
      hideMenu: false
    }
  },
  {
    path: '/offer-board',
    name: 'Offer Board',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/offerBoard/OfferBoard.vue'),
    meta: {
      requiresNotAuth: true,
      requiresAuth: true,
      hideMenu: false
    }
  },
  {
    path: '/create-from-privateKey',
    name: 'Create from private key',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/signup/CreateFromPrivateKey.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: false
    }
  },
  {
    path: '/login',
    name: 'Log In',
    component: () => import(/* webpackChunkName: "SelectTypeSignup" */ '../views/login/LogIn.vue'),
    meta: {
      requiresNotAuth: true,
      hideMenu: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(/* webpackChunkName: "SelectTypeSignup" */ '../views/dashboard/dashboard.vue'),
    meta: {
      requiresAuth: true,
      hideMenu: false
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
  if (requiresAuth && requiresNotAuth) {
    next()
    return
  }
  if (requiresAuth && !store.getters['accountStore/isLogged']) {
    next('/')
  } else if (requiresNotAuth && store.getters['accountStore/isLogged']) {
    next('/home')
  } else {
    next()
  }
})
export default router
