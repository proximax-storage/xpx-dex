<template>
  <!-- <div>CREATE NEW ASSETS</div> -->
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">New asset</v-col>
    </v-row>
    <v-row class="ma-3">
      <v-col sm="12" md="6" lg="8" col="8" class="pt-0">
        <v-form v-model="valid" ref="form">
          <!-- name asset -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                name="namespaceName"
                class="pt-0 text-right"
                v-model="namespaceName"
                :label="configForm.namespaceName.label"
                :color="inputStyle"
                :rules="[configForm.namespaceName.rules.required ,
                configForm.namespaceName.rules.max,
                configForm.namespaceName.rules.min,
                isValidNamespaceName]"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Supply -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                :type="configForm.supply.type"
                name="Supply"
                class="pt-0 text-right"
                :min="configForm.supply.min"
                :max="configForm.supply.max"
                v-model="form.mosaic.supply"
                :label="configForm.supply.label"
                :color="inputStyle"
                :rules="[
                configForm.supply.rules.required,
                configForm.supply.rules.min,
                configForm.supply.rules.max,
              ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Divisibility -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                :type="configForm.divisibility.type"
                name="divisibility"
                class="pt-0 text-right"
                :min="configForm.divisibility.min"
                :max="configForm.divisibility.max"
                v-model="form.mosaic.divisibility"
                :label="configForm.divisibility.label"
                :color="inputStyle"
                :rules="[
                configForm.divisibility.rules.required,
                configForm.divisibility.rules.min,
                configForm.divisibility.rules.max,
              ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Transferable and  supply mutable-->
          <v-row class="d-flex mx-auto justify-space-around align-center">
            <v-col col="12" class="pa-0 d-flex mx-auto justify-space-around align-center">
              <v-checkbox v-model="form.mosaic.transferable" label="Transferable"></v-checkbox>
              <v-checkbox v-model="form.mosaic.supplyMutable" label="Supply Mutable"></v-checkbox>
            </v-col>
          </v-row>
          <!-- Select namespace -->
          <v-row>
            <select-namespace @action="selectActionNamespace"></select-namespace>
          </v-row>

          <!-- Duration asset -->
          <v-row class="mt-2">
            <v-col cols="12">
              <v-text-field
                :type="configForm.durationAsset.type"
                name="Supply"
                class="pt-0 text-right"
                :min="configForm.durationAsset.min"
                :max="configForm.durationAsset.max"
                v-model="form.namespace.duration"
                :label="configForm.durationAsset.label"
                :color="inputStyle"
                :rules="[
                configForm.durationAsset.rules.required,
                configForm.durationAsset.rules.min,
                configForm.durationAsset.rules.max,
              ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <!--Fee-->
          <tx-fee />
          <rental-fee />
          <!--Password -->
          <v-row>
            <v-col cols="9" class="ma-0 pb-0 mx-auto caption d-flex justify-center align-center">
              <v-text-field
                dense
                v-model="form.password"
                :append-icon="configForm.password.show ? 'mdi-eye' : 'mdi-eye-off'"
                :minlength="configForm.password.min"
                :maxlength="configForm.password.max"
                :counter="configForm.password.max"
                :color="inputStyle"
                :rules="[
                    configForm.password.rules.required,
                    configForm.password.rules.min,
                    configForm.password.rules.max
                  ]"
                :label="configForm.password.label"
                :type="configForm.password.show ? 'text' : 'password'"
                name="password"
                hint
                @click:append="configForm.password.show = !configForm.password.show"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="ma-0 pa-0 mx-auto caption d-flex justify-center align-center">
              <v-checkbox v-model="form.checkbox" class="pa-0"></v-checkbox>Accept terms and conditions
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="ma-0 mx-auto caption d-flex justify-center align-center">
              <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col sm="12" md="6" lg="4" col="4" class="pt-0">informacion</v-col>
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
import {
  buildRegisterNamespaceTransaction,
  validateNamespaceName
} from '@/services/namespace-service'
import { MosaicSupplyType } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicSupplyType'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      arrayBtn: null,
      configForm: null,
      form: {
        mosaic: {
          duration: undefined,
          divisibility: 1,
          supplyMutable: false,
          transferable: true,
          restrictable: false,
          supply: 800000000
        },
        namespace: {
          name: null,
          duration: 1,
          type: 'rootNamespaceName'
        },
        password: null,
        checkbox: false
      },
      regexNamespace: null,
      hashMosaicDefinition: null,
      hashMosaicAlias: null,
      namespaceIdLink: null,
      mosaicIdLink: null,
      inputStyle: 'inputStyle',
      valid: null,
      isValidNamespaceName: true,
      isValidateBalance: false
    }
  },
  beforeMount () {
    this.regexNamespace = /^[0-9]{3}$/
    this.arrayBtn = {
      place: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text')
    }
    this.configForm = {
      divisibility: this.$configForm.divisibility('Divisibility'),
      supply: this.$configForm.supply('Supply'),
      namespaceName: this.$configForm.namespaceName('Name asset'),
      durationAsset: this.$configForm.duration('Duration (number of days)'),
      password: this.$configForm.password()
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons'),
    'select-namespace': () => import('@/components/shared/SelectNamespace'),
    'tx-fee': () => import('@/components/shared/TxFee'),
    'rental-fee': () => import('@/components/shared/TxRentalFee')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    ...mapGetters('transactionsStore', ['confirmed', 'unconfirmedAdded', 'status']),
    namespaceName: {
      get () {
        this.validNamespaceName()
        return this.form.namespace.name
      },
      set (newValue) {
        this.form.namespace.name = newValue
      }
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['place'].disabled = !this.valid || !this.form.checkbox || this.isValidateBalance
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
    selectActionNamespace (data) {
      console.log('quelo que ', data)
    },
    validNamespaceName () {
      if (this.form.namespace.name) {
        this.isValidNamespaceName = validateNamespaceName(this.form.namespace.name)
      }
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
    unconfirmedAdded (transactions) {},
    status (hashs) {
      this.sendingForm = false
    }
  }
}
</script>
