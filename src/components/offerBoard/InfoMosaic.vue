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
      <div class="font-weight-regular pt-1" style="font-size: 0.7rem;">
        Avg Price: 0.00032 pxp
      </div>
    </v-col>
    <v-col clos="6"> Grafic</v-col>
  </v-row>
</template>
<script>
export default {
  props: ['name'],
  data: () => {
    return {
      theme: 'light'
    }
  }
}
</script>
