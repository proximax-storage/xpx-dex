import mosaicMixins from './mosaic-mixin'
export default {
  mixins: [mosaicMixins],
  // data: () => {
  //   return {
  //     accountsInfo: null
  //   }
  // },
  // beforeMount () {
  //   this.accountsInfo = this.$store.getters['accountStore/accountsInfo']
  // },
  methods: {
    getAccountDefault (wallet = null) {
      const currentWallet = this.$store.getters['walletStore/currentWallet']
      if (wallet) {
        return wallet.accounts.find(x => x.default === true)
      } else if (currentWallet && currentWallet.accounts.length > 0) {
        return currentWallet.accounts.find(x => x.default === true)
      }
    },
    set_searchAccountsInfo (accounts) {
      this.searchAccountsInfo(accounts)
        .then(data => {
          const publicsAccounts = []
          // this.walletService.validateMultisigAccount(accounts);
          accounts.forEach(x => {
            publicsAccounts.push(
              this.$blockchainProvider.createPublicAccount(x.publicKey, x.network)
            )
          })

          data.accountsInfo.forEach(element => {
            if (element.accountInfo) {
              const exist = accounts.find(
                account => element.accountInfo.address.plain() === account.address
              )
              if (!exist) {
                if (!publicsAccounts.find(x => x.publicKey === element.accountInfo.publicKey)) {
                  publicsAccounts.push(
                    this.$blockchainProvider.createPublicAccount(
                      element.accountInfo.publicKey,
                      element.accountInfo.publicAccount.address.networkType
                    )
                  )
                }
              }
            }
          })
          this.updateBalance()
          if (data.mosaicsId && data.mosaicsId.length > 0) {
            console.log('mosaicde ', data.mosaicsId)
            this.searchInfoMosaics(data.mosaicsId)
          }
        })
        .catch(error => console.error(error))
    },
    setCurrentAccount (account) {
      this.$store.commit('accountStore/SET_CURRENT_ACCOUNT', account)
    },
    async searchAccountsInfo (accounts) {
      this.$store.dispatch('showLIW', {
        show: true,
        text: `Accounts info`,
        type: 'accountInfo'
      })
      let counter = 0
      const mosaicsIds = []
      const accountsInfo = []
      const promise = new Promise(async resolve => {
        accounts.forEach(element => {
          this.$blockchainProvider
            .getAccountInfo(element.simpleWallet.address['address'])
            .subscribe(
              async accountInfo => {
                if (accountInfo) {
                  accountInfo.mosaics
                    .map(n => n.id)
                    .forEach(id => {
                      const pushea = mosaicsIds.find(next => next.id.toHex() === id.toHex())
                      if (!pushea) {
                        mosaicsIds.push(id)
                      }
                    })
                  const accountInfoBuilded = {
                    name: element.name,
                    accountInfo,
                    multisigInfo: null
                  }
                  accountsInfo.push(accountInfoBuilded)
                  // const newAccounts = this.changeIsMultiSign(element.name, isMultisig);
                  // if (newAccounts.length > 0) {
                  //   // Issue changes to new accounts
                  //   this.setAccountsPushedSubject(newAccounts);
                  //   // Delete the change of the new accounts
                  //   this.setAccountsPushedSubject([]);
                  // }
                  this.setAccountsInfo([accountInfoBuilded], true)
                  counter = counter + 1
                  if (accounts.length === counter) {
                    resolve({
                      mosaicsId: mosaicsIds,
                      accountsInfo
                    })
                  }
                }
              },
              error => {
                const accountInfoBuilded = {
                  name: element.name,
                  accountInfo: null,
                  multisigInfo: null
                }
                accountsInfo.push(accountInfoBuilded)
                this.setAccountsInfo([accountInfoBuilded], true)
                counter = counter + 1
                if (accounts.length === counter) {
                  resolve({
                    mosaicsId: mosaicsIds,
                    accountsInfo
                  })
                }
                console.error(error)
              }
            )
        })
      })
      return promise
    },
    setAccountsInfo (accountsInfo, pushed = false) {
      const accountInfoGet = this.$store.getters['accountStore/accountsInfo']
      let accounts = accountInfoGet && accountInfoGet.length > 0 ? accountInfoGet.slice(0) : []
      let accountsInfoNext = null
      if (pushed) {
        for (const element of accountsInfo) {
          accounts = accounts.filter(x => x.name !== element.name)
          accounts.push(element)
        }
        accountsInfoNext = accounts
      } else {
        accountsInfoNext = accountsInfo
      }
      // this.$store.dispatch('accountStore/SET_INFO_ACCOUNT', accountsInfoNext)
      this.$store.commit('accountStore/SET_INFO_ACCOUNT', accountsInfoNext)
      this.$store.dispatch('showLIW', {
        show: false,
        text: `Accounts info`,
        type: null
      })
    },
    updateBalance () {
      const currentAccount = this.$store.getters['accountStore/currentAccount']
      const mosaicsId = this.$environment.mosaic.id
      const accountInfoGet = this.$store.getters['accountStore/accountsInfo']
      const dataBalance = accountInfoGet.find(next => next.name === currentAccount.name)
      let balance = 0.0
      if (dataBalance && dataBalance.accountInfo) {
        const x = dataBalance.accountInfo.mosaics.find(next => next.id.toHex() === mosaicsId)
        if (x) {
          balance = x.amount.compact()
        }
      }
      this.$store.commit('accountStore/SET_BALANCE_CURRENT_ACCOUNT', balance)
    }
  }
}
