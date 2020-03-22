<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" color="leve">
        <v-card-title class="title pb-0"> Other assets </v-card-title>
        <v-card-text style="position: relative">
          <v-sheet elevation="2" class="mb-2">
            <v-row class="ma-1">
              <v-col cols="8" class="pr-0  pt-1 pb-0 pl-1">
                <span class="font-weight-bold"> zombie.boe </span> <br />
                <span>= 0.23456 xpx</span>
              </v-col>
              <v-col cols="4" class="pa-2 pt-1 pb-1">
                <sparkline :value="value" :height="height" />
              </v-col> </v-row
          ></v-sheet>
          <v-sheet elevation="2" class="mb-2">
            <v-row class="ma-1">
              <v-col cols="8" class="pr-0  pt-1 pb-1 pl-1">
                <span class="font-weight-bold"> zombie.boe </span> <br />
                <span>= 0.23456 xpx</span>
              </v-col>
              <v-col cols="4" class="pa-2 pt-1 pb-1">
                <sparkline :value="value" :height="height" />
              </v-col> </v-row
          ></v-sheet>
        </v-card-text>
        <v-card-actions class="d-flex justify-center align-center">
          <custom-buttons
            style="position: absolute;"
            class="pl-5"
            @action="viewAllassets"
            :align="'center'"
            :arrayBtn="buttons"
          ></custom-buttons>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['dataAssets'],
  data: () => {
    return {
      theme: 'light',
      value: [24, 150, 675, 320, 500, 200, 170, 250, 700],
      height: 150,
      btn: null,
      typeOfferColor: null
    }
  },
  components: {
    sparkline: () => import('@/components/shared/Sparkline'),
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  methods: {
    viewAllassets () {}
  },
  computed: {
    buttons () {
      const btn = this.btn
      btn['viewAllassets'].color = this.typeOfferColor
      return btn
    }
  },
  beforeMount () {
    this.btn = {
      viewAllassets: this.typeButtons().viewAllassets
    }
  },
  created () {
    if (this.dataAssets) this.typeOfferColor = this.dataAssets.form.active === 'buy' ? 'dim' : 'pin'
  }
}
</script>
