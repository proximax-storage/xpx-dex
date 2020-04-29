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
        // console.log('mosaicsInfOffer unchanged ===>', this.mosaicsInfOffer)
        this.mapMosaicsId(this.mosaicsInfOffer)
      }
    },
    mosaicsInfOffer (newValue) {
    //   console.log('mosaicsInfOffer ===>', newValue)
      this.mapMosaicsId(newValue)
    },
    items (newValue) {
      getAllOffer(newValue)
    }
  }
}
