<template>
  <v-app id="sandbox">
    <core-Drawer :drawerModal="primaryDrawer.model"></core-Drawer>
    <v-app-bar :clipped-left="primaryDrawer.clipped" id="core-toolbar" app flat color="leve">
      <v-app-bar-nav-icon v-if="responsive" @click.stop="onClickBtn" />
      <v-toolbar-title class="leveint--text">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <div v-for="(item, i) in getItemNav" :key="i">
        <div  :key="item.title"  v-if="item.chip">
          <v-chip
            v-text="item.title"
            class="ma-2"
            :class="item.class"
            @click="actions(item.action)"
          >
          </v-chip>
        </div>
      </div>
    </v-app-bar>
    <core-view></core-view>
    <core-footer></core-footer>
  </v-app>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
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
        icon: '',
        chip: true,
        title: 'Sign Up',
        class: 'primary white-text',
        action: 'select-signup-type',
        viewLogged: false
      },
      {
        icon: '',
        chip: true,
        title: 'Log In',
        class: 'primary white-text',
        action: 'login',
        viewLogged: false
      },
      {
        icon: '',
        chip: true,
        title: 'Log out',
        class: 'primary white-text',
        action: 'logout',
        viewLogged: true,
        sublinks: []
      }
    ]
  }),
  components: {
    'core-Drawer': () => import('@/components/core/Drawer'),
    'core-view': () => import('@/components/core/View'),
    'core-footer': () => import('@/components/core/Footer')
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
    getItemNav () {
      return this.buildItemNav()
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
      return itemDrawer
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
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
/* #core-view {
  padding-bottom: 100px;
} */
</style>
