<template>
  <div class="pa-3">
    <info-Mosaic :name="nameMosaicInfo" />
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-row>
          <v-col col="12 pa-0">
            <v-item-group mandatory v-model="form.active">
              <v-row>
                <v-col cols="6" class="mr-0 pr-0 pb-0">
                  <v-item v-slot:default="{ active, toggle }" value="buy">
                    <v-row class="mx-auto mr-0 pr-0">
                      <v-col class="mr-0 pr-0" justify="center" align="center">
                        <v-btn color="dim" min-width="200" @click="toggle()" text block>
                          <span class="font-italic font-weight-bold headline text-capitalize">Buy</span>
                        </v-btn>
                        <v-scroll-y-transition>
                          <v-sheet height="4" tile :color="active ? 'dim' : 'grey lighten-2'"></v-sheet>
                        </v-scroll-y-transition>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
                <v-col cols="6" class="ml-0 pl-0 pb-0">
                  <v-item v-slot:default="{ active, toggle }" value="sell">
                    <v-row class="mx-auto">
                      <v-col class="ml-0 pl-0" justify="center" align="center">
                        <v-btn color="pin" min-width="200" @click="toggle()" text block mall>
                          <span class="font-italic font-weight-bold headline text-capitalize">Sell</span>
                        </v-btn>
                        <v-scroll-y-transition>
                          <v-sheet height="4" tile :color="active ? 'pin' : 'grey lighten-2'"></v-sheet>
                        </v-scroll-y-transition>
                      </v-col>
                    </v-row>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12 mt-0">
            <v-progress-linear v-if="progress" indeterminate color="primary"></v-progress-linear>
            <simple-table
              :type="form.active"
              :resultsOfferFilter="data[form.active]"
              :divisibility="propertiesMosaic.divisibility"
              @sendOffer="sendOffer"
            ></simple-table>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="5" md="5" lg="3" col="3" class="pt-0">
        <card-new-offert :dataAssets="dataAssets" />
        <card-other-assets :dataAssets="dataAssets" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
      form: { active: 'sell' },
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
    'simple-table': () => import('@/components/AllOfferBoard/SimpleTable')
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'mosaicsInfOfferFromIdHex']),
    nameMosaicInfo () {
      return this.nameMosaic('2dad1fc91904b5af')
    },
    resultsData () {
      const key = this.form.active
      return this.data[key]
    }
  },
  methods: {
    nameMosaic (IdHex) {
      let nameMosaics = null
      if (IdHex) {
        console.log(this.mosaic)
        this.mosaic = this.mosaicsInfOfferFromIdHex(IdHex)
        console.log(this.mosaic)
        if (this.mosaic[0].mosaicInfo !== null && this.mosaic[0].mosaicInfo !== undefined) {
          nameMosaics =
            this.mosaic[0].mosaicInfo[0].mosaicNames.names.length > 0
              ? this.mosaic[0].mosaicInfo[0].mosaicNames.names[0].name
              : this.mosaic[0].text
        }
      }
      return nameMosaics
    },
    mosaicInfoProperties (IdHex) {
      let properties = {
        divisibility: null,
        duration: null,
        supplyMutable: null,
        transferable: null
      }
      const mosaic = this.mosaicsInfOfferFromIdHex(IdHex)
      if (mosaic) properties = mosaic[0].mosaicInfo[0].mosaicInfo.properties
      return properties
    },
    resultsOffer (data = [], type = null) {
      console.log('data', data)
      for (let item of data) {
        item.priceForAmount = item.amount.compact() * item.price
        this.data.sell.push(item)
      }
    },
    sendOffer (value) {
      this.dataAssets.configMoney.precision = this.propertiesMosaic.divisibility
      this.dataAssets.mosaicInfo = this.mosaic[0].mosaicInfo[0]
      this.dataAssets.form.asset = '2dad1fc91904b5af'
      console.log('this.dataAssets', this.dataAssets)

      this.$store.commit('mosaicExchange/SET_EXCHANGE', value)
      this.$store.commit('mosaicExchange/SET_DATA_ASSETS', this.dataAssets)
      if (this.$store.getters['accountStore/isLogged']) {
        this.$router.push({ path: '/take-offers' })
      } else {
        this.$router.push({ path: '/searchOfferts' })
      }
    }
  },
  beforeMount () {
    this.propertiesMosaic = this.mosaicInfoProperties('2dad1fc91904b5af')
    this.progress = true
    this.$blockchainProvider
      .getExchangeOffersfromId('2dad1fc91904b5af', this.form.active === 'buy' ? 1 : 0)
      .subscribe(offer => {
        this.progress = false
        if (offer && offer.length > 0) {
          this.resultsOffer(offer)
        }
      })
  }
}
</script>
