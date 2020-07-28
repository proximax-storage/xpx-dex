<template>
  <v-row>
    <v-col col="12" class="ma-2">
      <div class="text-center">
        <v-progress-circular
          :rotate="-90"
          :size="150"
          :width="5"
          :value="value"
          color="teal"
        >Loading...</v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['progressMosaicDefi', 'progressMosaicAlias'],
  data () {
    return {
      value: 0,
      interval: {}
    }
  },
  beforeMount () {
    this.interval = setInterval(() => {
      this.value += Math.ceil(3.33)
      if (this.value >= 100) {
        return clearInterval(this.interval)
      }
    }, 2000)
  },
  watch: {
    showLoading (newValue) {
      this.value = 0
    },

    progressMosaicDefi (newValue) {
      if (newValue) {
        this.value = 50
      }
    },
    progressMosaicAlias (newValue) {
      if (newValue) {
        this.value = 100
      }
    }
  }
}
</script>
