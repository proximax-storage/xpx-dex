<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-select
          v-model="selectData"
          auto-select-first
          dense
          :outlined="outlined"
          :disabled="properties.disabled"
          :rounded="rounded"
          :multiple="properties.multiple"
          :return-object="properties.returnObject"
          :items="items"
          :label="configForm.label"
          :rules="[configForm.rules.required]"
          :item-text="properties.text"
          :item-value="properties.value"
        ></v-select>
        <progress-linear :showProgressLinear="properties.loading" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProgressLinear from '@/core/components/shared/ProgressLinear'
export default {
  props: {
    configForm: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      default: null
    },
    rounded: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Array, String, Number, Object],
      default: null
    },
    properties: {
      type: Object,
      default: function () {
        return {
          multiple: false,
          returnObject: false,
          loading: false,
          disabled: false
        }
      }
    }
  },
  components: {
    'progress-linear': ProgressLinear
  },
  computed: {
    selectData: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
