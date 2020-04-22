<template>
  <v-app id="sandbox">
    <v-app-bar
      v-if="isLogged"
      :clipped-left="primaryDrawer.clipped"
      id="core-toolbar"
      app
      flat
      color="leveint"
    >
      <v-toolbar-title>
        <img :src="require('@/assets/img/logo-dex-color.svg')" alt="logo" height="35" />
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-for="(item, i) in getItemNav" :key="i">
        <div :key="item.title">
          <v-chip
            v-if="item.type === 'chip'"
            v-text="item.title"
            class="ma-2"
            :class="item.class"
            @click="actions(item.action)"
          ></v-chip>
          <v-btn-toggle
            v-model="activeBtn"
            tile
            color="sky accent-3"
            group
            v-if="item.type === 'icon-group'"
          >
            <v-btn text small :value="item.action" @click="actions(item.action)">
              <div v-if="!responsive" class="font-weight-bold text-capitalize">{{ item.title }}</div>
              <div v-if="responsive">
                <v-icon>{{ item.icon }}</v-icon>
              </div>
            </v-btn>
          </v-btn-toggle>

          <div v-if="(item.type === 'menu') ||(item.type === 'menuIcon')">
            <v-menu
              transition="slide-y-transition"
              bottom
              right
              offset-y
              max-width="200"
              z-index="0"
            >
              <template v-slot:activator="{ on }" v-if="item.type === 'menuIcon'">
                <v-btn text small color="primary" v-on="on">
                  <div v-if="loadingInfo">
                    <v-progress-circular indeterminate color="grey">
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-progress-circular>
                  </div>
                  <div v-if="!loadingInfo">
                    <v-icon>{{ item.icon }}</v-icon>
                  </div>
                </v-btn>
              </template>
              <v-list dense color="leve">
                <user-content v-if="isLogged"></user-content>
                <v-divider class="mt-1 mr-4 ml-4" />
                <v-list-item
                  v-for="(sublinks, i) in item.sublinks"
                  :key="i"
                  @click="actions(sublinks.action)"
                  class="ml-1"
                >
                  <v-list-item-icon class="mr-1">
                    <v-icon v-text="sublinks.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="sublinks.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </v-app-bar>
    <core-view></core-view>
    <core-footer></core-footer>
  </v-app>
</template>
<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data: () => ({
    primaryDrawer: {
      model: null,
      clipped: false
    },
    title: null,
    responsive: false,
    itemNav: [
      {
        icon: 'mdi-account-edit',
        type: 'icon-group',
        title: 'Sign Up',
        class: 'primary white-text',
        action: 'select-signup-type',
        viewLogged: false,
        sublinks: [],
        orderby: 0
      },
      {
        icon: 'mdi-login',
        type: 'icon-group',
        title: 'Log In',
        class: 'primary white-text',
        action: 'login',
        viewLogged: false,
        sublinks: [],
        orderby: 1
      },
      {
        icon: 'mdi-account-circle',
        type: 'menuIcon',
        title: 'Account info',
        class: 'primary white-text',
        action: 'accountInfo',
        viewLogged: true,
        sublinks: [
          {
            icon: 'mdi-logout',
            type: 'icon',
            title: 'Log out',
            class: 'primary white-text',
            action: 'logout',
            viewLogged: true,
            sublinks: [],
            orderby: 3
          }
        ],
        orderby: 3
      },
      {
        icon: 'mdi-storefront',
        type: 'icon-group',
        title: 'New offerts',
        class: 'primary white-text',
        action: 'newOffer',
        viewLogged: true,
        sublinks: [],
        orderby: 5
      },
      {
        icon: 'mdi-storefront',
        type: 'icon-group',
        title: 'Search 0fferts',
        class: 'primary white-text',
        action: 'searchOfferts',
        viewLogged: false,
        sublinks: [],
        orderby: 6
      },

      {
        icon: 'mdi-storefront',
        type: 'icon-group',
        title: 'Search 0fferts',
        class: 'primary white-text',
        action: 'searchOfferts',
        viewLogged: true,
        sublinks: [],
        orderby: 6
      }
      //, ,
      // {
      //   icon: 'mdi-storefront',
      //   type: 'icon-group',
      //   title: 'All offer',
      //   class: 'primary white-text',
      //   action: 'allOffer',
      //   viewLogged: true,
      //   sublinks: [],
      //   orderby: 7
      // }

      // {
      //   icon: 'mdi-view-dashboard',
      //   type: 'icon-group',
      //   title: 'Dashboard',
      //   class: 'primary white-text',
      //   action: 'dashboard',
      //   viewLogged: true,
      //   sublinks: [],
      //   orderby: 2
      // },
      // {
      //   icon: 'mdi-storefront',
      //   type: 'icon-group',
      //   title: 'Offers',
      //   class: 'primary white-text',
      //   action: 'offers',
      //   viewLogged: true,
      //   sublinks: [],
      //   orderby: 3
      // },
      // {
      //   icon: 'mdi-storefront',
      //   type: 'icon-group',
      //   title: 'Orders',
      //   class: 'primary white-text',
      //   action: 'orders',
      //   viewLogged: true,
      //   sublinks: [],
      //   orderby: 5
      // }
    ],
    activeBtn: 'dashboard'
  }),
  components: {
    // 'core-Drawer': () => import('@/components/core/Drawer'),
    'core-view': () => import('@/components/core/View'),
    'core-footer': () => import('@/components/core/Footer'),
    'user-content': () => import('@/components/core/UserContent')
  },
  watch: {
    $route (val) {
      this.title = val.name
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  computed: {
    ...mapGetters('accountStore', ['isLogged']),
    ...mapState(['loadingInfoWallet']),
    getItemNav () {
      return this.buildItemNav().reverse()
    },
    loadingInfo () {
      const value =
        this.loadingInfoWallet.type === 'mosaicsInfo' ? this.loadingInfoWallet.show : false
      // console.log('value', value)
      return value
    }
  },
  methods: {
    ...mapMutations('accountStore', ['LOGIN']),
    actions (action) {
      switch (action) {
        case 'login':
          this.$router.push(`${action}`).catch(e => {})
          //  /login
          break
        case 'select-signup-type':
          this.$router.push(`${action}`).catch(e => {})
          // /select-signup-type
          break
        case 'searchOfferts':
          this.$router.push(`${action}`).catch(e => {})
          // /select-signup-type
          break
        case 'newOffer':
          this.$store.commit('mosaicExchange/SET_DATA_ASSETS', null)
          this.$router.push(`${action}`).catch(e => {})
          // /select-signup-type
          break
        case 'allOffer':
          this.$router.push(`${action}`).catch(e => {})
          // /select-signup-type
          break

        case 'logout':
          this.LOGIN(false)
          this.$router.push('/login').catch(e => {})
          break
      }
    },
    buildItemNav () {
      const itemDrawer = []
      const login = this.isLogged
      for (let item of this.itemNav) {
        if (login === item.viewLogged) {
          itemDrawer.push(item)
        }
      }
      return itemDrawer.sort(function (a, b) {
        return a.orderby - b.orderby
      })
    },
    onResponsiveInverted () {
      if (window.innerWidth < 600) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    ...mapMutations('appCoreStore', ['SET_DRAWER']),
    onClickBtn () {
      this.SET_DRAWER(!this.$store.state.appCoreStore.drawer)
    }
  }
}
</script>
<style>
/* .v-menu__content.menu {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
} */
/* #core-view {
  padding-bottom: 100px;
} */
</style>
