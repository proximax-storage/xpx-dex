<template>
  <v-row>
    <v-col cols="12">
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr style="border:0">
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">Amount</th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">
                Initial amount
              </th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">
                Total (XPX)
              </th>
              <th style="border:0" class="text-left subtitle-1 font-weight-bold">price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(n, commentIndex) in commentsToShow" :key="commentIndex">
              <template v-if="commentIndex < resultsOfferFilter.length">
                <td class="pr-3 pl-3" style="border:0">
                  {{
                    $generalService.amountFormatter(
                      resultsOfferFilter[commentIndex].amount.compact(),
                      '',
                      divisibility
                    )
                  }}
                </td>
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
                      resultsOfferFilter[commentIndex].initialCost.compact(),
                      '',
                      6
                    )
                  }}
                </td>
                <td class="pr-3 pl-3" style="border:0">
                  {{ resultsOfferFilter[commentIndex].price }}
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
        <div
          v-if="
            commentsToShow < resultsOfferFilter.length || resultsOfferFilter.length > commentsToShow
          "
        >
          <v-chip @click="commentsToShow += 1">show more resultsOfferFilter</v-chip>
        </div>
      </v-simple-table>
    </v-col>
    <v-col cols="12" class="d-flex justify-center align-center "
      ><a
        class="title font-weight-regular  text-left primary--text"
        v-if="
          commentsToShow < resultsOfferFilter.length || resultsOfferFilter.length > commentsToShow
        "
        @click="commentsToShow += 1"
      >
        Load more</a
      >
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['resultsOfferFilter', 'divisibility', 'type'],
  data: () => ({
    typeOfferColor: null,
    commentsToShow: 1
  }),
  watch: {
    resultsOfferFilter: function (newExrDay) {
      console.log('estoy aqui vale ')
      this.commentsToShow = 1
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
<style>
tr:nth-child(even) {
  background: #ccc;
}
tr:nth-child(odd) {
  background: #fff;
}
</style>
