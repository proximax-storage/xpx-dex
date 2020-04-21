<template>
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Delete offer</v-col>
    </v-row>
    <v-row>
      <v-col sm="7" md="7" lg="9" col="9" class="pt-0">
        <v-divider class="pb-5"></v-divider>
        {{exchangeDelete}}
        <v-row>
          <v-col cols="5" class>
            <v-row>
              <v-col
                cols="12"
                class="subtitle-1 pt-0 font-weight-regular text-left primary--text"
              >My debit transaction</v-col>
              <div class="ma-2 ml-7 mx-auto">
                <div class="caption font-italic font-weight-light">Initial quantity</div>
                <div class="caption font-weight-black">initialQuantity</div>
              </div>
              <div class="ma-2 ml-7 mx-auto">
                <div class="caption font-italic font-weight-light mx-auto">BID Price</div>
                <div class="caption font-weight-black mx-auto">pxp</div>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters('mosaicExchange', ['exchangeDelete'])
  }
}
</script>
