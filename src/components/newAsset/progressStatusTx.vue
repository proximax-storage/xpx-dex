<template>
  <div>
    <v-row>
      <v-col col="12" class>
        <div class="text-center">
          <v-progress-circular :rotate="-90" :size="190" :width="10" :value="value" color="primary">
            <span class="title font-weight-bold">Processing...</span>
          </v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="12" class>
        <div class="text-center">
        <span class="body-1 font-weight-medium grey--text">Don't close your browser until </span>
         </div>
         <div class="text-center">
           <span class="body-1 font-weight-medium grey--text">finish the process</span>
           </div>
      </v-col>
    </v-row>
  </div>
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
