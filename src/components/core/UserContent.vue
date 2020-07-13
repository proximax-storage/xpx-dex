<template>
  <div>
    <v-list-item class="pt-4">
      <v-list-item-content class>
        <v-list-item-title class="subtitle-1 pb-1 ml-1">
          <span>
            <v-btn icon color="primary" @click="activity('myWallet', 2)">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </span>
          <span>{{ nameCurrentWallet }}</span>
        </v-list-item-title>
        <v-divider class="mt-1" />
        <v-list-item-subtitle class="ml-1 pt-3">
          <span class="caption font-italic">Available balance</span>
          <br />
          <span class="subtitle-1" v-text="getTotalBalance['part1']"></span>
          <span class="caption mr-1" v-text="getTotalBalance['part2']"></span>
          <span class="subtitle-1 text-uppercase">{{ nameMosaic }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle
          class="pt-1 subtitle-2 ml-1 cursor-p"
          @click="activity('myWallet', 0)"
        >
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
            v-bind:title="getMosaicsListLength"
          />
          {{ mosaicLength.length }} mosaics
        </v-list-item-subtitle>
        <v-divider class="mt-1" />
        <v-list-item-subtitle class="pt-2 subtitle-2 font-weight-medium primary--text">
          <v-btn
            text
            small
            class="subtitle-2 primary--text"
            @click="activity('myWallet', 1)"
          >Activity</v-btn>
          <br />
          <v-btn
            text
            small
            class="subtitle-2 primary--text"
            @click="activity('myWallet', 3)"
          >My offert</v-btn>
        </v-list-item-subtitle>
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
      loading: true,
      environment: ''
    }
  },
  beforeMount () {
    this.environment = this.$store.getters.environment
    this.nameMosaic = this.environment.mosaic.name
  },
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet']),
    // ...mapState(['loadingInfoWallet']),
    getTotalBalance () {
      return this.$generalService.getDataPart(
        this.totalBalance(),
        this.environment.mosaic.divisibility
      )
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
    activity (action, item) {
      this.$router.push({ path: `${action}`, query: { item: item } }).catch(e => {})
    },
    totalBalance () {
      const total = this.$generalService.amountFormatter(
        this.$store.getters['accountStore/totalBalance'](this.environment.mosaic.id),
        this.environment.mosaic.divisibility
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
        this.environment.mosaic.id
      )
      return this.mosaicLength.length
    },
    mosaicList () {
    }
  }
}
</script>
