<template>
  <v-row>
    <v-col cols="6">
      <div class="headline font-weight-regular  text-left primary--text">
        <img
          style="vertical-align: middle"
          :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
          width="25"
          height="25"
        />
        {{ name }}
      </div>
      <!-- <div class="font-weight-regular pt-1" style="font-size: 0.7rem;">
        Avg Price: 0.00032 pxp
      </div> -->
    </v-col>
    <v-col clos="6">
      <sparkline :value="graphic" :height="height" />
      <!-- <v-sparkline
        :fill="fill"
        :value="value"
        line-width="3"
        padding="1"
        height="25"
        auto-draw
        :gradient="gradient"
      ></v-sparkline> -->
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ['name', 'graphic'],
  data: () => {
    return {
      theme: 'light',
      value: [24, 150, 675, 320, 500, 200, 170, 250, 700],
      height: 25
    }
  },
  components: {
    'sparkline': () => import('@/components/shared/Sparkline')
  }
}
</script>
