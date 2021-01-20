<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" class="mx-auto text-center pb-0">
        <span class="headline font-weight-medium primary--text">{{ title }}</span>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <!-- {{offerAll}} -->
      <v-col cols="12">
        <v-card-title>
          Filter Assets
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
          :items="offerAll"
          :items-per-page="10"
          class="elevation-1 cursor-pointer"
          @click:row="searchResult"
        >
          <template v-slot:item.tableData.twentyFourChange="{ item }">
            <span v-if="item.tableData.twentyFourChange > 8" class="red--text accent-4"
              >{{ item.tableData.twentyFourChange }}%</span
            >
            <span v-else class="green--text darken-1">{{ item.tableData.twentyFourChange }}%</span>
          </template>
          <template v-slot:item.tableData.graphic="{}">
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
      { text: 'Average Price (XPX)', value: 'tableData.averagePrice' },
      { text: '24h Change', value: 'tableData.twentyFourChange' },
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
    ...mapMutations('offersStore', ['SET_OFFER_SELECTED']),
    searchResult ($event) {
      this.SET_OFFER_SELECTED($event)
      this.$router.push('allOffer').catch(e => {})
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'loadingInfo']),
    ...mapGetters('offersStore', ['offerAll']),
    myOffers () {
      return []
    }
  }
}
</script>
