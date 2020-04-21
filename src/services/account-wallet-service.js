import Vue from 'vue'
import store from '@/store'
import {
  searchInfoMosaics
} from '@/services/mosaics-service'
import {
  searchNamespacesFromAccounts
} from '@/services/namespace-service'

/**
 *
 *
 * @param {*} accounts
 * @returns
 */
async function searchAccountsInfo (accounts) {
  store.dispatch('showLIW', {
    show: true,
    text: `Accounts info`,
    type: 'accountInfo'
  })

  let counter = 0
  const mosaicsIds = []
  const accountsInfo = []
  const promise = new Promise(async resolve => {
    accounts.forEach(element => {
      console.log('element', element)
      const address = Vue.prototype.$blockchainProvider.createRawAddress(element.simpleWallet.address['address'])
      Vue.prototype.$blockchainProvider.getAccountInfo(address).subscribe(
        async accountInfo => {
          if (accountInfo) {
            accountInfo.mosaics.map(n => n.id).forEach(id => {
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
            setAccountsInfo([accountInfoBuilded], true)
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
          console.error(error)
          const accountInfoBuilded = {
            name: element.name,
            accountInfo: null,
            multisigInfo: null
          }
          accountsInfo.push(accountInfoBuilded)
          setAccountsInfo([accountInfoBuilded], true)
          counter = counter + 1
          if (accounts.length === counter) {
            resolve({
              mosaicsId: mosaicsIds,
              accountsInfo
            })
          }
        }
      )
    })
  })
  return promise
}
/**
 *
 *
 * @param {*} account
 * @param {*} password
 * @returns
 */
function decrypt (account, password) {
  const common = {
    password: password
  }

  console.log('common', common)
  const toDecrypt = {
    algo: 'pass:bip32',
    encrypted: account.encryptedPrivateKey.encryptedKey,
    iv: account.encryptedPrivateKey.iv
  }

  const decrypt = Vue.prototype.$blockchainProvider.decryptPrivateKey(common, toDecrypt)
  console.log('decrypt', decrypt)
  if (decrypt && decrypt.status) {
    return common
  }

  store.dispatch('showMSG', {
    snackbar: true,
    text: decrypt.msg,
    color: 'error'
  })

  return decrypt.status
}

/**
 *
 *
 * @param {*} [wallet=null]
 * @returns
 */
function filterAccountDefault (wallet = null) {
  if (wallet) {
    return wallet.accounts.find(x => x.default === true)
  } else {
    const currentWallet = store.getters['walletStore/currentWallet']
    if (currentWallet && currentWallet.accounts.length > 0) {
      return currentWallet.accounts.find(x => x.default === true)
    }

    return null
  }
}

/**
 *
 *
 * @param {*} name
 * @returns
 */
function getWalletByName (name) {
  const wallets = getWallets()
  if (wallets && wallets.length > 0) {
    return wallets.find(x => x.username === name)
  }
  return null
}
/**
 *
 *
 * @returns
 */
function getWallets () {
  const pseudonymApp = store.getters.pseudonymApp
  if (pseudonymApp !== '') {
    const wallets = Vue.prototype.$browserStorage.get(`wallets-${pseudonymApp}`)
    if (!wallets) {
      Vue.prototype.$browserStorage.set(`wallets-${pseudonymApp}`, [])
      return []
    }

    return JSON.parse(wallets)
  }

  return []
}
/**
 *
 *
 * @param {*} wallet
 * @param {*} password
 * @returns
 */
function logIn (wallet, password) {
  var msg = 'Dear user, the wallet is missing'
  if (wallet) {
    const currentAccount = Object.assign({}, wallet.accounts.find(elm => elm.firstAccount === true))
    if (currentAccount) {
      if (decrypt(currentAccount.simpleWallet, password)) {
        const connectionNodes = store.getters.environment.connectionNodes
        const network = Vue.prototype.$blockchainProvider.filterNetworkTypeFromString(connectionNodes.networkType)
        if (!wallet.accounts.find(element => element.simpleWallet.network !== network)) {
          const defaultAccount = filterAccountDefault(wallet)
          if (defaultAccount) {
            store.commit('walletStore/SET_CURRENT_WALLET', wallet)
            store.commit('accountStore/SET_CURRENT_ACCOUNT', defaultAccount)
            store.commit('mosaicStore/SET_MOSAICS', [])
            console.log('HERE SEARCH INFO NAMESPACE WITH REFACTOR')
            // this.searchNamespacesFromAccounts(wallet.accounts)
            store.dispatch('nodeStore/initNodes', connectionNodes)
            // getAccountsInfo(wallet.accounts)
            return true
          }
        } else {
          msg = 'Account not allowed for this network'
        }
      } else {
        msg = 'Invalid password'
      }
    } else {
      msg = 'You can not set anything like the current wallet'
    }
  }

  store.dispatch('showMSG', {
    snackbar: true,
    text: msg,
    color: 'error'
  })
  return false
  // this.$store.commit('mosaicStore/SET_MOSAICS', [])
  // this.closeConection()
  // this.connectnWs()
  // this.searchNamespacesFromAccounts(wallet.accounts)
  // this.set_searchAccountsInfo(wallet.accounts)
  // return true
}

/**
 *
 *
 * @param {*} accounts
 */
function getAccountsInfo (accounts) {
  searchNamespacesFromAccounts(accounts)
  searchAccountsInfo(accounts).then(data => {
    updateBalance()
    if (data.mosaicsId && data.mosaicsId.length > 0) {
      console.log('HERE SEARCH INFO MOSAIC WITH REFACTOR')
      searchInfoMosaics(data.mosaicsId)
    }
  }).catch(error => console.error(error))
}

/**
 *
 *
 * @param {*} accountsInfo
 * @param {boolean} [pushed=false]
 */
function setAccountsInfo (accountsInfo, pushed = false) {
  const accountInfoGet = store.getters['accountStore/accountsInfo']
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

  store.commit('accountStore/SET_INFO_ACCOUNT', accountsInfoNext)
  store.dispatch('showLIW', {
    show: false,
    text: `Accounts info`,
    type: null
  })
}

/**
 *
 *
 */
function updateBalance () {
  const currentAccount = store.getters['accountStore/currentAccount']
  const accountInfoGet = store.getters['accountStore/accountsInfo']
  const dataBalance = accountInfoGet.find(next => next.name === currentAccount.name)
  let balance = 0.0
  if (dataBalance && dataBalance.accountInfo) {
    const mosaicsId = store.getters.environment.mosaic.id
    const x = dataBalance.accountInfo.mosaics.find(next => next.id.toHex() === mosaicsId)
    if (x) {
      balance = x.amount.compact()
    }
  }
  store.commit('accountStore/SET_BALANCE_CURRENT_ACCOUNT', balance)
}

export {
  getAccountsInfo,
  getWallets,
  getWalletByName,
  logIn
}
