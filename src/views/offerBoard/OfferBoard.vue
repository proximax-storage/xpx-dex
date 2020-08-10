<template>
  <div class="pa-3">
    <info-Mosaic :name="nameMosaicInfo" />
    <search-filter @lookAgainf="lookAgainf" :dataForm="dataAssets" />
    <v-row>
      <v-col sm="7"  md="7" lg="9" col="9" class="pt-0">
        <data-table :dataAssets="dataAssets" />
      </v-col>
      <v-col  sm="5" md="5" lg="3" col="3" class="pt-0">
        <card-new-offert  :dataAssets="dataAssets"  />
        <card-other-assets :dataAssets="dataAssets"  />
      </v-col>
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
    'card-new-offert': () => import('@/components/shared/CardNewOffert'),
    'card-other-assets': () => import('@/components/shared/CardOtherAssets'),
    'data-table': () => import('@/components/offerBoard/dataTable')
  },
  methods: {
    nameMosaic (form) {
      let nameMosaics = null
      if (form) {
        this.mosaic = this.mosaicsInfOfferFromIdHex(form.asset)
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
        // console.log('this.dataAssets', this.dataAssets)
      } else {
        this.$router.push({ path: '/searchOfferts' })
      }
    },
    lookAgainf (value) {
      // console.log('value', value)
      const form = this.$route.params['form']
      form.amount = value.amount
      this.setSearch(form, this.mosaic)
    }
  }
}
</script>
