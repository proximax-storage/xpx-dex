<template>
  <div>
    <v-list-item class=" ">
      <v-list-item-content class="">
        <v-list-item-title class="title pb-1">
          <span>{{ nameCurrentWallet }}</span>
        </v-list-item-title>
        <v-list-item-subtitle>
          <span class="body-2" v-text="getTotalBalance['part1']"></span>
          <span class="caption mr-2" v-text="getTotalBalance['part2']"></span>
          <span class="body-2 text-uppercase">{{ nameMosaic }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle class="body-2">
          USD {{ getTotalUsd | toCurrency }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="pt-1 body-2 font-regular">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
            v-bind:title="getMosaicsListLength"
          />{{ mosaicLength.length }}
        </v-list-item-subtitle>
        <!-- <v-progress-linear
          class="mt-1"
          :active="loadingInfoWallet.show"
          :indeterminate="loadingInfoWallet.show"
          botton
          color="sky"
          rounded
          height="9"
          ><strong class="caption font-italic font-weight-bold ">{{
            loadingInfoWallet.text
          }}</strong>
        </v-progress-linear> -->
      </v-list-item-content>
    </v-list-item>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      theme: 'light',
      nameMosaic: '',
      mosaicLength: [],
      usd: null,
      usdValue: '',
      loading: true
    }
  },
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet']),
    // ...mapState(['loadingInfoWallet']),
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
      return `Others Mosaics: ${this.mosaicLengthFunc()}`
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
    },
    mosaicLengthFunc () {
      this.mosaicLength = this.$store.getters['mosaicStore/othersMosaics'](
        this.$environment.mosaic.id
      )
      return this.mosaicLength.length
    }
  },
  beforeMount () {
    this.nameMosaic = this.$environment.mosaic.name
  }
}
</script>
