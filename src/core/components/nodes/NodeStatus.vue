<template>
  <div>
    <v-row>
      <!-- SEMAFORO -->
      <!-- <v-col cols="12">
        <svg width="200px" height="400px">
          <rect x="20" y="20" width="150" height="350" fill="black" stroke="gray" stroke-width="2" />
          <circle
            v-if="nodeStatus === 1 || nodeStatus === ''"
            cx="100"
            cy="95"
            r="40"
            fill="#40CC40"
            stroke="black"
            stroke-width="2"
          />
          <circle
            v-if="nodeStatus === 2 || nodeStatus === ''"
            cx="100"
            cy="195"
            r="40"
            fill="yellow"
            stroke="black"
            stroke-width="2"
          />
          <circle
            v-if="nodeStatus === 0 || nodeStatus === ''"
            cx="100"
            cy="295"
            r="40"
            fill="red"
            stroke="gray"
            stroke-width="2"
          />
        </svg>
      </v-col>-->
      <v-col cols="12 pr-0 ">
        <!-- <div class="text-center">
          <span class="caption">Status</span>
        </div>-->
        <template v-if="currentNode">
          <div class="text-center pt-1 d-flex align-center">
            <span class="caption" :title="currentNode.uri">
              <template v-if="nodeStatus === 1">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-green-30h.svg`)" alt width="25px" />
              </template>
              <template v-if="nodeStatus === 2">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-yellow-30h.svg`)" alt width="25px" />
              </template>
              <template v-if="nodeStatus === 0">
                <img :src="require(`@/assets/img/${theme}/icon-nodes-red-30h.svg`)" alt width="25px" />
              </template>
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
