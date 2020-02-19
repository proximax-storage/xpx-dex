<template>
  <div>
    <v-list-item class=" mt-2 mr-4 ml-4 white--text">
      <v-list-item-content class="white--text">
        <v-list-item-title class="title">
          <span>{{ nameCurrentWallet }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="white--text pt-2 subtitle-1">
          <span class="subtitle-1" v-text="getTotalBalance['part1']"></span>
          <span class="subtitle-2 mr-2" v-text="getTotalBalance['part2']"></span>
          <span class="text-uppercase">{{ nameMosaic }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle class="white--text subtitle-2">
          USD {{ getTotalUsd | toCurrency }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="white--text pt-2 subtitle-2 font-regular">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaics.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
          />
          {{ getMosaicsListLength }} Mosaics
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mt-1 mr-4 ml-4 white" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      theme: 'light',
      nameMosaic: '',
      usd: null,
      usdValue: ''
    }
  },
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet']),
    getTotalBalance () {
      const vestedBalance = this.$generalService.getDataPart(
        this.totalBalance(),
        this.$environment.mosaic.divisibility
      )
      return vestedBalance
    },
    getTotalUsd () {
      this.coingecko(this.totalBalance())
      return this.usdValue
    },
    getMosaicsListLength () {
      return this.$store.getters['mosaicStore/mosaics'].length
    }
  },
  methods: {
    totalBalance () {
      const total = this.$generalService.amountFormatter(
        this.$store.getters['accountStore/totalBalance'](this.$environment.mosaic.id),
        this.$environment.mosaic.id,
        this.$environment.mosaic.divisibility
      )
      return total
    },
    async coingecko (xpx) {
      const coingeckoResponse = await this.$blockchainProvider.coingecko('proximax')
      if (coingeckoResponse.data['market_data']['current_price'].usd !== undefined) {
        this.usdValue =
          Number(xpx.replace(/,/g, '')) * coingeckoResponse.data['market_data']['current_price'].usd
      } else {
        this.usdValue = 0
      }
      return this.usdValue
    }
  },
  beforeMount () {
    this.nameMosaic = this.$environment.mosaic.name
  }
}
</script>
