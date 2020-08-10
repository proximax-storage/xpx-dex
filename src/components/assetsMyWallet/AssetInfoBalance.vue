<template>
  <v-row class="ml-3 d-flex mx-auto  justify-lg-end">
    <v-col xs="12" sm="6" md="6" lg="4" xl="4" class="d-flex  ">
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
          <span class="subheading" v-text="getAvailableBalance['part1']"></span>
          <span class="subheading mr-1" v-text="getAvailableBalance['part2']"></span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div
          class="caption font-italic font-weight-thin mx-auto"
        >USD {{getBalanceUsd.availableBalance | toCurrency}}</div>
      </div>
    </v-col>
    <v-col xs="12" sm="6" md="6" lg="4" xl="4" class="d-flex ">
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
          <span class="subheading mr-1">{{getOnHoldBalance}}</span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div
          class="caption font-italic font-weight-thin mx-auto"
        >USD {{getBalanceUsd.onHoldBalance | toCurrency}}</div>
      </div>
    </v-col>
    <v-col xs="12" sm="6" md="6" lg="4" xl="4" class="d-flex ">
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
          <span class="subheading mr-1">{{getTotalBalance}}</span>
          <span class="subheading text-uppercase">{{ nameMosaic}}</span>
        </div>
        <div
          class="caption font-italic font-weight-thin mx-auto"
        >USD {{getBalanceUsd.totalBalance | toCurrency}}</div>
      </div>
    </v-col>

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
    ...mapGetters('offersStore', ['offerAll', 'type']),
    ...mapGetters('accountStore', ['currentAccount']),
    getBalanceUsd () {
      const currency = 'usd'
      let balanceUsd = {
        availableBalance: 0,
        onHoldBalance: 0,
        totalBalance: 0
      }
      if (this.xpxInformation) {
        balanceUsd.availableBalance = this.coingecko(
          this.xpxInformation,
          this.totalBalance(),
          currency
        )
        balanceUsd.onHoldBalance = this.coingecko(
          this.xpxInformation,
          this.getOnHoldBalance,
          currency
        )
        balanceUsd.totalBalance = this.coingecko(
          this.xpxInformation,
          this.getTotalBalance,
          currency
        )
      }
      return balanceUsd
    },
    getAvailableBalance () {
      return this.$generalService.getDataPart(
        this.totalBalance(),
        this.$store.getters.environment.mosaic.divisibility
      )
    },
    getOnHoldBalance () {
      return this.$generalService.amountFormatter(this.onHoldBalance(this.offerAll), this.$store.getters.environment.mosaic.divisibility)
    },

    getTotalBalance () {
      let totalBalance = 0
      let OnHoldBalance = 0
      totalBalance = this.$store.getters['accountStore/totalBalance'](
        this.$store.getters.environment.mosaic.id
      )
      OnHoldBalance = this.onHoldBalance(this.offerAll)
      const total = totalBalance + OnHoldBalance
      return this.$generalService.amountFormatter(total, this.$store.getters.environment.mosaic.divisibility)
    }
  },
  beforeMount () {
    this.nameMosaic = this.$store.getters.environment.mosaic.name
    this.searchInformationXPX(this.$store.getters)
  },
  methods: {
    ...mapActions('coingeckoStore', ['searchInformationXPX']),
    onHoldBalance (offerAll) {
      const offerts = this.filtersOfferts(offerAll, this.currentAccount.publicKey, 'buy')
      let totalCost = 0
      if (offerts && offerts.length > 0) {
        for (let i of offerts) {
          totalCost = totalCost + i.initialCost.compact()
        }
      }
      return totalCost
    },
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
    },
    filtersOfferts (offerts, publicKey, type) {
      let offersForPublicKey = []
      offerts.forEach(offer => {
        if (offer.allOffers[type].length > 0) {
          if (offer.allOffers[type][0].owner.publicKey === publicKey) {
            offersForPublicKey.push(offer.allOffers[type][0])
          }
        }
      })
      return offersForPublicKey
    }
  }
}
</script>
