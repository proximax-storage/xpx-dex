<template>
  <v-col cols="4" class="">
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" color="leve">
          <v-card-title class="headline">None of these offers is useful for you?</v-card-title>
          <custom-buttons
            class="pb-4"
            @action="ownOffer"
            :align="'center'"
            :arrayBtn="buttons"
          ></custom-buttons>
          <!-- </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['dataAssets'],
  data: () => ({}),
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  computed: {
    buttons () {
      const btn = this.btn
      btn['ownOffer'].color = this.typeOfferColor
      return btn
    }
  },
  methods: {
    ownOffer () {
      console.log('ownOffer')
    }
  },
  beforeMount () {
    this.btn = {
      ownOffer: this.typeButtons().ownOffer
    }
  },
  created () {
    if (this.dataAssets) this.typeOfferColor = this.dataAssets.form.active === 'buy' ? 'dim' : 'pin'
  }
}
</script>
