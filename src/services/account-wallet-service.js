import Vue from 'vue'
import store from '@/store'
import {
  filterMosaics,
  searchInfoMosaics
} from '@/services/mosaics-service'
import {
  searchNamespacesFromAccounts
} from '@/services/namespace-service'
import * as CryptoJS from 'crypto-js'
/**
 *
 *
 * @param {*} accountInfo
 */
async function buildCurrentAccountInfo (accountInfo) {
  const mosaicsSelect = []
  if (accountInfo !== undefined && accountInfo !== null) {
    if (accountInfo.mosaics.length > 0) {
      const mosaics = await filterMosaics(accountInfo.mosaics.map(n => n.id))
      if (mosaics.length > 0) {
        for (const mosaic of mosaics) {
          const configInput = {
            prefix: '',
            thousands: ',',
            decimal: '.',
            precision: '0'
          }

          const currentMosaic = accountInfo.mosaics.find(element => {
            const mosaicId = Vue.prototype.$blockchainProvider.getMosaicId(mosaic.idMosaic).toHex()
            return element.id.toHex() === mosaicId
          })

          let amount = ''
          let expired = false
          let nameExpired = ''
          let balanceValidate = 0
          if ('mosaicInfo' in mosaic) {
            amount = Vue.prototype.$generalService.amountFormatter(
              currentMosaic.amount.compact(),
              mosaic.mosaicInfo.properties.divisibility
            )
            balanceValidate = currentMosaic.amount.compact()
            const durationMosaic = Vue.prototype.$blockchainProvider.getUint64([
              mosaic.mosaicInfo['properties']['duration']['lower'],
              mosaic.mosaicInfo['properties']['duration']['higher']
            ])

            configInput.precision = mosaic.mosaicInfo['properties']['divisibility']
            const createdBlock = Vue.prototype.$blockchainProvider.getUint64([
              mosaic.mosaicInfo.height.lower,
              mosaic.mosaicInfo.height.higher
            ])

            // console.log('createdBlock', createdBlock)
            if (durationMosaic.compact() > 0) {
              if (this.currentBlock >= durationMosaic.compact() + createdBlock.compact()) {
                expired = true
                nameExpired = ' - Expired'
              }
            }
          } else {
            balanceValidate = currentMosaic.amount.compact()
            amount = Vue.prototype.$generalService.amountFormatter(currentMosaic.amount.compact(), 6)
            nameExpired = ' - Expired'
            expired = true
          }
          const idMosaic = Vue.prototype.$blockchainProvider.getMosaicId(mosaic.idMosaic).id.toHex()
          const x = idMosaic !== store.getters.environment.mosaic.id
          if (x) {
            const mosaicId = Vue.prototype.$blockchainProvider.getMosaicId(mosaic.idMosaic).toHex()
            const nameMosaic = mosaic.mosaicNames.names.length > 0 ? mosaic.mosaicNames.names[0].name : mosaicId
            mosaicsSelect.push({
              text: `${nameMosaic}${nameExpired} > Balance: ${amount}`,
              nameMosaic: nameMosaic,
              mosaic: mosaic.idMosaic,
              mosaicIdHex: idMosaic,
              balance: amount,
              balanceValidate: balanceValidate,
              expired: false,
              selected: false,
              disabled: expired,
              config: configInput
            })
          }
        }
      }
    }
  }

  store.commit('accountStore/SET_BUILD_CURRENT_ACCOUNT_MOSAIC', mosaicsSelect)
}

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
 * @param {*} data
 * @returns
 */
function createWallet (data) {
  const existWallet = getWalletByName(data.walletName, data.network)
  if (existWallet === undefined || existWallet === null) {
    let walletCreated = null
    if (data.privateKey) {
      const prefixAndPvk = Vue.prototype.$blockchainProvider.getPrefixAndPrivateKey(data.privateKey)
      walletCreated = Vue.prototype.$blockchainProvider.createSimpleWalletFromPrivateKey(
        data.walletName,
        data.password,
        prefixAndPvk.pvk,
        data.network
      )
    } else {
      walletCreated = Vue.prototype.$blockchainProvider.createSimpleWallet(
        data.walletName,
        data.password,
        data.network
      )
    }
    const decrypted = decrypt(walletCreated, data.password)
    if (decrypted.privateKey) {
      const account = Vue.prototype.$blockchainProvider.getAccountFromPrivateKey(
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

      const wallets = getWallets()
      wallets.push(walletBuilded)
      const pseudonymApp = store.getters.pseudonymApp
      Vue.prototype.$browserStorage.set(`wallets-${pseudonymApp}`, JSON.stringify(wallets))
      store.commit('walletStore/SET_CURRENT_WALLET', walletBuilded)
      return {
        status: true,
        data: walletBuilded,
        pvk: decrypted.privateKey
      }
    }
    return {
      status: false,
      msg: 'Error to decrypt wallet'
    }
  }
  return {
    status: false,
    msg: 'Wallet name already exists, try another name'
  }
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

  const toDecrypt = {
    algo: 'pass:bip32',
    encrypted: account.encryptedPrivateKey.encryptedKey,
    iv: account.encryptedPrivateKey.iv
  }

  const decrypt = Vue.prototype.$blockchainProvider.decryptPrivateKey(common, toDecrypt)
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
 * @param {*} account
 */
function exportAccount (accountValue = null) {
  const account = {
    address: accountValue.simpleWallet.address.address,
    algo: 'pass:bip32',
    balance: null,
    brain: true,
    default: false,
    encrypted: accountValue.simpleWallet.encryptedPrivateKey.encryptedKey,
    firstAccount: false,
    isMultisign: null,
    iv: accountValue.simpleWallet.encryptedPrivateKey.iv,
    mosaics: null,
    name: accountValue.name,
    network: accountValue.simpleWallet.network,
    nis1Account: null,
    publicAccount: Vue.prototype.$blockchainProvider.createPublicAccount(accountValue.publicKey, accountValue.simpleWallet.network)

  }

  const acc = Object.assign({}, account)
  const accounts = []
  accounts.push(acc)
  const wallet = {
    name: `${store.getters['walletStore/nameCurrentWallet']}_${acc.name}`,
    accounts
  }
  wallet.accounts[0].name = 'Primary_Account'
  wallet.accounts[0].firstAccount = true
  wallet.accounts[0].default = true
  const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(wallet))
  const file = CryptoJS.enc.Base64.stringify(wordArray)
  // Word array to base64
  const now = Date.now()
  const date = new Date(now)
  const year = date.getFullYear()
  const month = ((date.getMonth() + 1) < 10) ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1
  const day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate()

  const blob = new Blob([file], { type: '' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url

  a.download = `${wallet.name}_${year}-${month}-${day}.wlt`
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
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
            store.commit('socketDbStore/EVENT_UNCHANGED', null)
            store.commit('socketDbStore/EVENT_INSERTED', null)
            store.commit('offersStore/SET_OFFER_ALL', [])
            store.dispatch('nodeStore/initNodes', connectionNodes)
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
      store.dispatch('mosaicStore/GET_ICON_MOSAICS', data.mosaicsId)
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
  buildCurrentAccountInfo,
  createWallet,
  decrypt,
  exportAccount,
  getAccountsInfo,
  getWallets,
  getWalletByName,
  logIn
}
