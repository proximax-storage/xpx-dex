<template>
  <v-row class="ml-1 pt-0">
    <v-col cols="12"></v-col>
  </v-row>
</template>
<script>
export default {
  props: ['resultsOfferFilter', 'divisibility', 'type'],
  data: () => ({
    typeOfferColor: null,
    commentsToShow: 4
  }),
  watch: {
    resultsOfferFilter: function (newExrDay) {
      this.commentsToShow = 4
    }
  },
  created () {
    this.typeOfferColor = this.type === 'buy' ? 'dim' : 'pin'
  },
  methods: {
    triggerClick (item) {
      this.$emit('sendOffer', item)
    }
  }
}
</script>
