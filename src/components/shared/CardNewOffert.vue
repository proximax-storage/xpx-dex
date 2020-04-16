<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" color="leve">
        <v-card-title
          style="position: relative"
          class="title d-flex justify-center align-center"
        >None of these offers is useful for you?</v-card-title>

        <v-card-actions class="d-flex justify-center align-center">
          <custom-buttons
            style="position: absolute;"
            class="pl-5"
            @action="triggerClick"
            :align="'center'"
            :arrayBtn="buttons"
          ></custom-buttons>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  props: ['type'],
  data: () => ({
    btn: null
  }),
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  computed: {
    buttons () {
      const btn = this.btn
      btn['ownOffer'].color = this.typeOfferColor
      return btn
    }
  },
  watch: {
    type: {
      immediate: true,
      handler (value) {
        console.log('valuevaluevalue value value value')
        this.type = value
        this.typeOfferColor = this.type === 'buy' ? 'dim' : 'pin'
        this.btn = {
          ownOffer: this.typeButtons().ownOffer
        }
      }
    }
  },
  methods: {
    // ownOffer () {
    //   if (this.$store.getters['accountStore/isLogged']) {
    //     this.$router.push({ path: '/newOffer' })
    //   } else {
    //     this.$router.push({ path: '/login' })
    //   }
    // },
    triggerClick () {
      this.$emit('ownOffer')
    }
  },
  beforeMount () {
    this.btn = {
      ownOffer: this.typeButtons().ownOffer
    }
  },
  created () {
    this.typeOfferColor = this.type === 'buy' ? 'dim' : 'pin'
  }
}
</script>
