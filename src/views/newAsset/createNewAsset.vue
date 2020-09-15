<template >
  <!-- <div>CREATE NEW ASSETS</div> -->
  <v-col class="pa-3">
    <v-overlay :value="showLoading && getTempShow===0" opacity="0.9" color="white">
      <div v-if="showLoading">
        <progress-status
          :showLoading="showLoading"
          :progressMosaicDefi="progressMosaicDefi"
          :progressMosaicAlias="progressMosaicAlias"
        ></progress-status>
      </div>
    </v-overlay>
    <v-row>
      <v-col cols="12" class="headline font-weight-regular text-left primary--text">Create asset</v-col>
    </v-row>
    <!-- Template form-->
    <template v-if="getTempShow === 0">
      <v-row>
        <v-col cols="10 mx-auto" class="pt-0">
          <v-stepper
            class="pt-0"
            v-model="e1"
            style="webkit-box-shadow:none;  box-shadow:none, background:none"
          >
            <v-row>
              <v-col
                xs="12"
                sm="12"
                md="8"
                lg="4"
                xl="4"
                class="pa-0 mx-auto justify-space-around align-center"
              >
                <v-stepper-header style="box-shadow: none">
                  <v-stepper-step editable :complete="e1 > 1" step="1"></v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step editable :complete="e1 > 2" step="2"></v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step :complete="e1 > 3" step="3"></v-stepper-step>
                </v-stepper-header>
              </v-col>
            </v-row>

            <v-stepper-items class="ml-4 mr-4">
              <v-form v-model="valid" ref="form">
                <!-- STEP 1 -->
                <v-stepper-content class="pt-0" step="1">
                  <v-row class="leve ml-2 mr-2">
                    <v-col cols="6">
                      <div>
                        <img
                          style="vertical-align: middle;"
                          width="35"
                          height="30"
                          class="pr-1"
                          v-if="base64Img"
                          :src="base64Img"
                        />
                        <span v-if="!nameToAsset">Asset</span>
                        <span class="body-2 font-weight-black" v-if="nameToAsset">{{nameToAsset}}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pl-9 pr-9 pb-0">
                      <!-- Select namespace -->
                      <v-row>
                        <select-namespace @action="selectActionNamespace"></select-namespace>
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
                      <!-- Description asset -->
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            name="description"
                            class="pt-0 text-right"
                            v-model="descriptionAsset"
                            :label="configForm.description.label"
                            :color="inputStyle"
                            :rules="[configForm.description.rules.required ,
                                    configForm.description.rules.max,
                                    configForm.description.rules.min]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- File  icon mosaic -->
                      <v-row>
                        <file-icon-mosaic
                          @validIconMosaic="validIconMosaic"
                          @arrayToBase64Img="actionArrayToBase64Img"
                        ></file-icon-mosaic>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      class="ma-0 mx-auto caption d-flex justify-center align-center"
                    >
                      <v-btn
                        rounded
                        color="primary"
                        class="pl-8 pr-8 mt-2 body-2 mx-auto white--text"
                        @click="newsTep(2)"
                      >Next</v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>
                <!-- STEP 2 -->
                <v-stepper-content class="pt-0" step="2">
                  <v-row class="leve ml-2 mr-2">
                    <v-col cols="6">
                      <div>
                        <img
                          style="vertical-align: middle;"
                          width="35"
                          height="35"
                          class="pr-1"
                          v-if="base64Img"
                          :src="base64Img"
                        />
                        <span v-if="!nameToAsset">Asset</span>
                        <span class="body-2 font-weight-black" v-if="nameToAsset">{{nameToAsset}}</span>
                      </div>
                    </v-col>
                    <v-col cols="6" class="mx-auto d-flex justify-end align-center">
                      <v-btn rounded color="primary" x-small @click="e1 = 1">back</v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pl-9 pr-9 pb-0">
                      <!-- Transferable and  supply mutable-->
                      <v-row class="mt-2">
                        <v-col cols="12">
                          <v-select
                            v-model="moisaicFeature"
                            @change="triggerMoisaicFeature($event)"
                            :items="[{text: 'Transferable', value:'transferable'}, {text: 'Supply mutable', value:'supplyMutable'}]"
                            item-text="text"
                            item-value="value"
                            chips
                            multiple
                            dense
                            label="Asset feature"
                          ></v-select>
                          <div class="v-messages">
                            <div
                              style="line-height: 0.80rem;"
                              class="v-messages__message text-right subtitle-1 font-italic font-weight-medium text--secondary"
                            >
                              <span class="primary--text">Transferable,</span>
                              <span class>asset can be transferred.</span>
                              <span class="primary--text">Supply mutable,</span>
                              <span class>asset supply can be changed.</span>
                              <!-- <span>dos</span>
                              <span>tres</span>-->
                            </div>
                          </div>
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
                          <div class="v-messages">
                            <div
                              style="line-height: 0.80rem;"
                              class="v-messages__message text-right subtitle-1 font-italic font-weight-medium text--secondary"
                            >
                              <span>Maximum. rental duration 365 days (1 year).</span>
                              <!-- <span>dos</span>
                              <span>tres</span>-->
                            </div>
                          </div>
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
                            :rules="[configForm.divisibility.rules.required,
                                    configForm.divisibility.rules.min,
                                    configForm.divisibility.rules.max,
                                  ]"
                          ></v-text-field>
                          <div class="v-messages">
                            <div
                              style="line-height: 0.80rem;"
                              class="v-messages__message text-right subtitle-1 font-italic font-weight-medium text--secondary"
                            >
                              <span>Maximum divisibility is 6.</span>
                              <!-- <span>dos</span>
                              <span>tres</span>-->
                            </div>
                          </div>
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
                          <div class="v-messages">
                            <div
                              style="line-height: 0.80rem;"
                              class="v-messages__message text-right subtitle-1 font-italic font-weight-medium text--secondary"
                            >
                              <span>Maximum supply is 9 billion.</span>
                              <!-- <span>dos</span>
                              <span>tres</span>-->
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      class="pa-0 mx-auto caption d-flex justify-center align-center"
                    >
                      <v-btn
                        rounded
                        color="primary"
                        class="pl-8 pr-8 mt-2 body-2 mx-auto white--text"
                        @click="newsTep(3)"
                      >Next</v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>
                <!-- STEP 3 -->
                <v-stepper-content class="pt-0" step="3">
                  <v-row class="leve ml-2 mr-2">
                    <v-col cols="6">
                      <div>
                        <img
                          style="vertical-align: middle;"
                          width="35"
                          height="35"
                          class="pr-1"
                          v-if="base64Img"
                          :src="base64Img"
                        />
                        <span v-if="!nameToAsset">Asset</span>
                        <span v-if="nameToAsset">{{nameToAsset}}</span>
                      </div>
                    </v-col>
                    <v-col cols="6" class="mx-auto d-flex justify-end align-center">
                      <v-btn rounded color="primary" x-small @click="e1 = 2">back</v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    class="mt-3 ml-2 mr-2 d-flex mx-auto justify-sm-center justify-md-center justify-lg-space-between align-center"
                  >
                    <v-col
                      xs="10"
                      sm="10"
                      md="10"
                      lg="3"
                      xl="3"
                      class="leve d-flex justify-center align-center"
                    >
                      <span class="font-weight-bold mr-1">Supply:</span>
                      <span class>{{form.mosaic.supply}}</span>
                    </v-col>
                    <v-col
                      xs="10"
                      sm="5"
                      md="5"
                      lg="2"
                      xl="2"
                      class="leve margin-1px d-flex justify-center align-center"
                    >
                      <span class="font-weight-bold mr-1">Mutable:</span>
                      <v-icon v-if="form.mosaic.supplyMutable" color="teal darken-2">mdi-check-bold</v-icon>
                      <v-icon v-else color="red darken-1">mdi-close-thick</v-icon>
                    </v-col>
                    <v-col
                      xs="10"
                      sm="5"
                      md="5"
                      lg="2"
                      xl="2"
                      class="leve margin-1px d-flex justify-center align-center"
                    >
                      <span class="font-weight-bold mr-1">Transferable:</span>
                      <v-icon v-if="form.mosaic.transferable" color="teal darken-2">mdi-check-bold</v-icon>
                      <v-icon v-else color="red darken-1">mdi-close-thick</v-icon>
                    </v-col>

                    <v-col
                      xs="12"
                      sm="5"
                      md="5"
                      lg="2"
                      xl="2"
                      class="leve margin-1px d-flex justify-center align-center"
                    >
                      <span class="font-weight-bold mr-1">Divisibility:</span>
                      {{form.mosaic.divisibility}}
                    </v-col>
                    <v-col
                      xs="10"
                      sm="5"
                      md="5"
                      lg="2"
                      xl="2"
                      class="leve margin-1px d-flex justify-center align-center"
                    >
                      <span class="font-weight-bold mr-1">Duration:</span>
                      {{form.namespace.duration}} days
                    </v-col>
                  </v-row>
                  <!--Fee-->
                  <tx-fee :arrayFee="getMaxFeeTxs" />
                  <rental-fee :rentalFee="getRentalFee" />
                  <!--Password -->
                  <v-row>
                    <v-col
                      cols="9"
                      class="ma-0 pb-0 mx-auto caption d-flex justify-center align-center"
                    >
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
                  <!-- <v-row>
                    <v-col
                      cols="12"
                      class="ma-0 pa-0 mx-auto caption d-flex justify-center align-center"
                    >
                      <v-checkbox v-model="form.checkbox" class="pa-0"></v-checkbox>Accept terms and conditions
                    </v-col>
                  </v-row>-->

                  <v-row>
                    <v-col
                      cols="12"
                      class="ma-0 mx-auto caption d-flex justify-center align-center"
                    >
                      <custom-button @action="action" :align="'center'" :arrayBtn="getArrayBtn"></custom-button>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-form>
            </v-stepper-items>
          </v-stepper>
        </v-col>
      </v-row>
    </template>
    <!-- Template congratulations-->
    <template v-if="getTempShow === 1">
      <congratulations-Assets :colorText="'dim--text'" :txInfo="dataTx"></congratulations-Assets>
    </template>
  </v-col>
</template>
<script>
// import { dataComponent } from './dataViews.js'
import { PublicAccount } from 'tsjs-xpx-chain-sdk/dist/src/model/account/PublicAccount'
import { decrypt, validBalance } from '@/services/account-wallet-service'
import {
  buildMosaicDefinitionTransaction,
  buildMosaicSupplyChangeTransaction,
  buildMosaicAliasTransaction,
  buildModifyMetadataTransactionMosaic,
  getCalRentalFeeMosaic,
  mosaicNonceFromPublicKey
} from '@/services/mosaics-service'
import {
  buildRegisterNamespaceTransaction,
  getCalRentalFee,
  getCalRentalFeeSubNamespace,
  nameToAssetExample,
  validateNamespaceName,
  validateRootAndSubNamespace
} from '@/services/namespace-service'
import { aggregateTxFromArray, base64ImgFromArrayCom } from '@/services/icon-mosaic-service'
import { MosaicSupplyType } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicSupplyType'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      e1: 1,
      arrayBtn: null,
      base64Img: null,
      configForm: null,
      dataTx: [],
      dataAllTx: [],
      form: {
        mosaic: {
          description: null,
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
      rentalFee: 0,
      maxFee: 0,
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
      moisaicFeature: [{ text: 'Transferable', value: 'transferable' }],
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
      description: this.$configForm.descriptionAsset('Description asset'),
      durationAsset: this.$configForm.duration('Duration (number of days)'),
      password: this.$configForm.password()
    }
  },
  components: {
    'custom-button': () => import('@/components/shared/Buttons'),
    'congratulations-Assets': () => import('@/components/shared/CongratulationsAssets'),
    'select-namespace': () => import('@/components/shared/SelectNamespace'),
    'tx-fee': () => import('@/components/newAsset/txFee'),
    'rental-fee': () => import('@/components/newAsset/txRentalFee'),
    // 'features-mosaic-namespace': () => import('@/components/newAsset/featuresMosaicNamespace'),
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
    descriptionAsset: {
      get () {
        this.watchComputedDescriptionAssets()
        return this.form.mosaic.description
      },
      set (newValue) {
        this.form.mosaic.description = newValue
      }
    },
    nameToAsset () {
      return this.nameToAssetFuc(
        nameToAssetExample(this.form.namespace.name, this.nameSubNamespace)
      )
    },
    getArrayBtn () {
      return this.arrayBtnFuc()
    },
    getTempShow () {
      return this.tempShow()
    },
    getMaxFeeTxs () {
      return this.calMaxFeeTxs(this.maxFeeTxs)
    },
    getRentalFee () {
      return this.calRentalFee()
    }
  },
  methods: {
    ...mapMutations('transactionsStore', ['SET_MONITOR_HASH', 'REMOVE_MONITOR_HASH']),
    arrayBtnFuc () {
      const arrayBtn = this.arrayBtn
      arrayBtn['create'].disabled =
        // !this.isValidIconMosaic || !this.valid || !this.form.checkbox || this.isValidateBalance
        !this.isValidIconMosaic || !this.valid || this.isValidateBalance
      arrayBtn['create'].loading = this.sendingForm
      arrayBtn['create'].color = 'white'
      arrayBtn['create'].textColor = 'primary--text'
      return arrayBtn
    },
    announceTx (transaction, type) {
      if (this.valid && !this.sendingForm) {
        let common = decrypt(this.currentAccount.simpleWallet, this.form.password)
        const signedTransaction = this.$blockchainProvider.signedTransaction(
          common.privateKey,
          transaction,
          this.currentAccount.simpleWallet.network
        )
        // console.log('signedTransaction', signedTransaction)
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
          if (
            validBalance(this.rentalFee + this.maxFee) &&
            this.$generalService.showMsgStatusNode()
          ) {
            this.typeCreatetxs(this.typeAction())
          }
      }
    },
    actionArrayToBase64Img (data) {
      if (data) {
        this.base64Img = base64ImgFromArrayCom(data.arrayString)
        // console.log(base64ImgFromArrayCom(data.arrayString))
        this.txsTransferIcon = aggregateTxFromArray(data, this.currentAccount.publicKey)
      } else {
        this.base64Img = null
        this.txsTransferIcon = null
      }
    },
    calRentalFee () {
      const isSubnamespace = this.form.namespace.type
      let val = getCalRentalFee(this.form.namespace.duration) + getCalRentalFeeMosaic()
      if (isSubnamespace === 'subNamespaceName') {
        val = val + getCalRentalFeeSubNamespace()
      }
      return (this.rentalFee = val)
    },
    calMaxFeeTxs (v) {
      this.maxFee = this.$generalService.sumObject(v)
      return v
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
    mosaicNonceFromPublicKey () {
      // console.log('this.currentAccount', this.currentAccount)
      const mosaicNonce = mosaicNonceFromPublicKey(this.currentAccount.publicKey)
      this.mosaic.randomNonce = mosaicNonce.randomNonce
      this.mosaic.mosaicId = mosaicNonce.mosaicId
    },
    nameToAssetFuc (value) {
      return (this.fullNameNamespace = value)
    },
    newsTep (tep) {
      this.e1 = tep
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
    typeAction () {
      return 0
    },
    triggerMoisaicFeature (type) {
      if (type.find(x => x === 'transferable')) {
        this.form.mosaic.transferable = true
      } else {
        this.form.mosaic.transferable = false
      }
      if (type.find(x => x === 'supplyMutable')) {
        this.form.mosaic.supplyMutable = true
      } else {
        this.form.mosaic.supplyMutable = false
      }
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
            // console.log('CASE #0')
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
          // if (this.txsTransferIcon) {
          let modifications = [
            {
              type: 0,
              key: 'desc',
              value: this.form.mosaic.description
            }
          ]
          if (this.txsTransferIcon) {
            modifications.push({
              type: 0,
              key: 'icon',
              value: this.hashFromMetadata
            })
          }
          const modifyMetadataTransactionMoisac = buildModifyMetadataTransactionMosaic(
            this.mosaic.mosaicId,
            modifications
          ).transaction

          // this.hashMosaicDefinition = null
          if (!calcMaxFee) {
            // console.log('CASE #1')
            // announce Tx

            this.pushAllDataTx(action)
            this.announceTx(modifyMetadataTransactionMoisac, action)
          } else {
            // calcMaxFee
            return modifyMetadataTransactionMoisac.maxFee.compact()
          }
          // } else {
          //   return 0
          // }
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
            // console.log('CASE #3')
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
      if (namespaceId) this.namespaceIdLink = this.$blockchainProvider.getNamespaceId(namespaceId)
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
        if (this.isValidNamespaceName === true) {
          this.getMaxFiiTx([0, 1, 3])
        }
      }
    },
    validateTxHashMosaicDefinition (transactions) {
      if (
        transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicDefinition)
      ) {
        this.dataTx.push({ hash: this.hashMosaicDefinition, name: 'Mosaic Definition' })
        this.hashMosaicDefinition = null
        this.validateLoadingTX(true, true)
        // console.log('hash Mosaic Definition...')
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
          this.dataTx.push({ hash: this.hashMosaicAlias, name: 'Mosaic Alias' })
          this.hashMosaicAlias = null
        }, 1000)
        // console.log('hash Mosaic Alias...')
        this.sendingForm = false
      }
      if (transactions.map(t => t.transactionInfo.hash).find(h => h === this.hashMosaicMetadata)) {
        setTimeout(() => {
          this.dataTx.push({ hash: this.hashMosaicMetadata, name: 'Mosaic Metadata' })
          this.hashMosaicMetadata = null
        }, 1000)
        // console.log('hash Mosaic Metadata...')
        this.sendingForm = false
      }
    },
    validIconMosaic (event) {
      // console.log('validIconMosaic event', event)
      this.isValidIconMosaic = event
      this.getMaxFiiTx([0, 3])
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
    watchComputedNamespaceName () {
      this.validNamespaceName()
    },
    watchComputedDescriptionAssets () {
      this.getMaxFiiTx([1])
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
<style lang="css">
span.v-stepper__step__step.primary {
  width: 60;
  height: 60;
}
.margin-1px {
  margin: 1px !important;
}
</style>
