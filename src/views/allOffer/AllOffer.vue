<template>
  <div class="pa-3">
    <info-Mosaic :name="nameMosaicInfo" />
    <v-row>
      <v-col
        sm="7"
        md="7"
        lg="9"
        col="9"
        class="pt-0"
      >
        <v-row>
          <v-col col="12 pa-0">
            <v-item-group
              mandatory
              v-model="form.active"
            >
              <v-row>
                <v-col
                  cols="6"
                  class="mr-0 pr-0 pb-0"
                >
                  <v-item
                    v-slot:default="{ active, toggle }"
                    value="buy"
                  >
                    <v-row class="mx-auto mr-0 pr-0">
                      <v-col
                        class="mr-0 pr-0"
                        justify="center"
                        align="center"
                      >
                        <v-btn
                          color="dim"
                          min-width="200"
                          @click="toggle()"
                          text
                          block
                        >
                          <span class="text-capitalize mr-1 font-italic font-weight-bold title title-size">Buy </span>
                          <span class="text-lowercase font-italic font-weight-bold title title-size"> offers</span>
                        </v-btn>
                        <v-scroll-y-transition>
                          <v-sheet
                            height="4"
                            tile
                            :color="active ? 'dim' : 'grey lighten-2'"
                          ></v-sheet>
                        </v-scroll-y-transition>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
                <v-col
                  cols="6"
                  class="ml-0 pl-0 pb-0"
                >
                  <v-item
                    v-slot:default="{ active, toggle }"
                    value="sell"
                  >
                    <v-row class="mx-auto">
                      <v-col
                        class="ml-0 pl-0"
                        justify="center"
                        align="center"
                      >
                        <v-btn
                          color="pin"
                          min-width="200"
                          @click="toggle()"
                          text
                          block
                          mall
                        >
                          <span class="text-capitalize mr-1 font-italic font-weight-bold title title-size">Sell </span>
                          <span class="text-lowercase font-italic font-weight-bold title title-size"> offers</span>
                        </v-btn>
                        <v-scroll-y-transition>
                          <v-sheet
                            height="4"
                            tile
                            :color="active ? 'pin' : 'grey lighten-2'"
                          ></v-sheet>
                        </v-scroll-y-transition>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-col>
        </v-row>
        <v-row class="ml-1 pb-0 pt-0 mx-auto">
          <filter-by-quantify
            @clicked="clickedFilterByQuantify"
            :resultsOfferFilter="resultsData"
            :divisibility="propertiesMosaic.divisibility"
          ></filter-by-quantify>
          <filter-by-price
            @clicked="clickedFilterByPrice"
            :resultsOfferFilter="resultsData"
            :divisibility="6"
          ></filter-by-price>

        </v-row>

        <v-row>
          <v-col cols="12">
            <v-divider class="ma-0"></v-divider>
          </v-col>
          <v-col col="12 mt-0">
            <v-progress-linear
              v-if="progress"
              indeterminate
              color="primary"
            ></v-progress-linear>
            <simple-table
              :type="form.active"
              :resultsOfferFilter="resultsData"
              :divisibility="propertiesMosaic.divisibility"
              @sendOffer="sendOffer"
            ></simple-table>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        sm="5"
        md="5"
        lg="3"
        col="3"
        class="pt-0"
      >
        <card-new-offert
          :type="form.active"
          @ownOffer="ownOffer"
        />
        <card-other-assets :dataAssets="dataAssets" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { validateExpireOffer } from '@/services/offert-service'
export default {
  data: () => {
    return {
      data: {
        buy: [],
        sell: []
      },
      progress: false,
      propertiesMosaic: null,
      mosaic: null,
      form: { active: 'sell', filterByQuantity: 0, filterByPrice: 0 },
      dataAssets: {
        form: { asset: null, amount: null, bidPrice: null, active: 'sell' },
        mosaicInfo: null,
        configMoney: {
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: '',
          precision: 0,
          masked: false
        }
      }
    }
  },
  components: {
    'info-Mosaic': () => import('@/components/offerBoard/InfoMosaic'),
    'card-new-offert': () => import('@/components/shared/CardNewOffert'),
    'card-other-assets': () => import('@/components/shared/CardOtherAssets'),
    'filter-by-quantify': () => import('@/components/shared/FilterByQuantify'),
    'filter-by-price': () => import('@/components/shared/FilterByPrice'),
    'simple-table': () => import('@/components/AllOfferBoard/SimpleTable')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'mosaicsInfOfferFromIdHex']),
    ...mapGetters('offersStore', ['offerSelected', 'offerUpdate', 'offerDeleteIdMosaic', 'updateBoolean', 'offerAll']),
    nameMosaicInfo () {
      return this.offerSelected.tableData.text
    },
    resultsData () {
      return this.sortByKey(this.data[this.form.active], 'price').filter(x => {
        if (this.form.filterByPrice === 0) {
          return (x.amount.compact() >= this.form.filterByQuantity)
        } else {
          return (x.amount.compact() >= this.form.filterByQuantity) && (x.bitPrice <= this.form.filterByPrice)
        }
      })
    }
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'SHOW_SNACKBAR']),
    mosaicInfoProperties (mosaic = null) {
      let properties = {
        divisibility: 6,
        duration: null,
        supplyMutable: null,
        transferable: null
      }
      if (mosaic) properties = mosaic[0].mosaicInfo.properties
      return properties
    },
    calcPrice (price, amount) {
      return price * amount
    },
    updateOffer (dataNew) {
      // console.log('dataNew', dataNew)
      if (this.data.sell.length > 0) {
        // console.log('this.data.sell', this.data.sell)
        for (let i = 0; i < this.data.sell.length; i++) {
          //    for(let i  of this.data.sell) {
          console.log('i', this.data.sell[i].owner.publicKey)
          const findOfferSell = dataNew.sell.find(x => x.owner.publicKey === this.data.sell[i].owner.publicKey)
          if (findOfferSell) {
            // console.log('findOfferSell', findOfferSell)
            this.data.sell[i].amount = findOfferSell.amount
          } else {
            this.data.sell.splice(i, 1)
          }
        }
      }
      if (this.data.buy.length > 0) {
        // console.log('buy', this.data.buy)
        for (let i = 0; i < this.data.buy.length; i++) {
          //    for(let i  of this.data.buy) {
          // console.log('i', this.data.buy[i].owner.publicKey)
          const findOfferbuy = dataNew.buy.find(x => x.owner.publicKey === this.data.buy[i].owner.publicKey)
          // console.log('findOfferbuy', findOfferbuy)
          if (findOfferbuy) {
            this.data.buy[i].amount = findOfferbuy.amount
          } else {
            this.data.buy.splice(i, 1)
          }
        }
      }
      // console.log('this.data', this.data)
      // console.log('dataOld', JSON.stringify(dataOld))
      // console.log('dataNew', JSON.stringify(dataNew))
      // console.log('this.data.buy', this.data.buy)
    },
    resultsOffer (data = [], type = null) {
      setTimeout(() => {
        const amount = this.$generalService.addZerosQuantity(
          this.dataAssets.configMoney.precision,
          1
        )
        if (data.sell.length > 0) {
          for (let item of data.sell) {
            item.priceForAmount = this.priceForAmount(
              item.initialAmount.compact(),
              this.calcPrice(item.price, Number(amount))
            )
            item.bitPrice = this.calcPrice(item.price, Number(amount))
            this.data.sell.push(item)
            // }
          }
        } else {
          this.data.sell = []
        }
        if (data.buy.length > 0) {
          for (let item of data.buy) {
            item.priceForAmount = this.priceForAmount(
              item.initialAmount.compact(),
              this.calcPrice(item.price, Number(amount))
            )
            item.bitPrice = this.calcPrice(item.price, Number(amount))
            this.data.buy.push(item)
            // }
          }
        } else {
          this.data.buy = []
        }
      })
    },
    priceForAmount (amount, priceV) {
      const initialAmount = this.$generalService.amountFormatter(
        amount,
        this.propertiesMosaic.divisibility
      )
      const price = this.$generalService.amountFormatter(priceV)
      const calPrice = parseFloat(
        price.replace(/,/g, '') * initialAmount.replace(/,/g, '')
      ).toFixed(6)
      return String(calPrice)
        .replace(/,/g, '')
        .replace(/\./g, '')
    },
    ownOffer () {
      if (this.$store.getters['accountStore/isLogged']) {
        this.dataAssets.form.active = this.form.active
        this.$store.commit('mosaicExchange/SET_DATA_ASSETS', this.dataAssets)
        this.$router.push({ path: '/newOffer' })
      } else {
        this.$router.push({ path: '/login' })
      }
    },
    async sendOffer (value) {
      this.SHOW_LOADING(true)
      const val = await validateExpireOffer(value, this.form.active === 'buy' ? 1 : 0)
      this.SHOW_LOADING(false)
      if (val.expire) return
      this.dataAssets.form.active = this.form.active
      this.$store.commit('mosaicExchange/SET_EXCHANGE', value)
      this.$store.commit('mosaicExchange/SET_DATA_ASSETS', this.dataAssets)
      this.$store.commit('mosaicExchange/SET_EXPIRE', val.infoExpire)
      if (this.$store.getters['accountStore/isLogged']) {
        this.$router.push({ path: '/take-offers' })
      } else {
        this.$router.push({ path: '/searchOfferts' })
      }
    },
    sortByKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    },
    clickedFilterByPrice (value) {
      this.form.filterByPrice = value
      console.log('this.form', this.form)
    },
    clickedFilterByQuantify (value) {
      this.form.filterByQuantity = value
    }
  },
  beforeMount () {
    if (this.offerSelected) {
      this.propertiesMosaic = this.mosaicInfoProperties(
        this.offerSelected.tableData.info.mosaicInfo
      )
      this.dataAssets.form.active = this.offerSelected.tableData.type
      this.form.active = this.offerSelected.tableData.type
      this.resultsOffer(this.offerSelected.allOffers, this.offerSelected.tableData.type)
      this.dataAssets.configMoney.precision = this.propertiesMosaic.divisibility
      this.dataAssets.mosaicInfo = this.offerSelected.tableData.info.mosaicInfo
      this.dataAssets.form.asset = this.$blockchainProvider
        .getMosaicId(this.offerSelected.tableData.info.mosaicInfo[0].idMosaic)
        .toHex()
      this.$store.commit('mosaicExchange/SET_DATA_ASSETS', this.dataAssets)
    }
  },
  watch: {
    offerUpdate (offer) {
      console.log('offerUpdate', offer)
      if (offer) {
        if (offer.tableData.info.mosaicIdHex === this.offerSelected.tableData.info.mosaicIdHex) {
          this.updateOffer(offer.allOffers)
        }
      }
    },
    offerDeleteIdMosaic (data) {
      // console.log('offerDeleteIdMosaic', data.idMosaic)
      // console.log('this.offerSelected.tableData.info.mosaicIdHex ', this.offerSelected.tableData.info.mosaicIdHex)
      if (this.offerSelected.tableData.info.mosaicIdHex === data.idMosaic) {
        this.data.sell = []
        this.data.buy = []
      }
    }

    // updateBoolean (newValue) {
    //   console.log('loadingInfo', newValue)
    //   const offerSelected = this.offerAll.find(
    //     l => l.tableData.info.mosaicIdHex === this.offerSelected.tableData.info.mosaicIdHex
    //   )
    //   console.log('offerSelected', offerSelected)
    //   if (offerSelected) {
    //     this.resultsOffer(offerSelected.allOffers, this.form.active)
    //     // this.data.buy = offerSelected.allOffers.buy
    //     // this.data.sell = offerSelected.allOffers.sell
    //   } else {
    //     this.resultsOffer({ buy: [], sell: [] }, this.form.active)
    //   }
    // }
  }
}
</script>
<style>
.title-size {
  font-size: 1.5rem !important;
}
</style>
