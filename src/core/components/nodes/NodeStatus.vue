<template>
  <div>
    <v-row>
      <v-col cols="12 pr-0 ">
        <template v-if="currentNode">
          <div class="text-center pt-1 d-flex align-center">
            <span class="caption" :title="currentNode.uri" >
              <router-link to="/nodes">
              <template v-if="nodeStatus === 1">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-green-30h.svg`)" alt width="25px" />
              </template>
              <template v-if="nodeStatus === 2">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-yellow-30h.svg`)" alt width="25px" />
              </template>
              <template v-if="nodeStatus === 0">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-red-30h.svg`)" alt width="25px" />
              </template>
              </router-link>
            </span>
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      theme: 'light'
    }
  },
  computed: {
    ...mapGetters('nodeStore', ['currentNode', 'nodeStatus'])
  }
}
</script>
