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
      dataTh: ['Assets', 'Available', 'Icon']
    }
  },
  computed: {
    ...mapState(['loadingInfoWallet']),
    ...mapGetters('accountStore', ['mosaicBuild', 'accountInfoByNameAccount', 'currentAccount']),
    ...mapGetters('mosaicStore', ['iconMosaic']),
    othersAssets () {
      return this.buildDataTable(this.mosaicBuild, this.iconMosaic)
    },
    loadingInfo () {
      const value =
        this.loadingInfoWallet.type === 'mosaicsInfo' ? this.loadingInfoWallet.show : false
      if (value) {
        this.accountFiltered()
      }
      return value
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable')
  },
  methods: {
    action (exchange) {},
    accountFiltered () {
      const accountFiltered = this.accountInfoByNameAccount(this.currentAccount.name)
      if (accountFiltered) buildCurrentAccountInfo(accountFiltered.accountInfo)
    },
    buildDataTable (assets, iconArray) {
      let assetsBuild = []
      if (assets.length > 0) {
        assetsBuild = assets.map(f => {
          return {
            assets: f.nameMosaic,
            available: f.balance,
            icon: this.getIcon(f.mosaicIdHex, iconArray)
          }
        })
      }
      return assetsBuild
    },
    getIcon (mosaicIdHex, iconArray) {
      let base64Img = ''
      const icon = iconArray.find(x => x.mosaicId.toHex() === mosaicIdHex)
      if (icon) {
        base64Img = icon.iconBase64
      }
      return base64Img
    }
  },
  beforeMount () {
    this.accountFiltered()
  }
}
</script>
