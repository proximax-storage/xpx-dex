import nodeMixins from './node-mixin'
import accountMixins from './account-mixin'
import socketMixins from './socket-mixin'
import namespacesMixins from './namespaces-mixin'
import { NetworkType } from 'tsjs-xpx-chain-sdk'
export default {
  mixins: [nodeMixins, accountMixins, namespacesMixins, socketMixins],
  data: () => {
    return {
      pseudonymApp: null
    }
  },
  beforeMount () {
    this.pseudonymApp = this.$store.state.configInfo.pseudonymApp
  },
  methods: {
    auth (password, wallet) {
      const currentAccount = Object.assign(
        {},
        wallet.accounts.find(elm => elm.firstAccount === true)
      )
      if (currentAccount) {
        if (!this.getNodeSelected()) {
          this.initNode()
        }
        const decrypt = this.decrypt(wallet.accounts[0].simpleWallet, password)
        if (!decrypt) {
          return false
        } else {
          let isValid = true
          const network = NetworkType[this.$environment.connectionNodes.networkType]
          wallet.accounts.forEach(element => {
            if (element.simpleWallet.network !== network) {
              isValid = false
            }
          })

          if (isValid) {
            this.use(wallet)
          } else {
            this.$store.dispatch('showMSG', {
              snackbar: true,
              text: `Account not allowed for this network`,
              color: 'error'
            })
            return false
          }
        }
      } else {
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: `Dear user, the wallet is missing`,
          color: 'error'
        })
        return false
      }
      this.$store.commit('mosaicStore/SET_MOSAICS', [])
      this.closeConection()
      this.connectnWs()
      this.searchNamespacesFromAccounts(wallet.accounts)
      this.set_searchAccountsInfo(wallet.accounts)
      return true
    },
    createWallet (data) {
      const existWallet = this.getWalletByName(data.walletName, data.network)
      if (existWallet === undefined || existWallet === null) {
        let walletCreated = null
        if (data.privateKey) {
          const prefixAndPvk = this.$blockchainProvider.getPrefixAndPrivateKey(data.privateKey)
          walletCreated = this.$blockchainProvider.createSimpleWalletFromPrivateKey(
            data.walletName,
            data.password,
            prefixAndPvk.pvk,
            data.network
          )
        } else {
          walletCreated = this.$blockchainProvider.createSimpleWallet(
            data.walletName,
            data.password,
            data.network
          )
        }
        const decrypted = this.decrypt(walletCreated, data.password)
        if (decrypted.privateKey) {
          const account = this.$blockchainProvider.getAccountFromPrivateKey(
            decrypted.privateKey,
            walletCreated.network
          )
          const accountBuilded = {
            default: data.default,
            firstAccount: data.firstAccount,
            name: 'Primary',
            simpleWallet: walletCreated,
            publicKey: account.publicAccount.publicKey
          }

          const walletBuilded = {
            username: data.walletName,
            accounts: [accountBuilded]
          }

          const wallets = this.getWallets()
          wallets.push(walletBuilded)
          this.$storage.set(`wallets-${this.pseudonymApp}`, wallets)
          this.$store.commit('walletStore/SET_CURRENT_WALLET', walletBuilded)
          return { status: true, data: walletBuilded, pvk: decrypted.privateKey }
        }
        return { status: false, msg: 'Error to decrypt wallet' }
      }
      return { status: false, msg: 'Wallet name already exists, try another name' }
    },
    decrypt (account, password) {
      const common = { password: password }
      const toDecrypt = {
        algo: 'pass:bip32',
        address: account.address['address'],
        encrypted: account.encryptedPrivateKey.encryptedKey,
        iv: account.encryptedPrivateKey.iv
      }

      const decrypt = this.$blockchainProvider.decrypt(common, toDecrypt, account.network)
      if (decrypt && decrypt.status) {
        return common
      }
      if (!decrypt.status) {
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: decrypt.msg,
          color: 'error'
        })
        return decrypt.status
      }
    },
    getWalletByName (name) {
      const wallets = this.getWallets()
      if (wallets && wallets.length > 0) {
        return wallets.find(x => x.username === name)
      }
      return null
    },
    getWallets () {
      if (this.pseudonymApp) {
        const wallets = this.$storage.get(`wallets-${this.pseudonymApp}`)
        if (!wallets) {
          this.$storage.set(`wallets-${this.pseudonymApp}`, [])
          return []
        }

        return JSON.parse(wallets)
      }

      return []
    },
    use (wallet) {
      if (!wallet) {
        this.$store.dispatch('showMSG', {
          snackbar: true,
          text: `You can not set anything like the current wallet`,
          color: 'error'
        })
        return false
      }
      this.$store.commit('walletStore/SET_CURRENT_WALLET', wallet)
      const currentAccount = this.getAccountDefault(wallet)
      this.setCurrentAccount(currentAccount)
      return true
    }
  }
}
