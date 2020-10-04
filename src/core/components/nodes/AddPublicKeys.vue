<template>
  <div>
    <!-- MONITOR ADDRESS -->
    <v-row>
      <v-col cols="6">
        <v-checkbox
          dense
          class="mt-0 pt-0"
          :disabled="!currentNode"
          v-model="checkUnCheckAll"
          :label="labelCheckUnCheck"
          @change="changeValue"
        ></v-checkbox>
        <template v-for="(v, k) of itemsChannel">
          <v-checkbox
            class="mt-0 pt-0"
            dense
            v-model="connectToChannel"
            :disabled="!currentNode"
            :key="k"
            :label="v.label"
            :value="v.value"
          ></v-checkbox>
        </template>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="publicKeyField"
              dense
              counter
              outlined
              rounded
              label="Add Public Key"
              type="text"
              placeholder="Monitor Address"
              :disabled="!currentNode"
            ></v-text-field>
            <custom-buttons @action="pushedPublicKeys" :buttons="addPublicKeyBtn" />
          </v-col>
        </v-row>

        <!-- ADDRESS LIST -->
        <v-row v-if="arrayPublicAccounts.length > 0">
          <v-col cols="12" class="pb-0">
            <span class="overline">Address List:</span>
          </v-col>
          <v-col cols="12" class="pt-0">
            <template v-for="(item, key) of arrayPublicAccounts">
              <div :key="key">
                >
                <span class="caption">{{item.address.pretty()}}</span>
              </div>
            </template>
          </v-col>
          <v-col class="pt-0" cols="12">
            <custom-buttons @action="monitorPublicKey" :buttons="btnMonitorPbk" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      connectToChannel: [],
      publicKeyField: '',
      arrayPublicAccounts: [],
      buttonAddPbk: {
        addPbk: this.$utils.buildButton('addPbk', false, 'primary', false, 'Add Public Key')
      },
      buttonMonitorPbk: {
        monitorPbk: this.$utils.buildButton('monitorPbk', false, 'primary', false, 'Monitor Public Keys')
      },
      checkUnCheckAll: false,
      itemsChannel: [
        {
          label: 'Aggregate Bonded Added',
          value: 'aggregateBonded'
        },
        {
          label: 'Aggregate Bonded Removed',
          value: 'aggregateBondedRemoved'
        },
        {
          label: 'Cosignature Added',
          value: 'cosignatureAdded'
        },
        {
          label: 'Confirmed',
          value: 'confirmed'
        },
        {
          label: 'Unconfirmed Added',
          value: 'unconfirmedAdded'
        },
        {
          label: 'Unconfirmed Removed',
          value: 'unconfirmedRemoved'
        },
        {
          label: 'Status',
          value: 'status'
        }
      ]
    }
  },
  components: {
    'custom-buttons': () => import('@/core/components/shared/Buttons')
  },
  methods: {
    monitorPublicKey () {
      this.$websocketProvider.monitorAllChannels(this.arrayPublicAccounts.map(x => x.address))
    },
    pushedPublicKeys () {
      const publicAccount = this.$blockchainProvider.publicAccountFromPublicKey(this.publicKeyField, this.currentNode.networkType)
      console.log(publicAccount)
      this.arrayPublicAccounts.push(publicAccount)
      this.publicKeyField = ''
    },
    changeValue () {
      const connectToChannel = []
      if (this.checkUnCheckAll === true) {
        this.itemsChannel.forEach(element => {
          connectToChannel.push(element.value)
        })
      }
      this.connectToChannel = connectToChannel
      this.changeLabel()
    },
    changeLabel () {
      if (!this.currentNode) this.connectToChannel = []

      let name = ''
      if (this.connectToChannel.length === this.itemsChannel.length) {
        name = 'Uncheck All'
        this.checkUnCheckAll = true
      } else {
        name = 'Check All'
        this.checkUnCheckAll = false
      }

      return name
    }
  },
  computed: {
    ...mapGetters('nodeStoreNew', ['currentNode']),
    addPublicKeyBtn () {
      const buttons = this.buttonAddPbk
      buttons.addPbk.disabled = this.publicKeyField === '' || this.currentNode === null
      return buttons
    },
    btnMonitorPbk () {
      const buttons = this.buttonMonitorPbk
      buttons.monitorPbk.disabled = this.arrayPublicAccounts.length > 0 && !this.currentNode
      return buttons
    },
    labelCheckUnCheck () {
      return this.changeLabel()
    }
  }
}
</script>
