<template>
  <v-sparkline
    :fill="fill"
    :value="value"
    line-width="1"
    padding="1"
    :height="height"
    auto-draw
    :gradient="gradient"
  ></v-sparkline>
</template>
<script>
export default {
  props: ['value', 'height'],
  data: () => {
    return {
      fill: true,
      theme: 'light',
      gradient: ['#1C82A9', '#1C82A9', 'white']
    }
  }
}
</script>
