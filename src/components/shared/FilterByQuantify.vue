<template>
  <!-- <v-row class="ml-1 pb-0 pt-0 mx-auto"> -->
  <v-col
    cols="12"
    xs="12"
    sm="10"
    md="6"
    lg="4"
    xl="4"
    class="pt-0 pb-0"
  >
    <div class="font-italic font-weight-light pb-2">Quantity</div>
    <v-text-field
      :rules="[configForm.quantity.rules.required, configForm.quantity.rules.min, configForm.quantity.rules.max]"
      v-money="configMoney"
      :minlength="configForm.quantity.min"
      :maxlength="configForm.quantity.max"
      :counter="configForm.quantity.max"
      v-model="form.filterByQuantity"
      :label="configForm.quantity.label"
      outlined
      dense
    >
      <template v-slot:append>
        <v-btn
          @click="filterByQuantityF"
          class="primary--text"
          text
          style="top:-2px"
        > search
        </v-btn>
      </template>
    </v-text-field>
  </v-col>
  <!-- <v-col cols="12">
      <v-divider class="ma-0"></v-divider>
    </v-col>
  </v-row> -->
</template>

<script>
export default {
  props: ['resultsOfferFilter', 'divisibility'],
  data () {
    return {
      form: {
        filterByQuantity: null
      },
      configMoney: null,
      configForm: null
    }
  },
  beforeMount () {
    this.configMoney = this.$configForm.getConfigMoney('.', ',', '', '', this.divisibility, true)
    this.configForm = {
      quantity: this.$configForm.amount('Enter Quantity')
    }
  },

  methods: {
    filterByQuantityF () {
      this.$emit('clicked', this.$generalService.quantityStringToInt(this.form.filterByQuantity, this.divisibility))
    }
  }
}
</script>
