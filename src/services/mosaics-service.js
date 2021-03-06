import Vue from 'vue'
import store from '@/store'
import { MosaicNonce } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNonce'

function buildModifyMetadataTransactionMosaic (mosaicId, modifications) {
  let dataRequired = []
  const action = 'metadataMosaicTx'
  const transaction = Vue.prototype.$blockchainProvider.modifyMetadataTransactionMosaic(mosaicId, modifications)
  return {
    transaction,
    dataRequired,
    action
  }
}

/**
 *
 * @param {*} ownerPublicKey
 * @param {*} duration
 * @param {*} divisibility
 * @param {*} isSupplyMutable
 * @param {*} isTransferable
 */
function buildMosaicDefinitionTransaction (ownerPublicKey, randomNonce, duration, divisibility, isSupplyMutable, isTransferable) {
  let dataRequired = []
  const action = 'mosaicDefinitionTx'
  const transaction = Vue.prototype.$blockchainProvider.mosaicDefinitionTransaction(ownerPublicKey, randomNonce, duration, divisibility, isSupplyMutable, isTransferable)
  return {
    transaction,
    dataRequired,
    action
  }
}
/**
 *
 * @param {*} mosaicId
 * @param {*} mosaicSupplyType
 * @param {*} delta
 */
function buildMosaicSupplyChangeTransaction (mosaicId, mosaicSupplyType, delta) {
  let dataRequired = []
  const action = 'mosaicSupplyChangeTx'
  const transaction = Vue.prototype.$blockchainProvider.mosaicSupplyChangeTransaction(mosaicId, mosaicSupplyType, delta)
  return {
    transaction,
    dataRequired,
    action
  }
}
/**
 *
 * @param {*} aliasActionType
 * @param {*} namespaceId
 * @param {*} mosaicId
 */
function buildMosaicAliasTransaction (aliasActionType, namespaceId, mosaicId) {
  let dataRequired = []
  const action = 'mosaicAliasTx'
  const transaction = Vue.prototype.$blockchainProvider.mosaicAliasTransaction(aliasActionType, namespaceId, mosaicId)
  return {
    transaction,
    dataRequired,
    action
  }
}

/**
 *
 *
 * @param {*} [mosaicsId=null]
 * @param {string} [byAccount='']
 * @returns
 */
async function filterMosaics (mosaicsId = null) {
  if (mosaicsId) {
    let mosaicsFromStore = store.getters['mosaicStore/mosaics']
    if (mosaicsFromStore.length > 0) {
      const dataReturn = []
      const toSearch = []
      for (let element of mosaicsId) {
        const existMosaic = mosaicsFromStore.find(
          x => Vue.prototype.$blockchainProvider.getMosaicId(x.idMosaic).toHex() === element.toHex()
        )

        if (existMosaic) {
          dataReturn.push(existMosaic)
        } else {
          const existMosaic = mosaicsFromStore.find(x =>
            x.isNamespace
              ? Vue.prototype.$blockchainProvider.getMosaicId(x.isNamespace).toHex() === element.toHex()
              : undefined
          )
          if (existMosaic) {
            dataReturn.push(existMosaic)
          } else {
            toSearch.push(element)
          }
        }
      }
      if (toSearch.length > 0) {
        const mosaicsSearched = await searchInfoMosaics(toSearch)
        if (mosaicsSearched && mosaicsSearched.length > 0) {
          mosaicsSearched.forEach(element => {
            dataReturn.push(element)
          })
        }
      }
      return filterMosaicToReturn(dataReturn)
    } else {
      const infoMosaics = await searchInfoMosaics(mosaicsId)
      return filterMosaicToReturn(infoMosaics)
    }
  }
}

/**
 *
 *
 * @param {*} infoMosaics
 * @returns
 */
function filterMosaicToReturn (infoMosaics) {
  const returned = []
  if (infoMosaics && infoMosaics.length > 0) {
    infoMosaics.forEach(element => {
      if (returned.length > 0) {
        const existByNamespace = returned.find(x =>
          x.isNamespace && element.isNamespace ? Vue.prototype.$blockchainProvider.getMosaicId(x.isNamespace).toHex() ===
            Vue.prototype.$blockchainProvider.getMosaicId(element.isNamespace).toHex() : undefined
        )

        // search by mosaic
        if (!existByNamespace) {
          const existByMosaic = returned.find(x =>
            Vue.prototype.$blockchainProvider.getMosaicId(x.idMosaic).toHex() ===
            Vue.prototype.$blockchainProvider.getMosaicId(element.idMosaic).toHex()
          )

          if (!existByMosaic) {
            returned.push(element)
          }
        }
      } else {
        returned.push(element)
      }
    })
  }
  return returned
}
/**
 *
 * @param {*} publicKey
 */
function mosaicNonceFromPublicKey (publicKey) {
  let mosaicNonce = {
    randomNonce: null,
    mosaicId: null
  }
  mosaicNonce.randomNonce = MosaicNonce.createRandom()
  mosaicNonce.mosaicId = Vue.prototype.$blockchainProvider.mosaicNonceFromPublicKey(publicKey,
    mosaicNonce.randomNonce
  )
  return mosaicNonce
}

/**
 *
 *
 * @param {*} mosaicsId
 * @param {boolean} [mosaicsInfOffer=false]
 * @returns
 */
async function searchInfoMosaics (mosaicsId, mosaicsInfOffer = false) {
  const type = !mosaicsInfOffer ? 'mosaicsInfo' : 'mosaicsInfOffer'
  store.dispatch('showLIW', {
    show: true,
    text: `Mosaics info`,
    type: type
  })
  try {
    const mosaicsTosaved = []
    if (mosaicsId.length > 0) {
      const findMosaicsByNamespace = []
      // le paso todos los mosaicsIds a la consulta
      const mosaicsFound = await Vue.prototype.$blockchainProvider.getMosaics(mosaicsId).toPromise()
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
        const otherMosaics = await searchMosaicFromNamespace(findMosaicsByNamespace)
        otherMosaics.forEach(element => {
          mosaicsTosaved.push(element)
        })
      }
      if (mosaicsFound.length > 0) {
        const mosaicsName = await Vue.prototype.$blockchainProvider.getMosaicsName(mosaicsId).toPromise()
        mosaicsFound.forEach(infoMosaic => {
          try {
            const existMosaicName = mosaicsName
              ? mosaicsName.find(x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex())
              : null
            mosaicsTosaved.push({
              idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
              isNamespace: existMosaicName && existMosaicName.names && existMosaicName.names.length > 0 ? [
                existMosaicName.names[0].namespaceId.id.lower,
                existMosaicName.names[0].namespaceId.id.higher
              ] : null,
              mosaicNames: existMosaicName,
              mosaicInfo: infoMosaic
            })
          } catch (error) {
            // console.log('Has ocurred a error with search mosaics', error);
          }
        })
      }
      if (!mosaicsInfOffer) saveMosaicStorage(mosaicsTosaved)
      return mosaicsTosaved
    }
  } catch {
    return null
  }
}
/**
 *
 *
 * @param {*} findMosaicsByNamespace
 * @returns
 */
async function searchMosaicFromNamespace (findMosaicsByNamespace) {
  const mosaicsTosaved = []
  if (findMosaicsByNamespace.length > 0) {
    const searchMosaicById = []
    const savedLinked = []
    // recorro todos los mosaics id o namespaces id
    for (const id of findMosaicsByNamespace) {
      // convierto ese mosaico id a nemespace id
      const namespaceId = Vue.prototype.$blockchainProvider.getNamespaceId([id.id.lower, id.id.higher])
      // consulta si ese namespaceId esta linkeado a un mosaicId y retorna el mosaico Id
      const mosaicIdLinked = await Vue.prototype.$blockchainProvider.getLinkedMosaicId(namespaceId).toPromise()
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
      const otherMosaicsFound = await this.proximaxProvider.getMosaics(searchMosaicById).toPromise()
      const mosaicsName = await Vue.prototype.$blockchainProvider.getMosaicsName(savedLinked.map(x => x.mosaicId))
      // console.log('---mosaicsName---', mosaicsName);
      otherMosaicsFound.forEach(infoMosaic => {
        const dataFiltered = savedLinked.find(
          x => x.mosaicId.toHex() === infoMosaic.mosaicId.toHex()
        )
        const mosaicIdFiltered = dataFiltered ? [dataFiltered.namespaceId.id.lower, dataFiltered.namespaceId.id.higher]
          : null
        if (mosaicIdFiltered) {
          mosaicsTosaved.push({
            idMosaic: [infoMosaic.mosaicId.id.lower, infoMosaic.mosaicId.id.higher],
            isNamespace: mosaicIdFiltered,
            mosaicNames: mosaicsName ? mosaicsName.find(x => x.mosaicId.toHex() === dataFiltered.mosaicId.toHex()) : null,
            mosaicInfo: infoMosaic
          })
        }
      })
    }
  }

  return mosaicsTosaved
}
/**
 *
 *
 * @param {*} mosaicsTosaved
 */
async function saveMosaicStorage (mosaicsTosaved) {
  if (mosaicsTosaved) {
    // let mosaicsStorage this.getMosaicsFromStorage();
    let mosaicsStorage = store.getters['mosaicStore/mosaics']
    for (const element of mosaicsTosaved) {
      if (mosaicsStorage.length > 0) {
        const mosaicIdToSaved = Vue.prototype.$blockchainProvider.getMosaicId(element.idMosaic).toHex()
        const elementStorage = mosaicsStorage.find(x => Vue.prototype.$blockchainProvider.getMosaicId(x.idMosaic).toHex() === mosaicIdToSaved)
        if (elementStorage) {
          // Verifica si en cache tiene namespaceId y si en el nuevo no trajo namespaceId
          if (elementStorage.isNamespace && !element.isNamespace) {
            // Si en cache tiene namespace, verifica si todavía está linkeado a ese namespace
            try {
              const namespaceId = Vue.prototype.$blockchainProvider.getNamespaceId(elementStorage.isNamespace)
              const mosaicIdLinked = await Vue.prototype.$blockchainProvider.getLinkedMosaicId(namespaceId).toPromise()
              if (mosaicIdLinked && mosaicIdLinked.toHex() === mosaicIdToSaved) {
                element.isNamespace = elementStorage.isNamespace
              }
            } catch (error) { }
          }
        }
        // reemplazo la información del mosaico
        mosaicsStorage = mosaicsStorage.filter(x => Vue.prototype.$blockchainProvider.getMosaicId(x.idMosaic).toHex() !== mosaicIdToSaved)
      }
      mosaicsStorage.push(element)
    }
    store.dispatch('showLIW', {
      show: false,
      text: `Mosaics info`,
      type: null
    })
    store.commit('mosaicStore/SET_MOSAICS', mosaicsStorage)
  }
}
/**
 * Done
 * @param {*} duration
 */
function getCalRentalFeeMosaic (duration = 365) {
  // return store.getters.environment.rentalFee.mosaic * Vue.prototype.$generalService.calculateDurationforDay(duration)
  return store.getters.environment.rentalFee.mosaic
}

export {
  buildMosaicDefinitionTransaction,
  buildMosaicSupplyChangeTransaction,
  buildMosaicAliasTransaction,
  buildModifyMetadataTransactionMosaic,
  mosaicNonceFromPublicKey,
  filterMosaics,
  searchInfoMosaics,
  getCalRentalFeeMosaic
}
