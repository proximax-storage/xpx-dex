export default {
  methods: {
    doCopy (itemName, text) {
      this.$copyText(text).then(
        e => {
          this.$store.dispatch('showMSG', {
            snackbar: true,
            text: `${itemName} copied`,
            color: 'success'
          })
        },
        e => {
          this.$store.dispatch('showMSG', {
            snackbar: true,
            text: `Can not copy`,
            color: 'error'
          })
        }
      )
    },
    getConfigForm () {
      return {
        amount: {
          label: 'Amount',
          icon: 'icon-amount-green-16h-proximax-sirius-wallet.svg',
          min: 3,
          max: 20,
          rules: {
            required: v => !!v || 'Amount is required',
            min: v => (v && v.length >= 3) || 'Amount must be less than 3 characters',
            max: v => (v && v.length <= 20) || 'Amount must be a maximum of 20 characters'
          }
        },
        durationOffer: {
          label: 'Duration (number of days)',
          icon: 'icon-amount-green-16h-proximax-sirius-wallet.svg',
          min: 1,
          max: 365,
          rules: {
            required: v => !!v || 'Duration is required',
            min: v => (v && v.length >= 1) || 'Duration must be less than 1 characters',
            max: v => (v && v.length <= 365) || 'Duration must be a maximum of 365 characters'
          }
        },
        bidPrice: {
          label: 'BID Price (XPX)',
          icon: 'icon-amount-green-16h-proximax-sirius-wallet.svg',
          min: 3,
          max: 20,
          rules: {
            required: v => !!v || 'Amount is required',
            min: v => (v && v.length >= 3) || 'Amount must be less than 3 characters',
            max: v => (v && v.length <= 20) || 'Amount must be a maximum of 20 characters'
          }
        },
        generalRules: {
          notAllowSpaces: v => (v || '').indexOf(' ') < 0 || 'No spaces are allowed'
        },
        accountName: {
          label: 'Account Name',
          icon: 'icon-wallet-name-green-16h-proximax-sirius-wallet.svg',
          min: 3,
          max: 30,
          rules: {
            required: v => !!v || 'Account Name is required',
            min: v => (v && v.length >= 3) || 'Account Name must be less than 3 characters',
            max: v => (v && v.length <= 30) || 'Account Name must be a maximum of 30 characters'
          }
        },
        password: {
          label: 'Password',
          icon: 'icon-password-green-16h-proximax-sirius-wallet.svg',
          min: 8,
          max: 30,
          show: false,
          showConfirm: false,
          rules: {
            required: value => !!value || 'Password is required',
            min: v => (v && v.length >= 8) || 'Password must be less than 8 characters',
            max: v => (v && v.length <= 30) || 'Password must be a maximum of 30 characters'
          }
        },
        privateKey: {
          label: 'Private Key',
          icon: 'icon-private-key-green-16h-proximax-sirius-wallet.svg',
          min: 64,
          max: 66,
          show: false,
          rules: {
            required: value => !!value || 'Private Key is required',
            min: v => (v && v.length >= 64) || 'Private Key must be less than 64 characters',
            max: v => (v && v.length <= 66) || 'Private Key must be a maximum of 66 characters',
            isHex: v =>
              this.$blockchainProvider.isValidPrivateKey(v) || 'Private key must be Hexadecimal'
          }
        },
        assets: {
          label: 'Assets',
          icon: 'icon-amount-green-16h-proximax-sirius-wallet.svg',
          min: 3,
          max: 64,
          rules: {
            required: v => !!v || 'Assets is required',
            min: v => (v && v.length >= 3) || 'Asset must be less than 3 characters',
            max: v => (v && v.length <= 64) || 'Asset must be a maximum of 64 characters'
          }
        },
        wallet: {
          label: 'Wallet',
          icon: 'icon-private-key-green-16h-proximax-sirius-wallet.svg',
          min: 3,
          max: 30,
          show: false,
          rules: {
            required: value => !!value || 'Wallet is required',
            min: v => (v && v.length >= 3) || 'Wallet must be less than 3 characters',
            max: v => (v && v.length <= 30) || 'Wallet must be a maximum of 30 characters'
          }
        }
      }
    },
    typeButtonsLogin () {
      return {
        login: {
          key: 'login',
          action: 'login',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',

          loading: false,
          text: 'Log In'
        },
        letsgo: {
          key: 'letgo',
          action: 'letgo',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: `Let's Go`
        }
      }
    },
    typeButtons () {
      return {
        print: {
          key: 'print',
          action: 'print',
          disabled: false,
          color: 'white',
          textColor: 'primary--text',
          loading: false,
          text: 'Print'
        },
        viewOnExplorer: {
          key: 'viewOnExplorer',
          action: 'viewOnExplorer',
          disabled: false,
          color: 'leve',
          textColor: 'white--text',
          loading: false,
          text: 'view on explorer'
        },
        cancel: {
          key: 'cancel',
          action: 'cancel',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Cancel'
        },
        buy: {
          key: 'buy',
          action: 'buy',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Buy'
        },
        lookForOffers: {
          key: 'lookForOffers',
          action: 'lookOffers',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Look for offers'
        },
        lookAgain: {
          key: 'lookAgain',
          action: 'lookAgain',
          disabled: false,
          color: 'leve',
          textColor: 'primary--text',
          loading: false,
          text: 'Look Again'
        },
        clear: {
          key: 'clear',
          action: 'clear',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Clear'
        },
        create: {
          key: 'create',
          action: 'create',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Create'
        },
        ownOffer: {
          key: 'ownoffer',
          action: 'ownoffer',
          disabled: false,
          color: 'primary',
          textColor: 'white--text',
          loading: false,
          text: 'Pleace your own offer'
        },
        viewAllassets: {
          key: 'ownoffer',
          action: 'ownoffer',
          disabled: false,
          color: 'leve',
          textColor: 'primary--text',
          loading: false,
          text: 'view All'
        }
      }
    },
    getArrayTitle () {
      return [
        {
          title: 'Sports',
          class: 'leve--text'
        },
        {
          title: 'Bet',
          class: 'primary--text'
        }
      ]
    },
    getConfigMoney (value = null) {
      const money = {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 6,
        masked: false
      }
      return value || money
    },
    validateZero (value = []) {
      let valueR = true
      for (let index = 0; index < value.length; index++) {
        const item = value[index]
        let amount = null
        try {
          amount = parseFloat(item.split(',').join(''))
        } catch (error) {
          amount = Number(item)
        }
        if (amount === 0) {
          valueR = false
          break
        }
      }
      return valueR
    }
  }
}
