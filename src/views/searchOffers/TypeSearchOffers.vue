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
          Total Assets ({{assets.length}})
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
        ></v-data-table>
      </v-col>
    </v-row>

    <button @click="$store.commit('socketDbStore/SOCKET_SET_MOSAIC_INFO', [])">RESET</button>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    idMosaicsToSearch: [],
    items: [],
    title: 'Asset with available offers',
    search: '',
    headers: [
      { text: 'Type', value: 'type' },
      { text: 'Asset', value: 'mosaicId' },
      { text: 'Total assets available', value: 'totalAssetAvailable' },
      { text: 'Average price', value: 'averagePrice' },
      { text: 'Price Graph', value: 'graphic' }
    ]
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
  components: {},
  methods: {
    filtersAssets (data) {
      console.log('Filter assets data ====> ', data)
      let valor = []
      if (JSON.parse(JSON.stringify(data)).length > 0) {
        valor = data.map(item => {
          item.text = item.mosaicIdHex.toUpperCase()
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
      console.log('mapMosaicsId')
      const idMosaicsToSearch = filtersAssets.map(x => x.mosaicIdHex)
      console.log('idMosaicsToSearch', idMosaicsToSearch)
      this.items = []
      idMosaicsToSearch.forEach(element => {
        this.getBuy(element)
        this.getSell(element)
      })
    },
    getBuy (id) {
      this.$blockchainProvider.getExchangeOffersfromId(id, 1).subscribe(offer => {
        console.log('offer BUY', offer)
        this.progress = false
        this.items.push({
          mosaicId: id,
          type: 'buy',
          data: offer
        })
      })
    },
    getSell (id) {
      this.$blockchainProvider.getExchangeOffersfromId(id, 0).subscribe(offer => {
        console.log('offer Sell', offer)
        this.progress = false
        this.items.push({
          mosaicId: id,
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
          pass.push({
            mosaicId: element.mosaicId,
            type: element.type,
            totalAssetAvailable: this.sumAllAmount(element.data.map(x => x.amount.compact())),
            averagePrice: this.sumAllAmount(element.data.map(x => x.price)) / element.data.length
          })
        })
      }
      return pass
    },
    assets () {
      console.log('MOSAICS IN OFFERS ---->', this.mosaicsInfOffer)
      const filtersAssets = this.filtersAssets(this.mosaicsInfOffer)
      console.log('filtersAssets', filtersAssets)
      this.mapMosaicsId(filtersAssets)
      return filtersAssets
    }
  }
}
</script>
