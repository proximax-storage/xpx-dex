import { mapGetters } from 'vuex'
import { getAllOffer, filtersAssetsFunc } from '@/services/offert-service'
export default {
  data () {
    return {
      items: [],
      mosaicFilterUp: { newValue: null, event: null }
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo', 'unchanged', 'inserted'])
  },
  methods: {
    mapMosaicsId (value) {
      const filtersAssets = filtersAssetsFunc(value)
      this.items = []
      filtersAssets.forEach(element => {
        if (this.mosaicFilterUp.event === 'unchanged' || this.mosaicFilterUp.event === 'inserted') {
          if (element.mosaicIdHex === this.mosaicFilterUp.newValue.mosaicIdHex) {
            this.getBuy(element)
            this.getSell(element)
          }
        } else {
          this.getBuy(element)
          this.getSell(element)
        }
      })
    },
    getBuy (data) {
      this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 1).subscribe(offer => {
        this.items.push({
          info: data,
          type: 'buy',
          data: offer
        })
      })
    },
    getSell (data) {
      this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 0).subscribe(offer => {
        this.items.push({
          info: data,
          type: 'sell',
          data: offer
        })
      })
    }
  },
  watch: {
    unchanged (newValue) {
      if (newValue) {
        this.mosaicFilterUp = { newValue: newValue, event: 'unchanged' }
        setTimeout(() => {
          this.mapMosaicsId(this.mosaicsInfOffer)
        }, 2000)
      }
    },
    inserted (newValue) {
      if (newValue) {
        this.mosaicFilterUp = this.mosaicFilterUp = { newValue: newValue, event: 'inserted' }
        this.$store.commit('socketDbStore/EVENT_PUSH_MOSAIC_INFO', newValue)
      }
    },
    mosaicsInfOffer (newValue) {
      if (!this.unchanged) {
        this.mapMosaicsId(newValue)
      }
    },
    items (newValue) {
      if (this.mosaicFilterUp.event) {

      }
      getAllOffer(newValue, this.mosaicFilterUp.newValue)
      this.mosaicFilterUp = { newValue: null, event: null }
    }
  }
}
