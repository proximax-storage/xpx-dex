<template>
  <div class="pa-3">
    <info-Mosaic :name="nameMosaicInfo" />
    <search-filter @lookAgainf="lookAgainf" :dataForm="dataAssets" />
    <v-row>
      <data-table :dataAssets="dataAssets" />
      <card-newOffert :dataAssets="dataAssets"/>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      dataAssets: null,
      mosaic: null
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
      return this.nameMosaic(this.$route.params['form'])
    }
  },
  components: {
    'info-Mosaic': () => import('@/components/offerBoard/InfoMosaic'),
    'search-filter': () => import('@/components/offerBoard/SearchFilter'),
    'card-newOffert': () => import('@/components/shared/CardNewOffert'),
    'data-table': () => import('@/components/offerBoard/dataTable')
  },
  methods: {
    nameMosaic (form) {
      let nameMosaics = null
      if (form) {
        this.mosaic = this.mosaicsInfOfferFromIdHex(this.$route.params['form'].asset)
        if (this.mosaic[0].mosaicInfo !== null && this.mosaic[0].mosaicInfo !== undefined) {
          nameMosaics =
            this.mosaic[0].mosaicInfo[0].mosaicNames.names.length > 0
              ? this.mosaic[0].mosaicInfo[0].mosaicNames.names[0].name
              : this.mosaic[0].text
        }

        this.setSearch(form, this.mosaic)
      }
      return nameMosaics
    },
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
    },
    lookAgainf (value) {
      const form = this.$route.params['form']
      form.amount = value.amount
      this.setSearch(form, this.mosaic)
    }
  }
}
</script>
