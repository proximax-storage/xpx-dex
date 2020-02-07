<template>
  <div>
    <v-app-bar app clipped-left color="primary" dense class="elevation-0">
      <v-app-bar-nav-icon v-on:click="drawers()" />
      <v-toolbar-title class="pl-1 align-center">
        <img
          class="mr-1 pt-2"
          :src="require('@/assets/img/logo-proximax-sirius-wallet-beta.svg')"
          alt="logo"
          height="45"
        />
        <!-- <span class=" font-italic font-weight-bold headline">Dex</span>
        <span class=" font-italic font-weight-bold headline">Wallet</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-chip link class="ma-2 sky white--text" router :to="'/select-signup-type'"
          >Sign Up</v-chip
        >
      </div>
      <div>
        <v-chip link class="ma-2 leveint sky--text">Sign In</v-chip>
      </div>
    </v-app-bar>

    <!-- <v-navigation-drawer v-model="drawer" app clipped src="https://i.stack.imgur.com/wa12e.png"> -->
    <v-navigation-drawer
      v-model="drawer"
      app
      class="elevation-1 v-list-custom"
      v-resize="onResize"
      :mini-variant.sync="mini"
      width="230"
    >
      <v-list nav dense class="pa- pt-1">
        <v-list-item class="pa-0"> </v-list-item>
        <v-list-item-group v-model="item" color="sky" class="pt-1">
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    mandator: true,
    itemo: null,
    item: null,
    subItem: null,
    drawer: null,
    mini: false,
    left: false,
    mobile: window.innerWidth <= 1330,
    links: [
      {
        action: '',
        title: 'My Files',
        icon: 'mdi-folder',
        sublinks: [
          { title: 'Football', route: '/', viewLogged: false },
          { title: 'Baseball', route: '/', viewLogged: false }
        ]
      },
      {
        action: '',
        title: 'My Files 2',
        icon: 'mdi-folder',
        sublinks: []
      }
    ],
    items: [
      {
        icon: ' mdi-home',
        title: 'home',
        router: '',
        viewLogged: false,
        sublinks: []
      },
      {
        icon: ' mdi-home',
        title: 'item 1',
        router: '',
        viewLogged: false,
        sublinks: []
      }
    ]
  }),
  methods: {
    onResize () {
      this.mobile = false
      this.mobile = window.innerWidth <= 1320
    },
    drawers () {
      if (this.mobile) {
        this.mini = false
        this.drawer = !this.drawer
      } else {
        this.mini = !this.mini
      }
    },
    sebd () {
      console.log('key')
    }
  },
  beforeMount () {
    this.onResize()
  }
}
</script>

<style scoped>
.min-height-0 {
  min-height: 0px !important;
}
.v-list-custom {
  /* background: #e9e9e9 !important; */
  z-index: 1 !important;
}
</style>
