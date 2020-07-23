<template>
  <!-- <div>CREATE NEW ASSETS</div> -->
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">New asset</v-col>
    </v-row>
    <!-- formulario -->
    <v-row class="pt-4">
      <select-namespace />
      <v-col col="12" class="pt-0">asd</v-col>
      <v-col cols="12" class="ma-0 mx-auto caption d-flex justify-center align-center">
        <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import { PublicAccount } from 'tsjs-xpx-chain-sdk/dist/src/model/account/PublicAccount'
import { decrypt } from '@/services/account-wallet-service'
import {
  buildMosaicDefinitionTransaction,
  buildMosaicSupplyChangeTransaction,
  buildMosaicAliasTransaction
} from '@/services/mosaics-service'
import { buildRegisterNamespaceTransaction } from '@/services/namespace-service'
import { MosaicSupplyType } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicSupplyType'
import { mapGetters, mapMutations } from 'vuex'
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
          name: 'onep',
          duration: 1,
          type: 'rootNamespaceName'
        },
        password: 'qazwsxedc'
      },
      hashMosaicDefinition: null,
      hashMosaicAlias: null,
      namespaceIdLink: null,
      mosaicIdLink: null
    }
  },
  beforeMount () {
    this.arrayBtn = {
      place: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text')
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons'),
    'select-namespace': () => import('@/components/shared/selectNamespace')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    ...mapGetters('transactionsStore', ['confirmed', 'unconfirmedAdded', 'status']),
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
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    announceTx (transaction, type) {
      let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
      const signedTransaction = this.$blockchainProvider.signedTransaction(
        common.privateKey,
        transaction,
        this.currentAccount.simpleWallet.network
      )
      common = null
      if (type === 0) this.hashMosaicDefinition = signedTransaction.hash
      if (type === 3) this.hashMosaicAlias = signedTransaction.hash

      const dataMonitorHash = this.$generalService.buildMonitorHash(
        'createNewAsset',
        signedTransaction.hash,
        '',
        {}
      )
      this.SET_MONITOR_HASH(dataMonitorHash)
      this.$blockchainProvider.announceTx(signedTransaction).subscribe(
        response => {},
        () => {
          this.REMOVE_MONITOR_HASH(dataMonitorHash)
        }
      )
    },
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
          console.log('CASE #0')
          /**
           * type tx : Aggregate transaction
           * Mosaic definition transaction
           * Mosaic supplyChange transaction
           * Register namespace transaction
           */

          // Mosaic definition transaction
          const mosaicDefinitionTransaction = buildMosaicDefinitionTransaction(
            this.currentAccount.publicKey,
            this.form.mosaic.duration,
            this.form.mosaic.divisibility,
            this.form.mosaic.supplyMutable,
            this.form.mosaic.transferable
          ).transaction
          // Mosaic supplyChange transaction
          const mosaicSupplyChangeTransaction = buildMosaicSupplyChangeTransaction(
            mosaicDefinitionTransaction.mosaicId,
            MosaicSupplyType.Increase,
            this.form.mosaic.supply
          ).transaction
          // Register namespace transaction
          const registerNamespaceTransaction = buildRegisterNamespaceTransaction(
            this.form.namespace.name,
            this.form.namespace.duration,
            this.form.mosaic.type
          ).transaction
          const publicAccount = PublicAccount.createFromPublicKey(
            this.currentAccount.publicKey,
            this.currentAccount.simpleWallet.network
          )
          const innerTransaction = [
            mosaicDefinitionTransaction.toAggregate(publicAccount),
            registerNamespaceTransaction.toAggregate(publicAccount),
            mosaicSupplyChangeTransaction.toAggregate(publicAccount)
          ]
          this.setMosaicIdAndNamespace(
            mosaicDefinitionTransaction.mosaicId.toHex(),
            this.form.namespace.name
          )
          // announce Tx
          this.announceTx(this.$blockchainProvider.aggregateTransaction(innerTransaction), action)
          break
        // type action : 3
        case 3:
          console.log('CASE #3')
          /**
           * Link = 0, Unlink = 1
           * type : Linking a namespace to a mosaic
           * AliasTransaction create for Mosaic
           */

          // AliasTransaction create for Mosaic
          const mosaicAliasTransaction = buildMosaicAliasTransaction(
            0,
            this.namespaceIdLink,
            this.mosaicIdLink
          ).transaction
          // announce Tx
          this.announceTx(mosaicAliasTransaction, action)
      }
    },
    setMosaicIdAndNamespace (mosaicId, namespaceId) {
      this.mosaicIdLink = this.$blockchainProvider.getMosaicId(mosaicId)
      this.namespaceIdLink = this.$blockchainProvider.getNamespaceId(namespaceId)
    },
    validateTxHash (transactions) {
      // this.sendingForm = false
      if (
        transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicDefinition)
      ) {
        console.log('hash Mosaic Definition...')
        this.typeCreatetxs(3)
      }
      if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicAlias)) {
        console.log('hash Mosaic Alias...')
      }
    }
  },
  watch: {
    confirmed (transactions) {
      this.validateTxHash(transactions)
    },
    unconfirmedAdded (transactions) {
      // console.log('unconfir')
      // this.validateTxHash(transactions)
    },
    status (hashs) {
      this.sendingForm = false
    }
  }
}
</script>
