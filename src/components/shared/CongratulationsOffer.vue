<template>
  <v-row>
    <v-col cols="12"
      ><div
        class="display-1 font-weight-regular  text-left primary--text"
        v-bind:class="[colorText]"
      >
        Congratulations
      </div>
      <div class="ma-2 ml-4 mx-auto">
        <div class="caption font-weight-black pt-3">
          You trasaction has beet successfully registered into blockchain.
        </div>
      </div>
      <div class="ma-2 pt-4 ml-4 mx-auto">
        <span class="body-1 font-weight-black"> Hash :</span>
        <span class="">{{ txOfferInfo.hash }}</span>
      </div>
      <div class="ma-2 pt-4 ml-4 mx-auto">
        <p class="caption">
          Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis varius
          mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et, fermentum sed
          felis. Duis portito. purus a suscipit consequat
        </p>
      </div>
    </v-col>
    <v-col cols="6" class="caption d-flex">
      <custom-buttons @action="action" :align="'start'" :arrayBtn="getArrayBtn[0]"></custom-buttons>
    </v-col>
    <!-- <v-col class="ml-4" cols="12"> HAS </v-col> -->
  </v-row>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['txOfferInfo', 'colorText'],
  data: () => {
    return {
      arrayBtn: null
    }
  },
  computed: {
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      return arrayBtn
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  methods: {
    action (action) {
      console.log(action)
      switch (action) {
        case 'viewOnExplorer':
          this.$router.push({ path: '/searchOfferts' })
          break
        case 'print':
          console.log('print')
          break
      }
    }
  },
  beforeMount () {
    this.arrayBtn = [
      {
        print: this.typeButtons().print,
        viewOnExplorer: this.typeButtons().viewOnExplorer
      }
    ]
  }
}
</script>
