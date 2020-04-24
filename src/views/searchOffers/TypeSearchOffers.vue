<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" class="mx-auto text-center pb-0">
        <span class="headline font-weight-medium primary--text">{{title}}</span>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-card-title>
          Filter Assets {{assets}}
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :search="search"
          :loading="loadingInfo"
          :items="myOffers"
          :items-per-page="10"
          class="elevation-1 cursor-pointer"
          @click:row="searchResult"
        >
          <template v-slot:item.tableData.twentyFourChange="{ item }">
            <span
              v-if="item.tableData.twentyFourChange > 8"
              class="red--text accent-4"
            >{{item.tableData.twentyFourChange}}%</span>
            <span v-else class="green--text darken-1">{{item.tableData.twentyFourChange}}%</span>
          </template>
          <template v-slot:item.tableData.graphic="{ }">
            <sparkline :value="value" :height="height" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- <button @click="clickButton">RESET</button> -->
  </v-container>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => ({
    idMosaicsToSearch: [],
    items: [],
    title: 'Asset with available offers',
    search: '',
    headers: [
      { text: 'Asset', value: 'tableData.text' },
      { text: 'Average price (XPX)', value: 'tableData.averagePrice' },
      { text: '24h change', value: 'tableData.twentyFourChange' },
      { text: 'Price Graph', value: 'tableData.graphic' }
    ],
    value: [24, 150, 675, 320, 500, 200, 170, 250, 700],
    height: 25
  }),
  beforeDestroy () {
    this.sockets.unsubscribe('getMoisaicsInfo')
  },
  sockets: {
    connect: function () {},
    disconnect: function () {
      this.$socket.close()
    }
  },
  components: {
    sparkline: () => import('@/components/shared/Sparkline')
  },
  methods: {
    ...mapMutations('offersStore', ['SET_OFFER_SELECTED', 'SET_OFFER_ALL']),
    /* clickButton: function (data) {
      const valor = [
        {
          mosaicId: { id: { lower: 4209774098, higher: 27035008 } },
          mosaicIdHex: '019c8580faec0e12'
        }
      ]

      this.$store.dispatch('socketDbStore/insertMoisaicsInfo', { io: this.$socket, data: valor })
    }, */
    searchResult ($event) {
      this.SET_OFFER_SELECTED($event)
      this.$router.push('allOffer').catch(e => {})
    },
    filtersAssets (data) {
      // console.log('Filter assets data ====> ', data)
      let valor = []
      if (JSON.parse(JSON.stringify(data)).length > 0) {
        valor = data.map(item => {
          item.text = item.mosaicIdHex
          if (
            item.mosaicInfo !== null &&
            item.mosaicInfo !== undefined &&
            item.mosaicInfo[0] &&
            item.mosaicInfo[0].mosaicNames.names.length > 0
          ) {
            item.text = item.mosaicInfo[0].mosaicNames.names[0].name
          }
          return item
        })
      }

      // this.items = valor
      return valor
    },
    mapMosaicsId (filtersAssets) {
      this.items = []
      filtersAssets.forEach(element => {
        this.getBuy(element)
        this.getSell(element)
      })
    },
    getBuy (data) {
      this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 1).subscribe(offer => {
        // console.log('offer BUY', offer)
        this.progress = false
        this.items.push({
          info: data,
          type: 'buy',
          data: offer
        })
      })
    },
    getSell (data) {
      this.$blockchainProvider.getExchangeOffersfromId(data.mosaicIdHex, 0).subscribe(offer => {
        // console.log('offer Sell', offer)
        this.progress = false
        this.items.push({
          info: data,
          type: 'sell',
          data: offer
        })
      })
    },
    sumAllAmount (data) {
      let total = 0
      data.forEach(element => {
        total = total + element
      })

      return total
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo']),
    myOffers () {
      const pass = []
      const x = this.items.filter(x => x.data.length > 0)
      if (x.length > 0) {
        x.forEach(element => {
          if (element.info.mosaicInfo) {
            const price = this.sumAllAmount(element.data.map(x => x.price)) / element.data.length
            const amount = this.sumAllAmount(element.data.map(x => x.amount.compact()))
            const totalAssets = this.$generalService.amountFormatter(
              amount,
              element.info.mosaicInfo[0].mosaicInfo.properties.divisibility
            )
            const offersBuy = this.items.filter(
              x => x.info.mosaicIdHex === element.info.mosaicIdHex && x.type === 'buy'
            )
            const offersSell = this.items.filter(
              x => x.info.mosaicIdHex === element.info.mosaicIdHex && x.type === 'sell'
            )

            if (!pass.find(x => x.tableData.text === element.info.text)) {
              pass.push({
                tableData: {
                  text: element.info.text,
                  type: element.type,
                  totalAssetAvailable: totalAssets,
                  averagePrice: price,
                  info: element.info,
                  priceArray: element.data.map(x => x.price),
                  twentyFourChange: `${(
                    (Math.floor(Math.random() * 20) + Math.floor(Math.random() * 1000)) /
                    100
                  ).toFixed(2)}`
                },
                allOffers: {
                  sell: offersSell.length > 0 ? offersSell[0].data : offersSell,
                  buy: offersBuy.length > 0 ? offersBuy[0].data : offersBuy
                }
              })
            }
          }
        })
      }

      // console.log('ITsEMS', x)
      // console.log('pass', pass)
      this.SET_OFFER_ALL(pass)
      return pass
    },
    assets () {
      // console.log('MOSAICS IN OFFERS ---->', this.mosaicsInfOffer)
      const filtersAssets = this.filtersAssets(this.mosaicsInfOffer)
      // console.log('filtersAssets', filtersAssets)
      this.mapMosaicsId(filtersAssets)
      return ''
    }
  }
}
</script>
