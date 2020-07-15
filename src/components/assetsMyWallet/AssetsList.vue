<template>
  <div>
    <v-divider class="mt-1" />

    <simple-table
      v-if="othersAssets"
      :dataTh="dataTh"
      :type="''"
      :dataTable="othersAssets"
      :mosaicInfo="[]"
      @action="action"
    ></simple-table>
    <v-progress-linear v-if="loadingInfo" indeterminate color="cyan"></v-progress-linear>
  </div>
</template>
<script>
import { buildCurrentAccountInfo } from '@/services/account-wallet-service'
import { mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      theme: 'light',
      dataTh: ['Assets', 'Available']
    }
  },
  computed: {
    ...mapState(['loadingInfoWallet']),
    ...mapGetters('accountStore', ['mosaicBuild', 'accountInfoByNameAccount', 'currentAccount']),
    othersAssets () {
      return this.buildDataTable(this.mosaicBuild)
    },
    loadingInfo () {
      const value =
        this.loadingInfoWallet.type === 'mosaicsInfo' ? this.loadingInfoWallet.show : false
      if (value) {
        const accountFiltered = this.accountInfoByNameAccount(this.currentAccount.name)
        buildCurrentAccountInfo(accountFiltered.accountInfo)
      }
      return value
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable')
  },
  methods: {
    action (exchange) {},
    buildDataTable (assets) {
      let assetsBuild = []
      if (assets.length > 0) {
        assetsBuild = assets.map(f => {
          return {
            assets: f.nameMosaic,
            available: f.balance
          }
        })
      }
      return assetsBuild
    }
  }
}
</script>
