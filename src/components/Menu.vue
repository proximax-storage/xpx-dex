
<template>
  <div>
    <v-app-bar app clipped-left color="leve" dense>
      <v-app-bar-nav-icon color="darkness" @click.stop="drawer = !drawer"/>
      <v-toolbar-title class="mr-12 align-center">
        <span class="darkness--text font-italic font-weight-bold headline">Sports</span>
        <span class="primary--text font-italic font-weight-bold headline">Bet</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div>
        <v-chip link class="ma-2 primary darkness--text" router :to="'/select-signup-type'">Sign Up</v-chip>
      </div>
      <div>
        <v-chip link class="ma-2 darkness primary--text">Sign In</v-chip>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped src="https://i.stack.imgur.com/wa12e.png">
      <v-list dense>
        <v-list-item class="pa-2">
          <v-list-item-content cla>
            <img class="mr-3" :src="require('@/assets/logo.svg')" alt="logo" height="100">
            <v-list-item-title class="title primary--text">Sirius chain,</v-list-item-title>
            <v-list-item-subtitle class="subtitle-1 leve--text">transparency & safely.</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item class="pa-2">
          <v-list-item-content>
            <v-list-item-title class="subtitle-1 primary--text">Bets evailabre</v-list-item-title>
            <span class="display-1">34,520</span>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="secondary">
          <v-list-item-content>
            <v-list-item-title class="subtitle-1 darkness--text">Propose your own bet</v-list-item-title>
            <div>
              <v-chip
                link
                class="ma-1 leve darkness--text font-italic font-weight-bold subtitle-1"
              >Now</v-chip>
            </div>
          </v-list-item-content>
        </v-list-item>
        <template v-for="(item, key) of links">
          <v-list-item :key="key.title">
            <v-list-item-content>
              <v-list-item-title link class="subtitle-1 primary--text" v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            link
            class="min-height-0"
            v-for="(subItem, keysub) of item.sublinks"
            :key="keysub.title "
          >
            <v-list-item-content>
              <v-list-item-title link class="subtitle-2 leve--text pl-4" v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- <v-navigation-drawer v-model="left" fixed left temporary>
      <v-list-item @click.stop="left = !left">
        <v-list-item-content>
          <v-list-item-title>salir</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>-->
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    left: false,
    links: [
      {
        action: '',
        title: 'Highlight sport',
        sublinks: [
          { title: 'Football', route: '/', viewLogged: false },
          { title: 'Baseball', route: '/', viewLogged: false }
        ]
      },
      {
        action: '',
        title: 'See all',
        sublinks: []
      }
    ]
  })
}
</script>

<style scoped >
.min-height-0 {
  min-height: 0px !important;
}
</style>
