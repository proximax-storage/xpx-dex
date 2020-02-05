<template>
  <v-card class="pa-1 ma-auto" max-width="344" default width="15%" color="black">
    <v-list color="black">
      <div class="ma-0 mt-2 pa-1">
        <div color="pa-0 ma-0">
          <p class="ma-0 font-weight-bold" style="font-size: 10px">{{ bet }}</p>
        </div>
      </div>

      <div class="ma-0 mt-0">
       <div class="d-flex justify-start">
          <v-chip
            class="ma-0 chip1 smallfont font-italic pl-2 pr-2 leve--text"
            style="text-transform: capitalize; height: 20px">
            {{ tags.sport }}
          </v-chip>
          <v-chip
            class="ma-0 ml-1 pl-2 pr-2 chip1 smallfont font-italic leve--text"
            style="text-transform: capitalize; height: 20px">
            {{ tags.date }}
          </v-chip>
        </div>
      </div>

      <div class="ma-0 pa-0 pt-1">
        <v-card color="white pa-1 body-1 text" width="100%" light max-height="45" style="overflow: hidden">
          <p class="body-2 ma-0 font-weight-bold">{{ name }}</p>
        </v-card>
      </div>

      <div class="d-flex justify-center">
        <v-btn color="primary"
          small
          class="ma-1 pa-1 pl-4 pr-4 darkness--text font-weight-bold font-italic"
          style="text-transform: capitalize"
          :rounded="roundAndRipple"
          :ripple="roundAndRipple">
          Bet Now
        </v-btn>
      </div>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'PredictionCard',

  props: {
    name: String,
    bet: String,
    tags: Object
  },

  data () {
    return {
      roundAndRipple: true
    }
  }
}
</script>
