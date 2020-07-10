<template>
  <div>
    <simple-table
      v-if="othersAssets"
      :dataTh="dataTh"
      :type="''"
      :dataTable="othersAssets"
      :mosaicInfo="[]"
      @action="action"
    ></simple-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      theme: 'light',
      dataTh: ['Assets', 'Available']
    }
  },
  computed: {
    ...mapGetters('mosaicStore', ['othersMosaics']),
    othersAssets () {
      return this.buildDataTable(this.othersMosaics(this.$store.getters.environment.mosaic.id))
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable')
  },
  methods: {
    action (exchange) {},
    buildDataTable (assets) {
      let assetsBuild = []
      console.log('assets', assets)
      assetsBuild = assets.map(f => {
        return {
          assets: 'cafe',
          available: '345345'
        }
      })
      return assetsBuild
    }
  }
}
</script>
