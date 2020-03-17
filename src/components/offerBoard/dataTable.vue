<template>
  <v-row>
    <search-filter @lookAgainf="lookAgainf" :dataForm="dataAssets" />
    <v-col cols="8">
      <v-row>
        <v-progress-linear v-if="progress" indeterminate color="primary"></v-progress-linear>
        <v-col v-if="dataAssets && resultsOfferFilter.length > 0" cols="12"
          ><div class="title font-weight-regular  text-left primary--text">
            {{ resultsOfferFilter.length }} results match with your offer
          </div>

          <simple-table
            :resultsOfferFilter="resultsOfferFilter"
            :divisibility="dataAssets.configMoney.precision"
            :type="dataAssets.form.active"
            @sendOffer="sendOffer"
          >
          </simple-table>
        </v-col>
      </v-row>
      <v-row
        ><v-col v-if="dataAssets && otheResultsOfferFilter.length > 0" cols="12"
          ><div class="title font-weight-regular  text-left primary--text">
            other results match with your offer
          </div>
          <simple-table
            v-if="dataAssets"
            :resultsOfferFilter="otheResultsOfferFilter"
            :divisibility="dataAssets.configMoney.precision"
            :type="dataAssets.form.active"
            @action="sendOffer"
          >
          </simple-table> </v-col
      ></v-row>
    </v-col>
    <v-col cols="4"> </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['dataAssets'],
  data: () => ({
    porcetRange: 60,
    resultsOfferFilter: [],
    otheResultsOfferFilter: [],
    progress: false
  }),
  components: {
    'search-filter': () => import('@/components/offerBoard/SearchFilter'),
    'simple-table': () => import('@/components/offerBoard/SimpleTable')
  },
  methods: {
    sendOffer (value) {
      console.log('alarm:', value)
    },
    lookAgainf (value) {
      this.getExchangeOffersfromId(value)
    },
    resultsOffer (data, form) {
      const amount = this.$generalService.quantityStringToInt(
        form.amount,
        this.dataAssets.configMoney.precision
      )
      this.resultsOfferFilter = []
      this.otheResultsOfferFilter = []
      for (let item of data) {
        const range = (amount * this.porcetRange) / 100
        const quantitySum = range + amount
        const quantityRes = amount - range
        const quantity = item.amount.compact()
        if (quantity === amount) {
          this.resultsOfferFilter.push(item)
        } else if (quantity >= quantityRes && quantity <= quantitySum) {
          this.otheResultsOfferFilter.push(item)
        }
      }
    },
    getExchangeOffersfromId (form) {
      this.progress = true
      this.$blockchainProvider
        .getExchangeOffersfromId(
          this.dataAssets.mosaicInfo[0].mosaicIdHex,
          form.active === 'buy' ? 1 : 0
        )
        .subscribe(offer => {
          this.progress = false
          if (offer && offer.length > 0) {
            this.resultsOffer(offer, form)
          }
        })
    }
  },
  created () {
    if (this.dataAssets) {
      this.getExchangeOffersfromId(this.dataAssets.form)
    }
  }
}
</script>
