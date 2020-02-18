<template>
  <div>
    <v-list-item class=" mt-2 mr-4 ml-4 white--text">
      <v-list-item-content class="white--text">
        <v-list-item-title class="title">
          <span>{{ nameCurrentWallet }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="white--text pt-2 subtitle-1">
          <span class="subtitle-1" v-text="totalBalance['part1']"></span>
          <span class="subtitle-2 mr-2" v-text="totalBalance['part2']"></span>
          <span class="text-uppercase">{{ nameMosaic }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle class="white--text subtitle-2">
          USD 1,000.00
        </v-list-item-subtitle>
        <v-list-item-subtitle class="white--text pt-2 subtitle-2 font-regular">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaics.svg`)"
            alt="logo"
            class="pr-1"
            height="20"
          />
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
      nameMosaic: ''
    }
  },
  computed: {
    ...mapGetters('walletStore', ['nameCurrentWallet']),
    totalBalance () {
      const total = this.$generalService.amountFormatter(
        this.$store.getters['accountStore/totalBalance'](this.$environment.mosaic.id),
        this.$environment.mosaic.id,
        this.$environment.mosaic.divisibility
      )
      const vestedBalance = this.$generalService.getDataPart(
        total,
        this.$environment.mosaic.divisibility
      )
      return vestedBalance
    }
  },
  beforeMount () {
    this.nameMosaic = this.$environment.mosaic.name
  }
}
</script>
