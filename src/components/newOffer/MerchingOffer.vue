<template>
  <div>
    <v-divider class="pb-2"></v-divider>

    <!-- Info mosaic -->
    <v-row>
      <v-col cols="12">
        <div class="display-1 font-weight-regular text-left primary--text">
          <img
            style="vertical-align: middle"
            :src="require(`@/assets/img/${theme}/icon-mosaic.svg`)"
            width="30"
            height="30"
          />
          {{ nameMosaic }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="subtitle-1 font-weight-black">Some offert match with your offers</div>
        <div class="mx-auto caption">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis
          varius mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et,
          fermentum sed felis. Duis portito. purus a suscipit consequat.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        class="body-1 font-weight-regular primary--text mt-2"
      >{{data.length}} Results match with your offers</v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <!-- <v-row>
        <v-col cols="12">-->

        <!-- </v-col>
        </v-row>-->
        <v-progress-linear
          color="primary"
          :active="continueLoading"
          :indeterminate="continueLoading"
          class="ml-2"
        ></v-progress-linear>
        <div>
          <simple-table
            :dataTh="dataTh"
            :type="'take this offer'"
            :dataTable="data"
            :mosaicInfo="[]"
            @action="action"
          ></simple-table>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" color="leve">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div class="mx-auto caption">
                  Disclosure: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis
                  varius mauris, non aliquet libero. Pellentesque est eros. pharetra non finibus et,
                  fermentum sed felis. Duis portito. purus a suscipit consequat
                </div>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <!--Amount you will send -->
                  <v-col sm="12" md="6" col="4" lg="4">
                    <div class="ml-7">
                      <div class="caption font-italic font-weight-light">Amount you will send:</div>
                      <div
                        class="subtitle-1 font-weight-black"
                      >{{ $generalService.amountFormatter(dataOffertActual.amount, divisibility) }}</div>
                    </div>
                  </v-col>
                  <!-- Total cost -->
                  <v-col sm="12" md="6" col="6" lg="4">
                    <div class="ml-7">
                      <div class="caption font-italic font-weight-light">Total cost:</div>
                      <div
                        class="subtitle-1 font-weight-black"
                      >{{ $generalService.amountFormatter(dataOffertActual.costTotal, 6) }} XPX</div>
                    </div>
                  </v-col>
                  <!--Amount you will send -->
                  <v-col sm="12" md="4" col="4" lg="4">
                    <div class="ml-7">
                      <div class="caption font-italic font-weight-light">Per Unit:</div>
                      <div
                        class="subtitle-1 font-weight-black"
                      >{{ $generalService.amountFormatter(dataOffertActual.bidPrice, 6) }} XPX</div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5" class="ma-0 mx-auto caption d-flex justify-center align-center">
        <custom-button @action="actionBtn" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: [
    'offerMerching',
    'divisibility',
    'nameMosaic',
    'dataOffertActual',
    'typeOfferColor',
    'continueLoading'
  ],
  data () {
    return {
      arrayBtn: null,
      theme: 'light',
      name: 'face',
      dataTh: ['Initial quantity', 'Quantity Available', 'price (XPX)', 'Total (XPX)']
    }
  },
  components: {
    'simple-table': () => import('@/components/shared/SimpleTable'),
    'custom-button': () => import('@/components/shared/Buttons')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    data () {
      return this.buildData(this.offerMerching)
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['continue'].disabled = this.continueLoading
      arrayBtn['continue'].loading = this.continueLoading
      arrayBtn['continue'].color = this.typeOfferColor === null ? 'white' : this.typeOfferColor
      return arrayBtn
    }
  },
  methods: {
    action (data) {
      this.$emit('actionMerching', data.exchange)
    },
    actionBtn (data) {
      this.$emit('continueOffer', data)
    },
    buildData (data = []) {
      const dataMap = data
        .filter(x => x.owner.publicKey !== this.currentAccount.publicKey)
        .map(f => {
          const initialQuantity = this.$generalService.amountFormatter(
            f.initialAmount.compact(),
            this.divisibility
          )
          const quantityAvailable = this.$generalService.amountFormatter(
            f.amount.compact(),
            this.divisibility
          )
          const initialCost = this.$generalService.amountFormatter(f.initialCost.compact(), 6)
          const price = this.$generalService.amountFormatter(f.price, 6)
          return {
            initialQuantity: initialQuantity,
            quantityAvailable: quantityAvailable,
            price: price,
            initialCost: initialCost,
            exchange: f
          }
        })
      return dataMap
    }
  },
  beforeMount () {
    this.arrayBtn = {
      cancel: this.$configForm.buildButton('Cancel', 'cancel', 'cancel', 'primary', 'white--text'),
      continue: this.$configForm.buildButton(
        'No thanks, continue with my offer ',
        'continue',
        'continue',
        'primary',
        'white--text'
      )
    }
  }
}
</script>
