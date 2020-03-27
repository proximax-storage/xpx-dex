import nodeMixins from './node-mixin'
import { Listener } from 'tsjs-xpx-chain-sdk'
import { mapMutations } from 'vuex'
export default {
  mixins: [nodeMixins],
  data: () => ({
    audio: HTMLAudioElement,
    audio2: HTMLAudioElement,
    connector: [],
    reconnectNode: [],
    url: null,
    currentWallet: null,
    reconnectNum: 0
  }),
  methods: {
    ...mapMutations('socketBcStore', ['SET_STATUS_TX']),
    connectnWs (node = null) {
      this.connector = []
      this.reconnectNode = []
      const route = node === null ? this.getNodeSelected() : node
      this.url = `${this.$environment.connectionNodes.protocolWs}://${route}`
      this.currentWallet = Object.assign({}, this.$store.getters['walletStore/currentWallet'])
      for (let index = 0; index < this.currentWallet.accounts.length; index++) {
        const element = this.currentWallet.accounts[index]
        const ad = this.$blockchainProvider.createFromRawAddress(
          element.simpleWallet.address.address
        )
        console.log('ad', ad)
        const b = new Listener(this.url, WebSocket)
        this.connector.push(b)
        b.open().then(
          () => {
            this.audio = new Audio('assets/audio/ding.ogg')
            this.audio2 = new Audio('assets/audio/ding2.ogg')
            this.reconnectNode.push(false)
            this.getBlockSocket(b)
            this.getStatusSocket(b, this.audio2, ad)
            this.getConfirmedSocket(b, this.audio, ad)
            this.getUnConfirmedAddedSocket(b, this.audio, ad)
          },
          error => {
            console.error(error)
            this.reconnectNode.push(true)
          }
        )
      }
      setTimeout(() => {
        // console.log('this.reconnectNode', this.reconnectNode)
        const status = this.reconnectNode.some(element => element === true)
        console.log('status', status)
        if (status) {
          this.reconnectNum = this.reconnectNum + 1
          console.log('this.reconnectNum', this.reconnectNum)
          if (this.reconnectNum === 1) {
            this.$store.dispatch('showMSG', {
              snackbar: true,
              text: `Error connecting to the node`,
              color: 'error'
            })
          }
          //   this.nodeService.setNodeStatus(false)
          this.reconnect()
        } else {
          this.reconnectNum = 0
          //   this.nodeService.setNodeStatus(true)
        }
      }, 5000)
      // });
    },
    /**
     * Reconnect
     *
     * @param {Listener} connector
     * @returns
     * @memberof DataBridgeService
     */
    reconnect () {
      console.warn('reconnect...')
      // this.nodeService.updateNewNode();
      this.closeConection()
      this.reconnectNode = []
      this.connectnWs()
    },
    /**
     * Close connection websocket
     * @memberof socketMixin
     */
    closeConection () {
      if (this.connector.length > 0) {
        this.connector.forEach(element => {
          element.close()
          element.terminate()
        })
      }
    },
    getBlockSocket (connector) {
      connector.newBlock().subscribe(
        blockInfo => {
          console.log('new block -->', blockInfo.numTransactions)
          console.log('new block -->', blockInfo.height.compact())
          //   this.saveBlockInfo(blockInfo)
        },
        err => {
          console.error(err)
          //   this.sharedService.showError('Error', err)
        }
      )
    },
    getStatusSocket (connector, audio, address) {
      connector.status(address).subscribe(status => {
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: `${status.status.split('_').join(' ')}`,
          color: 'info'
        })

        this.SET_STATUS_TX({
          type: 'status',
          hash: status.hash
        })
      })
      // });
    },
    getConfirmedSocket (connector, audio, address) {
      connector.confirmed(address).subscribe(async confirmedTransaction => {
        // audio.play()
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: `Transaction confirmed`,
          color: 'success'
        })
        this.SET_STATUS_TX({
          type: 'confirmed',
          hash: confirmedTransaction.transactionInfo.hash
        })
      })
    },
    getUnConfirmedAddedSocket (connector, audio, address) {
      connector.confirmed(address).subscribe(async confirmedTransaction => {
        // audio.play()
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: `Transaction Unconfirmed`,
          color: 'success'
        })
        this.SET_STATUS_TX({
          type: 'unconfirmed',
          hash: confirmedTransaction.transactionInfo.hash
        })
      })
    }
  }
}
