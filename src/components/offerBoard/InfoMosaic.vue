<template>
  <v-row>
    <v-col cols="6">
      <div class="headline font-weight-regular  text-left primary--text">
        <template v-if="!getIcon(mosaicIdHex,iconMosaic)">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            width="25"
            height="25"
          />
        </template>
        <template v-else>
          <img
            :src="getIcon(mosaicIdHex,iconMosaic)"
            width="20"
            height="20"
          />
        </template>

        {{ name }}
      </div>
    </v-col>
    <v-col clos="6">
      <sparkline
        :value="graphic"
        :height="height"
      />
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['name', 'graphic', 'mosaicIdHex'],
  data: () => {
    return {
      theme: 'light',
      value: [24, 150, 675, 320, 500, 200, 170, 250, 700],
      height: 25
    }
  },
  computed: {
    ...mapGetters('mosaicStore', ['iconMosaic'])
  },
  components: {
    'sparkline': () => import('@/components/shared/Sparkline')
  },
  methods: {
    getIcon (mosaicIdHex, iconArray) {
      let base64Img = ''
      const icon = iconArray.find(x => x.mosaicId.toHex() === mosaicIdHex)
      if (icon) {
        base64Img = icon.iconBase64
      }
      return base64Img
    }
  }
}
</script>
