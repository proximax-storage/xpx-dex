<template>
  <v-row class="ml-1 pt-0">
    <v-col cols="12">
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr style="border:0">
              <th style="border:0" class="text-right subtitle-1 font-weight-bold">
                Initial Quantity
              </th>
              <th  style="border:0" class="text-right subtitle-1 font-weight-bold">
                Quantity Available
              </th>
              <!-- <th style="border:0" class="text-left subtitle-1 font-weight-bold">price</th> -->
              <th style="border:0" class="text-right subtitle-1 font-weight-bold">Price (XPX)</th>
              <th style="border:0" class="text-right subtitle-1 font-weight-bold">Total (XPX)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(n, commentIndex) in commentsToShow" :key="commentIndex">
              <template v-if="commentIndex < resultsOfferFilter.length">
                <!-- {{divisibility}} -->
                <td style="border:0" class="text-right">
                  {{
                    $generalService.amountFormatter(
                      resultsOfferFilter[commentIndex].initialAmount.compact(),
                      divisibility
                    )
                  }}
                </td>
                <td  style="border:0" class="text-right">
                  {{
                    $generalService.amountFormatter(
                      resultsOfferFilter[commentIndex].amount.compact(),
                      divisibility
                    )
                  }}
                </td>
                <td  style="border:0" class="text-right" >
                  {{
                    $generalService.amountFormatter(resultsOfferFilter[commentIndex].bitPrice, 6)
                  }}
                </td>
                <td  style="border:0 " class="text-right">
                  {{
                    $generalService.amountFormatter(
                      resultsOfferFilter[commentIndex].priceForAmount,
                      6
                    )
                  }}
                </td>

                <td   style="border:0" class="text-right">
                  <v-chip
                    v-if="
                      resultsOfferFilter[commentIndex].owner.publicKey !== currentAccount.publicKey
                    "
                    :color="typeOfferColor"
                    small
                    class="ma-2 text-capitalize text-center"
                    @click="triggerClick(resultsOfferFilter[commentIndex])"
                  >
                    <span class="pa-2 white--text">{{ $generalService.typeInvert(type) }}</span>
                  </v-chip>
                  <v-chip
                    v-if="
                      resultsOfferFilter[commentIndex].owner.publicKey === currentAccount.publicKey
                    "
                    color="white"
                    small
                    class="ma-2 text-capitalize text-center"
                  >
                    <span class="pa-2 primary--text">owner</span>
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
        >Load more</a
      >
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['resultsOfferFilter', 'divisibility', 'type'],
  data () {
    return { typeOfferColor: null, commentsToShow: 5 }
  },
  watch: {
    resultsOfferFilter: function (newExrDay) {
      this.commentsToShow = 5
    },
    type: {
      immediate: true,
      handler (value) {
        this.typeOfferColor = this.typeAction(value)
      }
    },
    divisibility: {
      immediate: true,
      handler (value) {
        this.divisibility = value
      }
    }
  },
  created () {
    this.typeOfferColor = this.typeAction(this.type)
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount'])
  },

  methods: {
    triggerClick (item) {
      this.$emit('sendOffer', item)
    },
    typeAction (type = null) {
      this.type = type
      if (type === 'buy') {
        return 'dim'
      } else if (type === 'sell') {
        return 'pin'
      } else if (type === 'cancel') {
        return 'red'
      }
    }
  }
}
</script>
