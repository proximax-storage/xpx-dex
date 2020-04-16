<template>
  <v-row class="ml-1 pt-0">
    <v-col cols="12">
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr style="border:0">
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">Initial amount</th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">Amount</th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">price</th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">Total (XPX)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(n, commentIndex) in commentsToShow" :key="commentIndex">
              <template v-if="commentIndex < resultsOfferFilter.length">
                <td class="pr-3 pl-3" style="border:0">
                  {{
                  $generalService.amountFormatter(
                  resultsOfferFilter[commentIndex].initialAmount.compact(),
                  '',
                  divisibility
                  )
                  }}
                </td>
                <td class="pr-3 pl-3" style="border:0">
                  {{
                  $generalService.amountFormatter(
                  resultsOfferFilter[commentIndex].amount.compact(),
                  '',
                  divisibility
                  )
                  }}
                </td>
                <td class="pr-3 pl-3" style="border:0">{{ resultsOfferFilter[commentIndex].price }}</td>
                <td class="pr-3 pl-3" style="border:0">
                  {{
                  $generalService.amountFormatter(
                  resultsOfferFilter[commentIndex].priceForAmount,
                  '',
                  6
                  )
                  }}
                </td>

                <td class="pr-3" align="center" style="border:0">
                  <v-chip
                    :color="typeOfferColor"
                    small
                    class="ma-2 text-capitalize text-center"
                    @click="triggerClick(resultsOfferFilter[commentIndex])"
                  >
                    <span class="pa-2 white--text">{{ type }}</span>
                  </v-chip>
                </td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12" class="d-flex justify-center align-center">
      <a
        class="title font-weight-regular text-left primary--text"
        v-if="
          commentsToShow < resultsOfferFilter.length || resultsOfferFilter.length > commentsToShow
        "
        @click="commentsToShow += 5"
      >Load more</a>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['resultsOfferFilter', 'divisibility', 'type'],
  data: () => ({
    typeOfferColor: null,
    commentsToShow: 5
  }),
  watch: {
    resultsOfferFilter: function (newExrDay) {
      this.commentsToShow = 5
    },
    type: {
      immediate: true,
      handler (value) {
        this.typeOfferColor = this.type === 'buy' ? 'dim' : 'pin'
        this.type = value
      }
    }
  },
  created () {
    this.typeOfferColor = this.type === 'buy' ? 'dim' : 'pin'
  },
  methods: {
    triggerClick (item) {
      this.$emit('sendOffer', item)
    }
  }
}
</script>
