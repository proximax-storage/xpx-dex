<template>
  <v-text-field
    v-model="dataInput"
    rounded
    dense
    outlined
    counter
    :hint="getHint"
    :rules="[
      configForm.rules.required,
      configForm.rules.min,
      configForm.rules.max,
      configForm.rules.isHex
    ]"
    :label="(otherLabel) ? otherLabel : configForm.label"
    :name="configForm.name"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    otherLabel: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      showValue: false,
      configForm: this.$utils.getConfigForm().publicKey
    }
  },
  computed: {
    dataInput: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    getHint () {
      return ''
    }
  }
}
</script>
