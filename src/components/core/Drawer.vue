<template>
  <div>
    <v-navigation-drawer
      v-model="inputValue"
      app
      floating
      persistent
      mobile-break-point="980"
      width="230"
      overflow
      color="sky"
      class="elevation-2"
    >
      <v-list nav dense class="pt-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title  align="center">
              <img
                :src="require('@/assets/img/logo-dex-blanco.svg')"
                alt="logo"
                height="55"
              />
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-1 mr-4 ml-4 white" />
        <v-list-item-group v-model="primaryDrawer.modal" color="sky" class="pt-1">
          <v-list-item
            v-for="(item, i) in getItemsDrawer"
            :key="i"
            :active-class="color"
            :to="item.router"
            class=" mt-3 mr-4 ml-4"
          >
            <v-list-item-icon class="white-text mr-2">
              <v-icon class="white--text" v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content class="white--text">
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => ({
    primaryDrawer: {
      model: null,
      item: null
    },
    color: 'primary',
    itemsDrawer: [
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
      },
      {
        icon: ' mdi-home',
        title: 'item logueado',
        router: '',
        viewLogged: true,
        sublinks: []
      }
    ]
  }),
  beforeMount () {},
  computed: {
    ...mapGetters('accountStore', ['isLogged']),
    ...mapGetters('appCoreStore', ['drawer']),
    inputValue: {
      get () {
        return this.$store.state.appCoreStore.drawer
      },
      set (val) {
        this.SET_DRAWER(val)
      }
    },
    getItemsDrawer () {
      return this.buildItemsDrawer()
    }
  },
  methods: {
    ...mapMutations('appCoreStore', ['SET_DRAWER']),
    buildItemsDrawer () {
      const itemDrawer = []
      const login = this.isLogged
      for (let item of this.itemsDrawer) {
        if (login === item.viewLogged) {
          itemDrawer.push(item)
        }
      }
      return itemDrawer
    }
  }
}
</script>
