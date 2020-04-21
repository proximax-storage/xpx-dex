import {
  asyncRouterMap
} from '@/router/route'

export const accountWalletStore = {
  // This makes your getters, mutations, and actions accessed by, eg: 'myModule/myModularizedNumber'
  // instead of mounting getters, mutations, and actions to the root namespace.
  namespaced: true,
  state: {
    allAccounts: [],
    nameKeyAccountsStorage: 'accounts'
  },
  getters: {
    allAccounts: (state) => (filterBy = '') => {
      return (filterBy !== '') ? state.allAccounts.filter(x => x.type === filterBy) : state.allAccounts
    },
    itemsMenu: state => state.itemsMenu
  },
  mutations: {
    SET_ACCOUNTS (state, accounts) {
      state.allAccounts = accounts
    },
    SET_ITEMS_MENU (state, itemsMenu) {
      state.itemsMenu = itemsMenu
    }
  },
  actions: {
    generateRoutes ({
      state,
      commit
    }) {
      const items = asyncRouterMap.filter(el => el.meta && el.meta.menu && el.meta.menu.showMenu)
      if (items) {
        const i = []
        for (const element of items) {
          i.push({
            path: element.path,
            ...element.meta.menu
          })
        }
        commit('SET_ITEMS_MENU', i)
      }

      return true
    }
  }
}
