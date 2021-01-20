<template>
  <v-row>
    <v-col cols="12">
      <v-card
        elevation="0"
        color="leve"
      >
        <v-card-title class="title pb-0">Other assets</v-card-title>
        <v-card-text style="position: relative">
          <template v-for="(item, i) of  dataAssets">

            <v-sheet
              :key="i"
              v-if="i<6"
              elevation="2"
              color="leve"
              class="mb-2"
            >
              <v-row class="ma-1">
                <v-col
                  cols="8"
                  class="pr-0 pt-1 pb-0 pl-1"
                >
                  <span class="font-weight-bold">{{item.text}}</span>
                  <br />
                  <span>= {{item.averagePrice}} xpx</span>
                </v-col>
                <v-col
                  cols="4"
                  class="pa-2 pt-1 pb-1"
                >
                  <sparkline
                    :value="item.graphic"
                    :height="height"
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </template>
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
export default {
  props: ['dataAssets'],
  data: () => {
    return {
      theme: 'light',
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
    viewAllassets () {
      this.$router.push({ path: '/searchOfferts' })
    }
  },
  computed: {
    buttons () {
      const btn = this.btn
      return btn
    }
  },
  beforeMount () {
    this.btn = {
      viewAllassets: {
        key: 'ownoffer',
        action: 'ownoffer',
        disabled: false,
        color: 'leve',
        textColor: 'primary--text',
        loading: false,
        text: 'view All'
      }
    }
  }
}
</script>
