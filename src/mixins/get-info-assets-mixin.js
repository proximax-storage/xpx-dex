import { mapGetters, mapMutations, mapActions } from 'vuex'
import {
  searchInfoMosaics
} from '@/services/mosaics-service'
export default {
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer']),
    assets: {
      get () {
        return this.mosaicsInfOffer
      },
      set (value) {
        this.setMoisaicUnchanged(value)
        // this.$store.commit('socketDbStore/EVENT_SET_MOSAIC_INFO', value)
      }
    }
  },
  watch: {
    assets (newValue) {
      this.getInfoAssets(newValue)
    }
  },
  methods: {
    ...mapActions('socketDbStore', ['setMoisaicUnchanged']),
    ...mapMutations('socketDbStore', ['EVENT_LOADING_MOSAIC_INFO']),
    async getInfoAssets (data) {
      let cont = 0
      if (data.length > 0) {
        for (let item of data) {
          if (item.mosaicInfo === undefined) {
            cont = cont + 1
            const mosaicId = this.$blockchainProvider.getMosaicId(item.mosaicIdHex)
            try {
              item.mosaicInfo = await searchInfoMosaics([mosaicId], true)
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
