import { mapGetters } from 'vuex'
import { getAllOffer, filtersAssetsFunc } from '@/services/offert-service'
export default {
  data () {
    return {
      items: [],
      mosaicFilterUp: null
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo', 'unchanged', 'inserted'])
  },
  methods: {
    mapMosaicsId (value) {
      const filtersAssets = filtersAssetsFunc(value)
      this.items = []
      console.log('filtersAssets', filtersAssets)
      console.log('this.mosaicFilterUp', this.mosaicFilterUp)
      filtersAssets.forEach(element => {
        // if (element) {
        this.getBuy(element)
        this.getSell(element)
        // }
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
        // console.log('consulto offer', offer)
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
      console.log(' UNCHANGED NEW VALUE  ===>', newValue)
      if (newValue) {
        this.mosaicFilterUp = { newValue: newValue, event: 'unchanged' }
        // console.log(' UNCHANGED  ===>', this.mosaicsInfOffer.length)
        setTimeout(() => {
          this.mapMosaicsId(this.mosaicsInfOffer)
        }, 2000)
      }
    },
    inserted (newValue) {
      console.log(' INSERTED NEW VALUE  ===>', newValue)
      if (newValue) {
        this.mosaicFilterUp = this.mosaicFilterUp = { newValue: newValue, event: 'inserted' }
        this.$store.commit('socketDbStore/EVENT_PUSH_MOSAIC_INFO', newValue)
      }
    },
    mosaicsInfOffer (newValue) {
      if (!this.unchanged) {
        console.log('MOSAIC INFO OFFER ===>', newValue)
        // this.mosaicFilterUp = this.mosaicFilterUp = { newValue: newValue, event: 'mosaicsInf' }
        this.mapMosaicsId(newValue)
      }
    },
    items (newValue) {
      // console.log('items', newValue)
      getAllOffer(newValue)
    }
  }
}
