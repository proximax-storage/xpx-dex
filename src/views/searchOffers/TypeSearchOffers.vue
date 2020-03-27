<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" class="mb-0  pb-0">
        <v-item-group mandatory v-model="form.active">
          <v-row>
            <v-col cols="6" class="mr-0 pr-0">
              <v-item v-slot:default="{ active, toggle }" value="buy">
                <v-row class="mx-auto mr-0 pr-0">
                  <v-col class="mr-0 pr-0" justify="center" align="center">
                    <v-btn color="dim" min-width="200" @click="toggle()" text large>
                      <span class="font-italic font-weight-bold headline text-capitalize">
                        Buy
                      </span></v-btn
                    >
                    <v-scroll-y-transition>
                      <v-sheet height="4" tile :color="active ? 'dim' : 'grey lighten-2'">
                      </v-sheet>
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
              </v-item>
            </v-col>
            <v-col cols="6" class="ml-0 pl-0">
              <v-item v-slot:default="{ active, toggle }" value="sell">
                <v-row class="mx-auto">
                  <v-col class="ml-0 pl-0" justify="center" align="center">
                    <v-btn color="pin" min-width="200" @click="toggle()" text large>
                      <span class="font-italic font-weight-bold headline text-capitalize">
                        Sell
                      </span></v-btn
                    >
                    <v-scroll-y-transition>
                      <v-sheet height="4" tile :color="active ? 'pin' : 'grey lighten-2'">
                      </v-sheet>
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-col>
      <v-col cols="10" class="pt-0 mt-0">
        <v-form v-model="valid" ref="form">
          <v-row class="mx-auto">
            <v-col class="pt-0 mt-0" cols="4">
              <v-select
                class="pt-1"
                v-model="form.asset"
                :items="assets"
                @change="changeAssetId($event)"
                item-text="text"
                item-value="mosaicIdHex"
                attach
                dense
                :loading="loadingInfo"
                :rules="[
                  configForm.assets.rules.required,
                  configForm.assets.rules.min,
                  configForm.assets.rules.max
                ]"
                :color="inputStyle"
                label="Select assets"
              ></v-select>
            </v-col>
            <v-col class="pt-0 mt-0" cols="4">
              <v-text-field
                class="pt-0 text-right"
                reverse
                @keyup="validateQuantityAmount()"
                v-model="form.amount"
                v-money="configMoneyAsset"
                :label="configForm.amount.label"
                :disabled="loadingInfo"
                :minlength="configForm.amount.min"
                :maxlength="configForm.amount.max"
                :counter="configForm.amount.max"
                :color="inputStyle"
                :rules="[
                  configForm.amount.rules.required,
                  configForm.amount.rules.min,
                  configForm.amount.rules.max,
                  isValidateQuantityAmount
                ]"
              ></v-text-field>
            </v-col>
            <v-col class="pt-0 mt-0" cols="4">
              <v-text-field
                class="pt-0 text-align-field-right"
                reverse
                @keyup="validateQuantityBidPrice()"
                v-model="form.bidPrice"
                v-money="configMoney"
                :label="configForm.bidPrice.label"
                :minlength="configForm.bidPrice.min"
                :maxlength="configForm.bidPrice.max"
                :counter="configForm.bidPrice.max"
                :color="inputStyle"
                :rules="[
                  configForm.bidPrice.rules.required,
                  configForm.bidPrice.rules.min,
                  configForm.bidPrice.rules.max,
                  isValidateQuantityBidPrice
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="10">
        <!-- <button @click="clickButton('l')"> enviar </button> -->
        <!-- Buttons -->
        <custom-buttons @action="send" :arrayBtn="getArrayBtn[0]"></custom-buttons>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
import mosaicMixins from '../../mixins/mosaic-mixin'
import { mapGetters } from 'vuex'
export default {
  mixins: [generalMixins, mosaicMixins],
  data: () => ({
    form: {
      asset: null,
      amount: null,
      bidPrice: null,
      active: null
    },
    arrayBtn: null,
    configForm: null,
    configMoney: null,
    configMoneyAsset: null,
    bidPrice: null,
    inputStyle: 'inputStyle',
    idHex: null,
    sendingForm: false,
    valid: false,
    isValidateQuantityBidPrice: true,
    isValidateQuantityAmount: true
  }),
  sockets: {
    connect: function () {},
    disconnect: function () {
      this.$socket.close()
    }
  },
  components: {
    'custom-buttons': () => import('@/components/shared/Buttons')
  },
  computed: {
    ...mapGetters('socketDbStore', [
      'mosaicsInfOffer',
      'loadingInfo',
      'mosaicsInfOfferFromIdHex',
      'offersTx'
    ]),
    assets: {
      get () {
        return this.filtersAssets(this.mosaicsInfOffer)
      }
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn[0]['lookForOffers'].disabled =
        !this.valid ||
        this.sendingForm ||
        !this.validateZero([this.form.amount, this.form.bidPrice])
      arrayBtn[0]['lookForOffers'].loading = this.sendingForm
      arrayBtn.align = 'center'
      return arrayBtn
    }
  },
  methods: {
    send () {
      this.$router.push({ name: 'Offer Board', params: { form: this.form } })
    },
    changeAssetId (event) {
      this.idHex = event
      if (this.idHex) {
        const data = this.mosaicsInfOfferFromIdHex(this.idHex)
        this.configOtherMoneyAsset(data)
      }
    },
    configOtherMoneyAsset (data) {
      this.configMoneyAsset = data[0].mosaicInfo
        ? {
          decimal: '.',
          thousands: ',',
          prefix: '',
          suffix: '',
          precision: data[0].mosaicInfo[0].mosaicInfo.properties.divisibility,
          masked: false
        }
        : this.getConfigMoney()
    },
    clickButton: function (data) {
      const valor = {
        deadline: [3534016864, 28],
        hashTx: 'perrote',
        maxFee: [39000, 0],
        networkType: 168,
        offers: [
          {
            cost: [100000, 0],
            duration: [500, 0],
            mosaicAmount: [4000000, 0],
            mosaicId: [576066984, 189902527],
            // mosaicId: [3212122209, 311218131],
            type: 0
          }
        ],
        signature:
          'C3AC291137E3C09FD679E032BE65757EEE3A4CD12AF7E787E9A4543AC3CEA5B69453D567E5D39FCA428E4D920E92D49C17EA7B5276A4430C5B533AA86287880B',
        signer: '5E01558EAA6531B2D3E22184C9842705B7958E537AE15D6247365A7E8C435058',
        type: 16733,
        version: -1476395007
      }
      this.$store.dispatch('socketDbStore/insertNewOffers', { io: this.$socket, data: valor })
    },
    filtersAssets (data) {
      // 286ABCDE88E269AC899D872F2D9CC62E2B8B0126E1F04B49A97EDBE588949806
      let valor = []
      if (JSON.parse(JSON.stringify(data)).length > 0) {
        valor = data.map(item => {
          if (item.mosaicInfo !== null && item.mosaicInfo !== undefined) {
            if (item.mosaicInfo[0].mosaicNames.names.length > 0) {
              item.text = item.mosaicInfo[0].mosaicNames.names[0].name
            } else {
              item.text = item.mosaicIdHex
            }
          } else {
            item.text = item.mosaicIdHex
          }
          return item
        })
      }
      this.changeAssetId(this.idHex)
      return valor
    },
    validateQuantityAmount () {
      let amount = null
      try {
        amount = parseFloat(this.form.amount.split(',').join(''))
      } catch (error) {
        amount = Number(this.form.amount)
      }
      if (amount === 0) {
        this.isValidateQuantityAmount = 'Cannot enter amount zero'
      } else {
        this.isValidateQuantityAmount = true
      }
    },
    validateQuantityBidPrice () {
      let amount = null
      try {
        amount = parseFloat(this.form.bidPrice.split(',').join(''))
      } catch (error) {
        amount = Number(this.form.bidPrice)
      }
      if (amount === 0) {
        this.isValidateQuantityBidPrice = 'Cannot enter amount zero'
      } else {
        this.isValidateQuantityBidPrice = true
      }
    }
  },
  beforeDestroy () {
    this.sockets.unsubscribe('getMoisaicsInfo')
  },
  beforeMount () {
    this.configForm = this.getConfigForm()
    this.configMoney = this.getConfigMoney()
    this.configMoneyAsset = this.getConfigMoney()
    this.arrayBtn = [
      {
        lookForOffers: this.typeButtons().lookForOffers
      }
    ]
  }
}
</script>
