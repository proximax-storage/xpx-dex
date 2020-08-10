<template>
  <div>
    <!-- Nodes Info -->
    <template v-if="currentNode">
      <v-row>
        <v-col cols="12" class="pt-0">
          <div class="pt-1 text-center">
            <span class="title"></span>
          </div>

          <div class="text-center mt-1">
            <span class="body-2 font-weight-medium">Status: &nbsp;</span>
            <span class="caption">
              <template v-if="nodeStatus === 1">
                Online
                <v-icon small color="green">mdi-checkbox-marked-circle</v-icon>
              </template>
              <template v-if="nodeStatus === 2">Connecting <v-icon small color="orange">mdi-alert-circle</v-icon></template>
              <template v-if="nodeStatus === 0">Not connected <v-icon small color="primary">mdi-close-circle</v-icon></template>
            </span>
          </div>

          <div class="text-center mt-1" v-if="currentNode.height">
            <span class="body-2 font-weight-medium">Height: &nbsp;</span>
            <span class="caption">{{currentNode.height}}</span>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('nodeStore', ['closeWebsocket']),
    closeConnection () {
      this.closeWebsocket('')
      this.$store.commit('SHOW_SNACKBAR', {
        snackbar: true,
        text: 'Webosocket connection has been closed',
        color: 'success'
      })
    }
  },
  computed: {
    ...mapGetters('nodeStore', ['currentNode', 'nodeStatus'])
  }
}
</script>
