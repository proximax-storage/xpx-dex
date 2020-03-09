<template>
  <!-- <v-tabs>
    <v-tab>Item One</v-tab>
    <v-tab>Item Two</v-tab>
    <v-tab>Item Three</v-tab>
  </v-tabs> -->
  <!-- <v-container class="fill-height"> -->
  <!-- <v-row justify="center" align="center">
      <v-col cols="12">
        <v-tabs grow  >
          <v-tab color="red">
            <v-col cols="6">
              <v-row class="mx-auto">
                <v-col justify="center" align="center">
                  <span class="font-italic font-weight-bold headline">Buy</span>
                </v-col>
              </v-row>
            </v-col>
          </v-tab>
          <v-tab>
            <v-col cols="6">
              <v-row class="mx-auto">
                <v-col justify="center" align="center">
                  <span class="font-italic font-weight-bold headline">Sell</span></v-col
                >
              </v-row>
            </v-col>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row> -->
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" class="mb-0  pb-0">
        <v-item-group mandatory v-model="active">
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
                      <!-- <v-divider :color="active ? 'primary' : ''" class="pt-1" /> -->
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
                      <!-- <div :background-color="active ? 'primary' : 'pin'" > -->
                      <!-- <v-divider :color="active ? 'primary' : ''" class="pt-1" /> -->
                      <v-sheet height="4" tile :color="active ? 'pin' : 'grey lighten-2'">
                      </v-sheet>
                      <!-- </div> -->
                    </v-scroll-y-transition>
                  </v-col>
                </v-row>
                <!-- <v-divider   :color="active ? 'primary' : 'grey lighten-4'" class="pt-1" /> -->
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-col>
      <v-col cols="10" class="pt-0 mt-0">
        <v-row class="mx-auto">
          <v-col class="pt-0 mt-0" cols="4">
            {{ asset }}
            <v-select
              v-model="asset"
              :items="assets"
              item-text="text"
              item-value="mosaicIdHex"
              attach
              dense
              :rules="[
                configForm.assets.rules.required,
                configForm.assets.rules.min,
                configForm.assets.rules.max
              ]"
              :color="inputStyle"
              label="Select assets"
            ></v-select>
            <!-- <v-text-field
              v-model.trim="assets"
              :label="configForm.asset.label"
              :minlength="configForm.asset.min"
              :maxlength="configForm.asset.max"
              :counter="configForm.asset.max"
              :color="inputStyle"
              :rules="[
                configForm.asset.rules.required,
                configForm.asset.rules.min,
                configForm.asset.rules.max
              ]"
            ></v-text-field> -->
          </v-col>
          <v-col cols="4">
            <div id="app">
              <button @click="clickButton()">Insert data</button>
            </div>
          </v-col>
          <v-col cols="4">{{ assets.text }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
import mosaicMixins from '../../mixins/mosaic-mixin'
import { mapState, mapGetters } from 'vuex'
export default {
  mixins: [generalMixins, mosaicMixins],
  data: () => ({
    myVar: '',
    active: null,
    configForm: null,
    asset: null,
    inputStyle: 'inputStyle',
    msgServer: null
  }),
  sockets: {
    connect: function () {},
    disconnect: function () {
      this.$socket.close()
    }
  },
  // watch: {

  // },
  computed: {
    ...mapState('socketDbStore', ['offersTx']),
    ...mapGetters('socketDbStore', ['mosaicsInfOffer']),
    assets: {
      get () {
        return this.filtersAssets(this.$store.state.socketDbStore.mosaicsInfOffer)
      },
      set (value) {
        this.$store.commit('socketDbStore/EVENT_SET_MOSAIC_INFO', value)
      }
    }
  },
  watch: {
    assets (newValue) {
      this.getInfoAssets(newValue)
    }
  },
  methods: {
    send () {
      console.log('active', this.offers)

      // this.SOCKET_SET_NEW_OFFERS({ nuevo: 'nuevo' })
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
            // mosaicId: [3680968789, 666303677],
            mosaicId: [2091572862, 1893890316],
            // mosaicId: [1173232007, 1792145974],
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
    async getInfoAssets (data) {
      let cont = 0
      if (data.length > 0) {
        for (let item of data) {
          if (item.mosaicsInfo === undefined) {
            cont = cont + 1
            const mosaicId = this.$blockchainProvider.getMosaicId(item.mosaicIdHex)
            try {
              item.mosaicsInfo = await this.searchInfoMosaics([mosaicId], true)
            } catch (error) {
              item.mosaicsInfo = ''
            }
          }
        }
        if (cont > 0) {
          this.assets = JSON.parse(JSON.stringify(data))
        }
      }
    },
    filtersAssets (data) {
      let valor = []
      console.log('poll::', JSON.parse(JSON.stringify(data)))
      if (JSON.parse(JSON.stringify(data)).length > 0) {
        valor = data.map(item => {
          if (item.mosaicsInfo !== null && item.mosaicsInfo !== undefined) {
            if (item.mosaicsInfo[0].mosaicNames.names.length > 0) {
              item.text = item.mosaicsInfo[0].mosaicNames.names[0].name
            } else {
              item.text = item.mosaicIdHex
            }
          } else {
            item.text = item.mosaicIdHex
          }
          return item
        })
      }
      return valor
    }
  },
  beforeDestroy () {
    this.sockets.unsubscribe('getMoisaicsInfo')
  },
  mounted () {
    this.$store.dispatch('socketDbStore/getMoisaicsInfo', { io: this.$socket, data: null })
  },
  beforeMount () {
    this.configForm = this.getConfigForm()
  }
}
</script>
