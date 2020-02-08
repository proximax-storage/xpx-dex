<template>
  <v-app id="sandbox">
    <core-Drawer :drawerModal="primaryDrawer.model"></core-Drawer>
    <v-app-bar :clipped-left="primaryDrawer.clipped" id="core-toolbar" app flat>
      <v-app-bar-nav-icon v-if="responsive" @click.stop="onClickBtn" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <div>
        <v-chip link class="ma-2 primary sky--text" router :to="'/select-signup-type'"
          >Sign Up</v-chip
        >
      </div>
      <div>
        <v-chip link class="ma-2 sky primary--text">Sign In</v-chip>
      </div>
      <!-- <v-btn icon large>
        <v-icon>mdi-apps</v-icon>
        login
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-notifications</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify"> </v-img
        ></v-avatar>
      </v-btn> -->
    </v-app-bar>
    <core-view></core-view>
    <core-footer></core-footer>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data: () => ({
    primaryDrawer: {
      model: null,
      clipped: false
    },
    title: null,
    responsive: false
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
  methods: {
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    ...mapMutations('appCoreStore', ['SET_DRAWER']),
    onClickBtn () {
      console.log('SET_DRAWER', !this.$store.state.appCoreStore.drawer)
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
