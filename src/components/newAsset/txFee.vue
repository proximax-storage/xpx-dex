<template>
  <v-row>
    <v-col
      cols="10"
      class="ma-0 mx-auto body-2 d-flex justify-center align-center"
    >Transaction fee: {{fee}} XPX</v-col>
  </v-row>
</template>
<script>
export default {
  props: ['arrayFee'],
  computed: {
    fee: {
      get: function (newValue) {
        return this.$generalService.amountFormatter(this.$generalService.sumObject(this.arrayFee))
      }
    }
  }
}
</script>
