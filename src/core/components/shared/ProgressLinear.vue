<template>
  <v-progress-linear
    :active="showProgressLinear"
    :background-opacity="opacity"
    :bottom="bottom"
    :buffer-value="buffer"
    :height="height"
    :indeterminate="indeterminate"
    :query="query"
    :rounded="rounded"
    :stream="stream"
    :striped="striped"
    :top="top"
    :value="value"
    color="light-blue"
  ></v-progress-linear>
</template>

<script>
export default {
  props: {
    showProgressLinear: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      absolute: false,
      opacity: 0.3,
      bottom: false,
      buffer: 100,
      fixed: false,
      height: 4,
      indeterminate: true,
      query: false,
      rounded: false,
      stream: false,
      striped: false,
      top: false,
      value: 25
    }
  }
}
</script>
