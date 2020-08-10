<template>
  <v-text-field
    v-model="inputText"
    dense
    counter
    :outlined="outlined"
    :rounded="rounded"
    :rules="[configForm.rules.required]"
    :label="configForm.label"
    :name="configForm.name"
    :hint="getHint"
    :type="configForm.type || 'text'"
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
    value: {
      type: String,
      default: ''
    },
    configForm: {
      type: Object,
      default: null
    },
    rounded: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return { }
  },
  computed: {
    inputText: {
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
