<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="12">{{ nameMosaicInfo }}</v-col>
    </v-row>
  </div>
  <!-- <v-container > offertas board</v-container> -->
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      asset: null,
      amount: null,
      bidPrice: null
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
      }
      return nameMosaics
    }
  },
  methods: {
    setSearch (data) {
      this.asset = data.asset
      this.amount = data.amount
      this.bidPrice = data.bidPrice
    }
  },

  created () {
    if (this.$route.params['form']) {
      this.setSearch(this.$route.params['form'])
    } else {
    }
    console.log(this.$route.params['form'])
    console.log(this.$route.params)
  }
}
</script>
