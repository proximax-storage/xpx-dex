import { mapGetters } from 'vuex'
import { getAllOffer, filtersAssetsFunc } from '@/services/offert-service'
export default {
  data () {
    return {
      items: []
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo', 'unchanged'])
  },
  methods: {
    mapMosaicsId (value) {
      const filtersAssets = filtersAssetsFunc(value)
      this.items = []
      // console.log('filtersAssets', filtersAssets)
      filtersAssets.forEach(element => {
        this.getBuy(element)
        this.getSell(element)
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
      if (newValue) {
        console.log(' NEW VALUE  ===>', newValue)
        console.log(' UNCHANGED  ===>', this.mosaicsInfOffer)
        setTimeout(() => {
          this.mapMosaicsId(this.mosaicsInfOffer)
        }, 2000)
      }
    },
    mosaicsInfOffer (newValue) {
      if (this.unchanged.length === 0) {
        console.log('MOSAIC INFO OFFER ===>', newValue)
        this.mapMosaicsId(newValue)
      }
    },
    items (newValue) {
      // console.log('items', newValue)
      getAllOffer(newValue)
    }
  }
}
