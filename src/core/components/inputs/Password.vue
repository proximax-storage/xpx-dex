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
      validateIsMatch
    ]"
    :label="(otherLabel) ? otherLabel : configForm.label"
    :name="configForm.name"
    :append-icon="showValue ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showValue ? 'text' : 'password'"
    @click:append="showValue = !showValue"
  >
    <template v-if="configForm.showIcon" v-slot:prepend-inner>
      <v-img
        class="pr-2 mt-1"
        alt="logo"
        height="20"
        width="20"
        :src="require(`@/assets/img/${configForm.icon}`)"
      ></v-img>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: null
    },
    value: {
      type: String,
      default: ''
    },
    otherValue: {
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
      showValue: false
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
    },
    configForm () {
      return this.config ? this.config : this.$utils.getConfigForm().password
    },
    validateIsMatch () {
      return this.otherValue
        ? this.$utils.validateMatch(this.value, this.otherValue, 'Password')
        : true
    }
  }
}
</script>
