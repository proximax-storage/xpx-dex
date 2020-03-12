<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="6">
        <div class="headline font-weight-regular  text-left primary--text">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            width="25"
            height="25"
          />
          {{ nameMosaicInfo }}
        </div>
        <div class="font-weight-regular pt-1" style="font-size: 0.7rem;">
          Avg Price: 0.00032 pxp
        </div>
      </v-col>
      <v-col clos="6"> Grafic</v-col>
    </v-row>
    <search-filter :dataForm="dataAssets" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      theme: 'light',
      dataAssets: null
    }
  },
  computed: {
    ...mapGetters('socketDbStore', ['mosaicsInfOffer', 'mosaicsInfOfferFromIdHex']),
    assets: {
      get () {
        return this.mosaicsInfOffer
      }
    },
    nameMosaicInfo () {
      let nameMosaics = null
      if (this.$route.params['form']) {
        const mosaic = this.mosaicsInfOfferFromIdHex(this.$route.params['form'].asset)
        if (mosaic[0].mosaicInfo !== null && mosaic[0].mosaicInfo !== undefined) {
          nameMosaics =
            mosaic[0].mosaicInfo[0].mosaicNames.names.length > 0
              ? mosaic[0].mosaicInfo[0].mosaicNames.names[0].name
              : mosaic[0].text
        }

        this.setSearch(this.$route.params['form'], mosaic)
      }
      return nameMosaics
    }
  },
  components: {
    'search-filter': () => import('@/components/offerBoard/SearchFilter')
  },
  methods: {
    configOtherMoneyAsset (data) {
      const configMoney = {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 6,
        masked: false
      }
      if (data[0].mosaicInfo) {
        configMoney.precision = data[0].mosaicInfo[0].mosaicInfo.properties.divisibility
      }
      return configMoney
    },
    setSearch (form, mosaicInfo) {
      const configMoney = this.configOtherMoneyAsset(mosaicInfo)
      if (form) {
        this.dataAssets = { form: form, mosaicInfo: mosaicInfo, configMoney: configMoney }
      } else {
        this.$router.push({ path: '/searchOfferts' })
      }
    }
  }
}
</script>
