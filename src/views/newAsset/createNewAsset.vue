<template>
  <!-- <div>CREATE NEW ASSETS</div> -->
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">New asset</v-col>
    </v-row>
    <!-- formulario -->
    <v-row class="pt-4">
      <v-col col="12" class="pt-0">asd</v-col>
      <v-col cols="12" class="ma-0 mx-auto caption d-flex justify-center align-center">
        <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import {
  buildMosaicDefinitionTransaction,
  buildMosaicSupplyChangeTransaction
} from '@/services/mosaics-service'
import { buildRegisterNamespaceTransaction } from '@/services/namespace-service'
import { MosaicSupplyType } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicSupplyType'
import { mapGetters } from 'vuex'
export default {
  data: () => {
    return {
      arrayBtn: null,
      form: {
        mosaic: {
          duration: undefined,
          divisibility: 6,
          supplyMutable: true,
          transferable: true,
          restrictable: false,
          supply: 500000000
        },
        namespace: {
          name: 'one',
          duration: 1,
          type: 'rootNamespaceName'
        }
      }
    }
  },
  beforeMount () {
    this.arrayBtn = {
      place: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text')
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['place'].disabled = false
      arrayBtn['place'].loading = false
      arrayBtn['place'].color = 'white'
      arrayBtn['place'].textColor = 'white--text'
      arrayBtn['place'].textColor = 'primary--text'
      return arrayBtn
    }
  },
  methods: {
    action (action) {
      switch (action) {
        case 'create':
          this.typeCreatetxs(this.typeAction())
      }
    },
    typeAction () {
      return 0
    },
    typeCreatetxs (action) {
      switch (action) {
        case 0:
          const mosaicDefinitionTransaction = buildMosaicDefinitionTransaction(
            this.currentAccount.publicKey,
            this.form.mosaic.duration,
            this.form.mosaic.divisibility,
            this.form.mosaic.supplyMutable,
            this.form.mosaic.transferable
          ).transaction
          const mosaicSupplyChangeTransaction = buildMosaicSupplyChangeTransaction(
            mosaicDefinitionTransaction.mosaicId,
            MosaicSupplyType.Increase,
            this.form.mosaic.supply
          ).transaction

          const registerNamespaceTransaction = buildRegisterNamespaceTransaction(
            this.form.namespace.name,
            this.form.namespace.duration,
            this.form.mosaic.type
          ).transaction
          const innerTransaction = [
            mosaicSupplyChangeTransaction,
            mosaicDefinitionTransaction,
            registerNamespaceTransaction
          ]
          const add = this.$blockchainProvider.aggregateTransaction(innerTransaction)
          console.log('A DD : ', add)
      }
    }
  }
}
</script>
