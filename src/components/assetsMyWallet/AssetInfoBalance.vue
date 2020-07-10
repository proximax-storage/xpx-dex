<template>
  <v-row class="ml-3">
    <v-col xs="12" sm="12" md="10" lg="4" xl="4" class="d-flex mx-auto">
      <div>
        <div class="subtitle-1 font-weight-black">Available balances</div>
        <div class="subtitle-1 ma-0 pa-0">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
          />
          <span class="subheading" v-text="getTotalBalance['part1']"></span>
          <span class="subheading mr-1" v-text="getTotalBalance['part2']"></span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div class="caption font-italic font-weight-thin mx-auto">USD {{getTotalUsd | toCurrency}}</div>
      </div>
    </v-col>
    <v-col xs="12" sm="12" md="10" lg="4" xl="4" class="d-flex mx-auto">
      <div>
        <div class="subtitle-1 font-weight-black">On hold balances</div>
        <div class="subtitle-1 ma-0 pa-0">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
          />
          <span class="subheading" v-text="getTotalBalance['part1']"></span>
          <span class="subheading mr-1" v-text="getTotalBalance['part2']"></span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div class="caption font-italic font-weight-thin mx-auto">USD {{getTotalUsd | toCurrency}}</div>
      </div>
    </v-col>
    <v-col xs="12" sm="12" md="10" lg="4" xl="4" class="d-flex mx-auto">
      <div>
        <div class="subtitle-1 font-weight-black">Total balance</div>
        <div class="subtitle-1 ma-0 pa-0">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
          />
          <span class="subheading" v-text="getTotalBalance['part1']"></span>
          <span class="subheading mr-1" v-text="getTotalBalance['part2']"></span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div class="caption font-italic font-weight-thin mx-auto">USD {{getTotalUsd | toCurrency}}</div>
      </div>
    </v-col>
    <v-divider class="mt-1" />
  </v-row>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      theme: 'light',
      nameMosaic: null
    }
  },
  computed: {
    ...mapGetters('coingeckoStore', ['xpxInformation']),
    getTotalUsd () {
      console.log('xpxInformation', this.xpxInformation)
      if (this.xpxInformation) {
        return this.coingecko(this.xpxInformation, this.totalBalance(), 'usd')
      } else {
        return 0
      }
    },
    getTotalBalance () {
      return this.$generalService.getDataPart(
        this.totalBalance(),
        this.$store.getters.environment.mosaic.divisibility
      )
    }
  },
  beforeMount () {
    this.nameMosaic = this.$store.getters.environment.mosaic.name
    this.searchInformationXPX(this.$store.getters)
    // this.searchInformation()
  },
  methods: {
    ...mapActions('coingeckoStore', ['searchInformationXPX']),
    totalBalance () {
      const total = this.$generalService.amountFormatter(
        this.$store.getters['accountStore/totalBalance'](this.$store.getters.environment.mosaic.id),
        this.$store.getters.environment.mosaic.divisibility
      )
      return total
    },
    coingecko (xpxInformation, xpx, fiatCurrency) {
      let usdValue = null
      if (xpxInformation.market_data.current_price[fiatCurrency] !== undefined) {
        usdValue =
          Number(xpx.replace(/,/g, '')) * xpxInformation.market_data.current_price[fiatCurrency]
      } else {
        usdValue = 0
      }
      return usdValue
    }
  }
}
</script>
