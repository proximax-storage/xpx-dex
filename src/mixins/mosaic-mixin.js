import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('socketDbStore', ['newOffersTx'])
  },
  methods: {
    async searchInfoMosaics (mosaicsId, mosaicsInfOffer = false) {
      const type = !mosaicsInfOffer ? 'mosaicsInfo' : 'mosaicsInfOffer'
      this.$store.dispatch('showLIW', {
        show: true,
        text: `Mosaics info`,
        type: type
      })
      try {
        const mosaicsTosaved = []
        if (mosaicsId.length > 0) {
          const findMosaicsByNamespace = []
          // le paso todos los mosaicsIds a la consulta
          const mosaicsFound = await this.$blockchainProvider.getMosaics(mosaicsId).toPromise()
          // Recorro los mosaics Ids
          mosaicsId.forEach(element => {
            // Filtra si el mosaico id fue encontrado
            const existMosaic = mosaicsFound.find(x => x.mosaicId.id.toHex() === element.id.toHex())
            if (!existMosaic) {
              // Si no fue encontrado, busca mosaicos por namespace
              findMosaicsByNamespace.push(element)
            }
          })
          if (findMosaicsByNamespace.length > 0) {
            // busca los namespaceId de los mosaicos que no fueron encontrados
            const otherMosaics = await this.searchMosaicFromNamespace(findMosaicsByNamespace)
            otherMosaics.forEach(element => {
              mosaicsTosaved.push(element)
            })
          }
          if (mosaicsFound.length > 0) {
            const mosaicsName = await this.$blockchainProvider.getMosaicsName(mosaicsId)
            mosaicsFound.forEach(infoMosaic => {
              try {
                const existMosaicName = mosaicsName
                  ? mosaicsName.find(x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex())
                  : null
                mosaicsTosaved.push({
                  idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
                  isNamespace:
                    existMosaicName && existMosaicName.names && existMosaicName.names.length > 0
                      ? [
                        existMosaicName.names[0].namespaceId.id.lower,
                        existMosaicName.names[0].namespaceId.id.higher
                      ]
                      : null,
                  mosaicNames: existMosaicName,
                  mosaicInfo: infoMosaic
                })
              } catch (error) {
                // console.log('Has ocurred a error with search mosaics', error);
              }
            })
          }
          if (!mosaicsInfOffer) this.saveMosaicStorage(mosaicsTosaved)
          return mosaicsTosaved
        }
      } catch (error) {
        console.error('Has ocurred a error with search mosaics', error)
        return null
      }
    },
    async searchMosaicFromNamespace (findMosaicsByNamespace) {
      const mosaicsTosaved = []
      if (findMosaicsByNamespace.length > 0) {
        const searchMosaicById = []
        const savedLinked = []
        // recorro todos los mosaics id o namespaces id
        for (const id of findMosaicsByNamespace) {
          // convierto ese mosaico id a nemespace id
          const namespaceId = this.$blockchainProvider.getNamespaceId([id.id.lower, id.id.higher])
          // consulta si ese namespaceId esta linkeado a un mosaicId y retorna el mosaico Id
          const mosaicIdLinked = await this.$blockchainProvider
            .getLinkedMosaicId(namespaceId)
            .toPromise()
          // si esta linkeado...
          if (mosaicIdLinked) {
            // almacena que ese mosaic id esta linkeado a un namespace
            savedLinked.push({
              mosaicId: mosaicIdLinked,
              namespaceId
            })
            // Busca los mosaics ids encontrados (linkeados)
            searchMosaicById.push(mosaicIdLinked)
          }
        }

        if (searchMosaicById.length > 0) {
          const otherMosaicsFound = await this.proximaxProvider
            .getMosaics(searchMosaicById)
            .toPromise()
          const mosaicsName = await this.$blockchainProvider.getMosaicsName(
            savedLinked.map(x => x.mosaicId)
          )
          // console.log('---mosaicsName---', mosaicsName);
          otherMosaicsFound.forEach(infoMosaic => {
            const dataFiltered = savedLinked.find(
              x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex()
            )
            const mosaicIdFiltered = dataFiltered
              ? [dataFiltered.namespaceId.id.lower, dataFiltered.namespaceId.id.higher]
              : null
            if (mosaicIdFiltered) {
              mosaicsTosaved.push({
                idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
                isNamespace: mosaicIdFiltered,
                mosaicNames: mosaicsName
                  ? mosaicsName.find(x => x.mosaicId.toHex() === dataFiltered.mosaicId.toHex())
                  : null,
                mosaicInfo: infoMosaic
              })
            }
          })
        }
      }

      return mosaicsTosaved
    },
    async saveMosaicStorage (mosaicsTosaved) {
      if (mosaicsTosaved) {
        // let mosaicsStorage this.getMosaicsFromStorage();
        let mosaicsStorage = this.$store.getters['mosaicStore/mosaics']
        for (const element of mosaicsTosaved) {
          if (mosaicsStorage.length > 0) {
            const mosaicIdToSaved = this.$blockchainProvider.getMosaicId(element.idMosaic).toHex()
            const elementStorage = mosaicsStorage.find(
              x => this.$blockchainProvider.getMosaicId(x.idMosaic).toHex() === mosaicIdToSaved
            )
            if (elementStorage) {
              // Verifica si en cache tiene namespaceId y si en el nuevo no trajo namespaceId
              if (elementStorage.isNamespace && !element.isNamespace) {
                // Si en cache tiene namespace, verifica si todavía está linkeado a ese namespace
                try {
                  const mosaicIdLinked = await this.$blockchainProvider
                    .getLinkedMosaicId(
                      this.proximaxProvider.getNamespaceId(elementStorage.isNamespace)
                    )
                    .toPromise()
                  if (mosaicIdLinked && mosaicIdLinked.toHex() === mosaicIdToSaved) {
                    element.isNamespace = elementStorage.isNamespace
                  }
                } catch (error) {}
              }
            }
            // reemplazo la información del mosaico
            mosaicsStorage = mosaicsStorage.filter(
              x => this.$blockchainProvider.getMosaicId(x.idMosaic).toHex() !== mosaicIdToSaved
            )
          }
          mosaicsStorage.push(element)
        }
        this.$store.dispatch('showLIW', {
          show: false,
          text: `Mosaics info`,
          type: null
        })
        this.$store.commit('mosaicStore/SET_MOSAICS', mosaicsStorage)
        // localStorage.setItem(this.getItemMosaicStorage(), JSON.stringify(mosaicsStorage));
        // this.setMosaicChanged();
      }
    }
  }
}
