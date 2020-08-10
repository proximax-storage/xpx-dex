<template>
  <v-row>
    <v-col
      cols="10"
      class="ma-0 mx-auto body-2 d-flex justify-center align-center"
    >Rental Fee: {{getRentalFee}} XPX</v-col>
  </v-row>
</template>

<script>
export default {
  props: ['rentalFee'],
  computed: {
    getRentalFee: {
      get () {
        return this.$generalService.amountFormatter(this.rentalFee)
      }
    }
  }
}
</script>
