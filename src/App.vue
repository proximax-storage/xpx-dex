<template>
  <v-app>
    <!-- Menu -->
    <menu-item v-if="showMenu"></menu-item>
      <!-- Overlay -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-content>
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <router-view :key="$route.path"></router-view>
        </transition>
      </v-container>
    </v-content>

    <!-- <v-footer app absolute color="white">
      <v-row class="black--text">
        <v-col cols="12" class="pt-0 pb-0 text-center">
          <span class="caption font-weight-medium">© ProximaX 2019</span>
    </v-col>-->
    <!-- <v-col cols="12" class="pt-0 pb-0 text-center">
          <span class="caption font-weight-regular">
            Please report any issues identified to our
            <a
              href="https://t.me/proximaxhelpdesk"
              target="_blank"
            >helpdesk.</a>
          </span>
    </v-col>-->
    <!-- </v-row>
    </v-footer>-->
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data: () => ({}),
  components: {
    'menu-item': () => import('@/components/Menu')
  },
  computed: {
    ...mapState(['overlay', 'snackbar']),
    ...mapState(['showMenu'])
  }
}
</script>
