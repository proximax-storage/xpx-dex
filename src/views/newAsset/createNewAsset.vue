<template >
  <!-- <div>CREATE NEW ASSETS</div> -->
  <v-col class="pa-3">
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">New asset</v-col>
    </v-row>
    <!-- Template form-->
    <template v-if="tempShow === 0">
      <v-row class="ma-3">
        <v-col sm="12" md="6" lg="7" col="7" class="pt-0">
          <v-form v-model="valid" ref="form">
            <!-- File  icon mosaic -->
            <v-row>
              <file-icon-mosaic
                @validIconMosaic="validIconMosaic"
                @arrayToBase64Img="actionArrayToBase64Img"
              ></file-icon-mosaic>
            </v-row>
            <!-- Name asset -->
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
            <!-- Select namespace -->
            <v-row>
              <select-namespace @action="selectActionNamespace"></select-namespace>
            </v-row>
            <!-- Example name to asset-->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  :value="getNameToAsset"
                  label="Name to asset"
                  outlined
                  disabled
                  dense
                  class="pt-0 text-right"
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
            <!-- <div>maxfeee al tx ::: {{maxFeeTxs}}</div>

            <div>rental fee namespace::: {{rentalFeeNamespace}}</div>
            <div>rental fee namespace::: {{rentalFeeMoisac}}</div>
            <div>rental fee total::: {{$generalService.amountFormatter(totalRentalFee, 6)}}</div>
            <div>rental fee total tx::: 20,000.755250</div>-->
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
        <v-col sm="12" md="6" lg="5" col="5" class="pt-0">
          <features-mosaic-namespace :supply="configForm.supply.max"></features-mosaic-namespace>
          <div v-if="showLoading">
            <progress-status
              :showLoading="showLoading"
              :progressMosaicDefi="progressMosaicDefi"
              :progressMosaicAlias="progressMosaicAlias"
            ></progress-status>
          </div>
        </v-col>
      </v-row>
    </template>
    <!-- Template congratulations-->
    <template v-if="tempShow === 1">
      <congratulations-Assets :colorText="'dim--text'" :txInfo="dataTx"></congratulations-Assets>
    </template>
  </v-col>
</template>

<script>
import { PublicAccount } from 'tsjs-xpx-chain-sdk/dist/src/model/account/PublicAccount'
import { MosaicNonce } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNonce'
import { decrypt } from '@/services/account-wallet-service'
import {
  buildMosaicDefinitionTransaction,
  buildMosaicSupplyChangeTransaction,
  buildMosaicAliasTransaction,
  buildModifyMetadataTransactionMosaic
} from '@/services/mosaics-service'
import {
  buildRegisterNamespaceTransaction,
  getCalRentalFee,
  validateNamespaceName,
  validateRootAndSubNamespace
} from '@/services/namespace-service'
import { aggregateTxFromArray } from '@/services/icon-mosaic-service'
import { MosaicSupplyType } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicSupplyType'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      arrayBtn: null,
      configForm: null,
      dataTx: [],
      dataAllTx: [],
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
      hashFromMetadata: null,
      hashMosaicAlias: null,
      hashMosaicMetadata: null,
      namespaceIdLink: null,
      namespaceInfo: null,
      nameSubNamespace: null,
      fullNameNamespace: null,
      mosaicIdLink: null,
      mosaic: {
        mosaicId: null,
        randomNonce: null
      },
      maxFeeTxs: {
        maxFeeAggregate: 0,
        maxFeeMetadataMosaic: 0,
        maxFeeMosaicAlias: 0
      },
      sendingForm: false,
      showLoading: false,
      inputStyle: 'inputStyle',
      txsTransferIcon: null,
      valid: null,
      isValidNamespaceName: true,
      isValidateBalance: false,
      isValidIconMosaic: true,
      progressMosaicDefi: false,
      progressMosaicAlias: false
    }
  },
  beforeMount () {
    this.mosaicNonceFromPublicKey()
    this.regexNamespace = /^[0-9]{3}$/
    this.arrayBtn = {
      create: this.$configForm.buildButton('Create', 'create', 'create', 'primary', 'white--text')
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
    'congratulations-Assets': () => import('@/components/shared/CongratulationsAssets'),
    'select-namespace': () => import('@/components/shared/SelectNamespace'),
    'tx-fee': () => import('@/components/shared/TxFee'),
    'rental-fee': () => import('@/components/shared/TxRentalFee'),
    'features-mosaic-namespace': () => import('@/components/newAsset/featuresMosaicNamespace'),
    'file-icon-mosaic': () => import('@/components/newAsset/fileIconMosaic'),
    'progress-status': () => import('@/components/newAsset/progressStatusTx')
  },
  computed: {
    ...mapGetters('accountStore', ['currentAccount']),
    ...mapGetters('transactionsStore', ['confirmed', 'unconfirmedAdded', 'status']),
    namespaceName: {
      get () {
        this.watchComputedNamespaceName()
        return this.form.namespace.name
      },
      set (newValue) {
        this.form.namespace.name = newValue
      }
    },
    getNameToAsset: {
      get () {
        return this.nameToAssetExample(this.form.namespace.name, this.nameSubNamespace)
      }
    },
    getArrayBtn () {
      const arrayBtn = this.arrayBtn
      arrayBtn['create'].disabled =
        !this.isValidIconMosaic || !this.valid || !this.form.checkbox || this.isValidateBalance
      arrayBtn['create'].loading = this.sendingForm
      arrayBtn['create'].color = 'white'
      arrayBtn['create'].textColor = 'white--text'
      arrayBtn['create'].textColor = 'primary--text'
      return arrayBtn
    },
    tempShow () {
      let tempType = 0
      if (this.dataAllTx.length === 3 && this.dataTx.length === 3) {
        tempType = 1
      } else if (this.dataAllTx.length === 2 && this.dataTx.length === 2) {
        tempType = 1
      } else {
        tempType = 0
      }
      return tempType
    },
    rentalFeeNamespace () {
      return getCalRentalFee(this.form.namespace.duration)
    },
    rentalFeeMoisac () {
      return 10000000000
    },
    totalRentalFee: {
      get () {
        return getCalRentalFee(this.form.namespace.duration) + 10000000000
      }
    }
  },
  methods: {
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    announceTx (transaction, type) {
      if (this.valid && !this.sendingForm) {
        let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
        const signedTransaction = this.$blockchainProvider.signedTransaction(
          common.privateKey,
          transaction,
          this.currentAccount.simpleWallet.network
        )
        console.log('signedTransaction', signedTransaction)
        this.sendingForm = true
        common = null
        if (type === 0) {
          this.hashMosaicDefinition = signedTransaction.hash
          this.hashFromMetadata = signedTransaction.hash
        }
        if (type === 1) this.hashMosaicMetadata = signedTransaction.hash
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
            this.sendingForm = false
            this.REMOVE_MONITOR_HASH(dataMonitorHash)
          }
        )
      }
    },
    action (action) {
      switch (action) {
        case 'create':
          this.typeCreatetxs(this.typeAction())
      }
    },
    actionArrayToBase64Img (data) {
      if (data) {
        this.txsTransferIcon = aggregateTxFromArray(data, this.currentAccount.publicKey)
      } else {
        this.txsTransferIcon = null
      }
    },
    mosaicNonceFromPublicKey () {
      this.mosaic.randomNonce = MosaicNonce.createRandom()
      this.mosaic.mosaicId = this.$blockchainProvider.mosaicNonceFromPublicKey(
        this.currentAccount.publicKey,
        this.mosaic.randomNonce
      )
    },
    nameToAssetExample (nameForm = null, nameNamespace = null) {
      let name = null
      if (nameForm && nameNamespace) {
        name = `${nameNamespace}.${nameForm}`
      } else {
        name = nameForm
      }
      return (this.fullNameNamespace = name)
    },
    typeAction () {
      return 0
    },
    typeCreatetxs (action, calcMaxFee = false) {
      switch (action) {
        case 0:
          /**
           * type tx : Aggregate transaction
           * Mosaic definition transaction
           * Mosaic supplyChange transaction
           * Register namespace transaction
           */

          // Mosaic definition transaction
          this.dataTx = []
          let innerTransaction = []
          const mosaicDefinitionTransaction = buildMosaicDefinitionTransaction(
            this.currentAccount.publicKey,
            this.mosaic.randomNonce,
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
          const namespaceName = validateRootAndSubNamespace(
            this.form.namespace.name,
            this.nameSubNamespace,
            this.form.namespace.type
          )
          const registerNamespaceTransaction = buildRegisterNamespaceTransaction(
            namespaceName.rootNamespaceName,
            namespaceName.subNamespaceName,
            this.form.namespace.duration,
            this.form.namespace.type
          ).transaction
          const publicAccount = PublicAccount.createFromPublicKey(
            this.currentAccount.publicKey,
            this.currentAccount.simpleWallet.network
          )
          innerTransaction = [
            mosaicDefinitionTransaction.toAggregate(publicAccount),
            registerNamespaceTransaction.toAggregate(publicAccount),
            mosaicSupplyChangeTransaction.toAggregate(publicAccount)
          ]
          // toAggregate innerTx icon Mosaic
          if (this.txsTransferIcon) {
            for (let x of this.txsTransferIcon) {
              innerTransaction.push(x.toAggregate(publicAccount))
            }
          }
          this.setMosaicIdAndNamespace(
            mosaicDefinitionTransaction.mosaicId.toHex(),
            this.fullNameNamespace
          )

          if (!calcMaxFee) {
            console.log('CASE #0')
            // announce Tx
            this.pushAllDataTx(action)
            this.validateLoadingTX(true)
            this.announceTx(this.$blockchainProvider.aggregateTransaction(innerTransaction), action)
          } else {
            // calcMaxFee
            return this.$blockchainProvider.aggregateTransaction(innerTransaction).maxFee.compact()
          }
          break
        // type action : 3
        case 1:
          /**
           * Metadata
           **/
          // const hash = this.hashMosaicDefinition
          if (this.txsTransferIcon) {
            let modifications = [
              {
                type: 0,
                key: 'icon',
                value: this.hashFromMetadata
              }
            ]
            const modifyMetadataTransactionMoisac = buildModifyMetadataTransactionMosaic(
              this.mosaic.mosaicId,
              modifications
            ).transaction

            // this.hashMosaicDefinition = null
            if (!calcMaxFee) {
              console.log('CASE #1')
              // announce Tx

              this.pushAllDataTx(action)
              this.announceTx(modifyMetadataTransactionMoisac, action)
            } else {
              // calcMaxFee
              return modifyMetadataTransactionMoisac.maxFee.compact()
            }
          } else {
            return 0
          }
          break
        case 3:
          /**
           * Link = 0, Unlink = 1
           * type : Linking a namespace to a mosaic
           * AliasTransaction create for Mosaic
           */

          // AliasTransaction create for Mosaic
          const mosaicAliasTransaction = buildMosaicAliasTransaction(
            0,
            this.namespaceIdLink,
            this.mosaic.mosaicId
          ).transaction
          if (!calcMaxFee) {
            console.log('CASE #3')
            // announce Tx
            this.pushAllDataTx(action)
            this.announceTx(mosaicAliasTransaction, action)
          } else {
            // calcMaxFee
            return mosaicAliasTransaction.maxFee.compact()
          }
      }
    },
    pushAllDataTx (action) {
      const actionString = String(action)
      if (actionString) {
        this.dataAllTx.push(actionString)
      } else {
        this.dataAllTx = []
      }
    },
    setMosaicIdAndNamespace (mosaicId, namespaceId) {
      let name = null
      // this.mosaicIdLink = this.$blockchainProvider.getMosaicId(mosaicId)
      if (namespaceId) {
        name = namespaceId
      }
      this.namespaceIdLink = this.$blockchainProvider.getNamespaceId(name)
    },
    selectActionNamespace (data) {
      if (data.idToHex && data.namespaceInfo) {
        this.form.namespace.type = 'subNamespaceName'
        this.namespaceInfo = data.namespaceInfo
        this.nameSubNamespace = data.namespaceName.name
      } else {
        this.form.namespace.type = 'rootNamespaceName'
        this.namespaceInfo = null
        this.nameSubNamespace = null
      }
    },
    validNamespaceName () {
      if (this.form.namespace.name) {
        this.isValidNamespaceName = validateNamespaceName(this.form.namespace.name)
      }
    },
    validateTxHashMosaicDefinition (transactions) {
      if (
        transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicDefinition)
      ) {
        this.dataTx.push({ hash: this.hashMosaicDefinition })
        this.hashMosaicDefinition = null
        this.validateLoadingTX(true, true)
        console.log('hash Mosaic Definition...')
        this.sendingForm = false
        setTimeout(() => {
          this.sendingForm = false
          this.typeCreatetxs(1)
        }, 2000)
        this.typeCreatetxs(3)
      }
    },
    validateTxHashMosaicAliasMosaicMetadata (transactions) {
      if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicAlias)) {
        this.validateLoadingTX(true, false, true)
        setTimeout(() => {
          this.dataTx.push({ hash: this.hashMosaicAlias })
          this.hashMosaicAlias = null
        }, 1000)
        console.log('hash Mosaic Alias...')
        this.sendingForm = false
      }
      if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicMetadata)) {
        setTimeout(() => {
          this.dataTx.push({ hash: this.hashMosaicMetadata })
          this.hashMosaicMetadata = null
        }, 1000)
        console.log('hash Mosaic Metadata...')
        this.sendingForm = false
      }
    },
    validIconMosaic (event) {
      this.isValidIconMosaic = event
      this.getMaxFiiTx([0, 1, 3])
    },
    validateLoadingTX (
      showLoading = false,
      progressMosaicDefiV = false,
      progressMosaicAliasV = false
    ) {
      this.showLoading = showLoading
      this.progressMosaicDefi = progressMosaicDefiV
      this.progressMosaicAlias = progressMosaicAliasV
    },
    getMaxFiiTx (typeTxs = []) {
      for (let i in typeTxs) {
        const t = Number(typeTxs[i])
        if (t === 3) {
          this.maxFeeTxs.maxFeeMosaicAlias = Number(this.typeCreatetxs(t, true))
        }
        if (t === 0) {
          this.maxFeeTxs.maxFeeAggregate = Number(this.typeCreatetxs(t, true))
        }
        if (t === 1) {
          this.maxFeeTxs.maxFeeMetadataMosaic = Number(this.typeCreatetxs(t, true))
        }
      }
    },
    watchComputedNamespaceName () {
      this.validNamespaceName()
      this.getMaxFiiTx([0, 1, 3])
    }
  },
  watch: {
    confirmed (transactions) {
      this.validateTxHashMosaicDefinition(transactions)
    },
    unconfirmedAdded (transactions) {
      this.validateTxHashMosaicAliasMosaicMetadata(transactions)
    },
    status (hashs) {
      this.sendingForm = false
      this.validateLoadingTX(false, false, false)
    }
  }
}
</script>
