import { mapState, mapGetters, mapMutations } from 'vuex'
import mosaicMixins from './mosaic-mixin'
export default {
  mixins: [mosaicMixins],
  computed: {
    ...mapState('socketDbStore', ['offersTx']),
    ...mapGetters('socketDbStore', ['mosaicsInfOffer']),
    assets: {
      get () {
        return this.mosaicsInfOffer
      },
      set (value) {
        this.$store.commit('socketDbStore/EVENT_SET_MOSAIC_INFO', value)
      }
    }
  },
  watch: {
    assets (newValue) {
      this.getInfoAssets(newValue)
    }
  },
  methods: {
    ...mapMutations('socketDbStore', ['EVENT_LOADING_MOSAIC_INFO']),
    async getInfoAssets (data) {
      let cont = 0
      if (data.length > 0) {
        for (let item of data) {
          if (item.mosaicInfo === undefined) {
            cont = cont + 1
            const mosaicId = this.$blockchainProvider.getMosaicId(item.mosaicIdHex)
            try {
              item.mosaicInfo = await this.searchInfoMosaics([mosaicId], true)
            } catch (error) {
              item.mosaicInfo = ''
            }
          }
        }
        if (cont > 0) {
          this.EVENT_LOADING_MOSAIC_INFO(false)
          this.assets = JSON.parse(JSON.stringify(data))
        }
      } else {
        this.EVENT_LOADING_MOSAIC_INFO(false)
      }
    }
  }
}
