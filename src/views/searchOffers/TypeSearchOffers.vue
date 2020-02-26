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
          <v-col class="pt-0 mt-0" cols="4"
            ><v-text-field
              v-model.trim="asset"
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
            ></v-text-field>
          </v-col>
          <v-col cols="4">hola 2 </v-col>
          <v-col cols="4">hola 3 </v-col></v-row
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import generalMixins from '../../mixins/general-mixin'
export default {
  mixins: [generalMixins],
  data: () => ({
    active: null,
    configForm: null,
    asset: null,
    inputStyle: 'inputStyle'
  }),
  methods: {
    send () {
      console.log('active', this.active)
    }
  },
  beforeMount () {
    this.configForm = this.getConfigForm()
  }
}
</script>
