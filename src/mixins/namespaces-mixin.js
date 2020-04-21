export default {
  methods: {
    // async searchNamespacesFromAccounts (accounts) {
    //   const allNamespaces = []
    //   for (const account of accounts) {
    //     const address = this.$blockchainProvider.createFromRawAddress(
    //       account.simpleWallet.address['address']
    //     )
    //     try {
    //       // Gets array of NamespaceInfo for an account
    //       const namespaceInfo = await this.$blockchainProvider
    //         .getNamespaceFromAccount(address)
    //         .toPromise()
    //       if (namespaceInfo && namespaceInfo.length > 0) {
    //         namespaceInfo.forEach(element => {
    //           allNamespaces.push(element)
    //         })
    //       }
    //     } catch (error) {
    //       console.error('----Search namespaces from accoun ts error----', error)
    //     }
    //     this.saveNamespace(allNamespaces)
    //   }
    // },
    // async saveNamespace (namespaceInfo) {
    //   // const namespacesStorage = this.getNamespacesStorage()
    //   const namespacesStorage = []
    //   const names = await this.$blockchainProvider
    //     .getNamespacesName(namespaceInfo.map(x => x.id))
    //     .toPromise()

    //   const namespacesFound = []
    //   for (const info of namespaceInfo) {
    //     namespacesFound.push({
    //       id: [info.id.id.lower, info.id.id.higher],
    //       idToHex: info.id.toHex(),
    //       namespaceName: names.find(name => name.namespaceId.toHex() === info.id.toHex()),
    //       namespaceInfo: info
    //     })
    //   }
    //   const namespaceToSaved = namespacesFound.slice(0)
    //   if (namespacesStorage.length > 0 && namespaceToSaved.length > 0) {
    //     for (const namespacesSaved of namespacesStorage) {
    //       const existNamespace = namespaceToSaved.find(b => b.idToHex === namespacesSaved.idToHex)
    //       // console.log('----existe?----', existNamespace);
    //       if (!existNamespace) {
    //         namespaceToSaved.push(namespacesSaved)
    //       }
    //     }
    //   }
    //   this.$store.commit('namespaceStore/SET_NAMESPACES', namespaceToSaved)
    // //   console.log('popopopop', this.$store.getters['namespaceStore/namespacesFromAccount'](adddee))
    //   //   console.log('namespaceToSaved', namespaceToSaved)
    // }
  }
}
