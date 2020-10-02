import { mapGetters } from 'vuex'
import { getAllOffer } from '@/services/offert-service'
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
    // mapMosaicsId (value) {
    //   const filtersAssets = filtersAssetsFunc(value)
    //   console.log('filtersAssets', filtersAssets)
    //   this.items = []
    //   filtersAssets.forEach(element => {
    //     if (this.mosaicFilterUp.event === 'unchanged' || this.mosaicFilterUp.event === 'inserted') {
    //       if (element.mosaicIdHex === this.mosaicFilterUp.newValue.mosaicIdHex) {
    //         this.getBuy(element)
    //         this.getSell(element)
    //       }
    //     } else {
    //       this.getOffers(element)
    //       // this.getBuy(element)
    //       // this.getSell(element)
    //     }
    //   })
    // },
    async getOffers (data) {
      if (data.mosaicInfo) {
        console.log(data.mosaicIdHex)
        // let newItems = []
        // const offerBuy = await this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 1).toPromise()
        // const offerSell = await this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 0).toPromise()
        // const itemBuy = {
        //   info: data,
        //   type: 'buy',
        //   data: offerBuy
        // }
        // const itemSell = {
        //   info: data,
        //   type: 'sell',
        //   data: offerSell
        // }
        // newItems.push(itemBuy, itemSell)
        // console.log('newItems', newItems)
      }

      // newItems.push(itemBuy, itemSell)
      // console.log(newItems)
      // this.items.push({
      //   info: data,
      //   type: 'buy',
      //   data: offer
      // })
      // })
    }
    // getBuy (data) {
    //   this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 1).subscribe(offer => {
    //     this.items.push({
    //       info: data,
    //       type: 'buy',
    //       data: offer
    //     })
    //   })
    // },
    // getSell (data) {
    //   this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 0).subscribe(offer => {
    //     this.items.push({
    //       info: data,
    //       type: 'sell',
    //       data: offer
    //     })
    //   })
    // }
  },
  watch: {
    // unchanged (newValue) {
    //   if (newValue) {
    //     this.mosaicFilterUp = { newValue: newValue, event: 'unchanged' }
    //     setTimeout(() => {
    //       this.mapMosaicsId(this.mosaicsInfOffer)
    //     }, 2000)
    //   }
    // },
    inserted (newValue) {
      if (newValue) {
        this.mosaicFilterUp = this.mosaicFilterUp = { newValue: newValue, event: 'inserted' }
        this.$store.commit('socketDbStore/EVENT_PUSH_MOSAIC_INFO', newValue)
      }
    },
    // mosaicsInfOffer (newValue, oldValue) {
    //   console.log('newValue', newValue)
    //   console.log('oldValue', oldValue)
    //   if (!this.unchanged) {
    //     this.mapMosaicsId(newValue)
    //   }
    // },
    items (newValue) {
      if (this.mosaicFilterUp.event) {

      }
      getAllOffer(newValue, this.mosaicFilterUp.newValue)
      this.mosaicFilterUp = { newValue: null, event: null }
    }
  }
}
