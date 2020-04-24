import store from '@/store'
import Vue from 'vue'

import {
  Listener
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/Listener'

var connector
var timeOut
var cacheBlock = 1
var checking = false
var nodesConfig = null
var messages = {
  'aggregateBondedAdded': 'Transaction Aggregate Bonded Added',
  'aggregateBondedRemoved': 'Transaction Aggregate Bonded Removed',
  'cosignatureAdded': 'Cosignature Added',
  'confirmed': 'Transaction confirmed',
  'unconfirmed': 'Transaction unconfirmed',
  'unconfirmedRemoved': 'Transaction unconfirmed removed'
}

/**
 *
 *
 * @param {*} node
 * @param {*} protocol
 * @param {*} addressArray
 */
function webSocketConnection (node, protocol) {
  try {
    nodesConfig = Vue.prototype.$modulesConfig.nodes
    reconnect(false)
    store.commit('nodeStore/SET_STATUS_NODE', 2)
    setTimeout(() => {
      const url = buildUrl(node, protocol)
      connector = new Listener(url, WebSocket)
      openConnection()
    }, 10)
  } catch (error) {
    showMsgAndChangeStatus('Error connecting to the node', 'errorIntense', 0)
  }
}

/**
 *
 *
 * @param {*} node
 * @param {*} protocol
 * @returns
 * @memberof WebsocketConnection
 */
function buildUrl (node, protocol) {
  switch (protocol) {
    case 'ws':
      return `${protocol}://${node}:3000`
    case 'wss':
      return `${protocol}://${node}:443`
  }
}

/**
 *
 *
 */
function checkIsOpenConnection () {
  return connector && connector.isOpen
}

/**
 *
 *
 */
function checkNodeIsLive (height) {
  clearTimeOutTime()
  timeOut = setTimeout(function () {
    closeConnection()
    showMsgAndChangeStatus('The connection node is stuck', 'errorIntense', 0)
  }, Number(nodesConfig.timeOutNewBlocks) * 1000)

  if (connector && !checking) {
    checking = true
    setTimeout(() => {
      checking = false
      if (cacheBlock > 1 && height > cacheBlock + 4) {
        clearTimeOutTime()
        closeConnection()
        showMsgAndChangeStatus('The node is synchronizing', 'errorIntense', 0)
      } else {
        cacheBlock = height
      }
    }, nodesConfig.timeValidateSynchronization)
  }
}

/**
 *
 *
 * @memberof WebsocketConnection
 */
function closeConnection () {
  if (connector) {
    connector.close()
    connector.terminate()
    clearTimeOutTime()
    console.log('connection closed!')
  }
}

/**
 *
 * @memberof WebsocketConnection
 */
function clearTimeOutTime () {
  if (timeOut) {
    clearTimeout(timeOut)
    timeOut = null
  }
}

/**
 *
 *
 * @memberof WebsocketConnection
 */
function getBlocks () {
  connector.newBlock().subscribe(block => {
    // console.log('----NEW BLOCK -----', block.height.compact())
    checkNodeIsLive(block.height.compact())
    store.commit('nodeStore/SET_CURRENT_BLOCK', block.height.compact())
  }, () => {
    showMsgAndChangeStatus('Error connecting to the node', 'errorIntense', 0)
  })
}

/**
 *
 *
 * @param {*} address
 */
function getAggregateBondedAdded (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      connector.aggregateBondedAdded(address).subscribe(transaction => {
        showMsgAndChangeStatus(messages.aggregateBondedAdded, 'success')
        console.log('--------------------AGGREGATE_BONDED_ADDED------------------------')
        console.log(transaction.transactionInfo.hash)
        console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/SET_AGGREGATE_BONDED_ADDED', transaction)
      })
    })
  }
}

/**
 *
 *
 * @param {*} arrayAddress
 */
function getAggregateBondedRemoved (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      connector.aggregateBondedRemoved(address).subscribe(transaction => {
        showMsgAndChangeStatus(messages.aggregateBondedRemoved, 'success')
        console.log('-----------------------AGGREGATE_BONDED_REMOVED--------------------------')
        console.log(transaction.transactionInfo.hash)
        console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/SET_AGGREGATE_BONDED_REMOVED', transaction)
      })
    })
  }
}

/**
 *
 *
 * @param {*} arrayAddress
 */
function getCosignatureAdded (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      connector.cosignatureAdded(address).subscribe(transaction => {
        showMsgAndChangeStatus(messages.cosignatureAdded, 'success')
        // console.log('-----------------------COSIGNATURE_ADDED--------------------------')
        // console.log(transaction.transactionInfo.hash)
        // console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/SET_COSIGNATURE_ADDED', transaction)
      })
    })
  }
}

/**
 *
 *
 * @param {*} address
 */
function getConfirmed (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      connector.confirmed(address).subscribe(transaction => {
        showMsgAndChangeStatus(messages.confirmed, 'success')
        // console.log(' -----------------------CONFIRMED---------------------------------')
        // console.log(transaction.transactionInfo.hash)
        // console.log('------------------------------------------------------------------ \n\n')
        store.commit('transactionsStore/SET_CONFIRMED', transaction)
      })
    })
  }
}

/**
 *
 *
 * @param {*} arrayAddress
 */
function getUnconfirmedAdded (arrayAddress) {
  if (checkIsOpenConnection()) {
    arrayAddress.forEach(address => {
      connector.unconfirmedAdded(address).subscribe(transaction => {
        showMsgAndChangeStatus(messages.unconfirmed, 'success')
        // console.log('-----------------------UNCONFIRMED_ADDED--------------------------')
        // console.log(transaction.transactionInfo.hash)
        // console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/SET_UNCONFIRMED_ADDED', transaction)
      })
    })
  }
}

/**
 *
 *
 * @param {*} arrayAddress
 */
function getUnconfirmedRemoved (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      connector.unconfirmedRemoved(address).subscribe(hash => {
        // showMsgAndChangeStatus(messages.unconfirmedRemoved, 'success')
        // console.log('-----------------------UNCONFIRMED_REMOVED--------------------------')
        // console.log(hash)
        // console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/REMOVE_UNCONFIRMED_ADDED_TX', hash)
      })
    })
  }
}

/**
 *
 *
 * @param {*} arrayAddress
 */
function getStatus (arrayAddress) {
  if (checkIsOpenConnection()) {
    // console.log('MONITOR ACCOUNTS --->', arrayAddress)
    arrayAddress.forEach(address => {
      // console.log('MONITOR STATUS', address)
      connector.status(address).subscribe(transaction => {
        showMsgAndChangeStatus(transaction.status.split('_').join(' '), 'errorIntense')
        // console.log('-----------------------STATUS--------------------------')
        // console.log(transaction.hash)
        // console.log('------------------------------------------------------------------\n\n')
        store.commit('transactionsStore/SET_STATUS', transaction.hash)
      })
    })
  }
}

/**
 *
 *
 * @param {*} addressArray
 */
function monitorAllChannels (addressArray) {
  // console.log('addressArray', addressArray)
  if (checkIsOpenConnection()) {
    getAggregateBondedAdded(addressArray)
    getAggregateBondedRemoved(addressArray)
    getCosignatureAdded(addressArray)
    getConfirmed(addressArray)
    getUnconfirmedAdded(addressArray)
    getUnconfirmedRemoved(addressArray)
    getStatus(addressArray)
  }
}

/**
 *
 *
 * @param {*} addressArray
 * @memberof WebsocketConnection
 */
function openConnection () {
  cacheBlock = 1
  checking = false
  if (connector) {
    connector.open().then(() => {
      checkNodeIsLive(1)
      showMsgAndChangeStatus('Node Connection Established', 'success', 1)
      getBlocks()
    }, () => {
      showMsgAndChangeStatus('Error connecting to the node', 'errorIntense', 0)
    })
  }
}

/**
 *
 *
 */
function reconnect (changeStatus = true) {
  if (connector) {
    if (changeStatus) store.commit('nodeStore/SET_STATUS_NODE', 2)
    closeConnection()
  }
}

/**
 *
 *
 * @param {*} nodesList
 * @param {*} [nodeSelected=null]
 * @returns
 */
function selectNode (nodesList, nodeSelected = null) {
  if (!nodeSelected || nodeSelected === '') return nodesList[Math.floor(Math.random() * nodesList.length)]
  return nodeSelected
}

/**
 *
 *
 * @param {*} msg
 * @param {*} status
 * @param {*} color
 */
function showMsgAndChangeStatus (msg, color, status = null) {
  if (status !== null) store.commit('nodeStore/SET_STATUS_NODE', status)
  store.commit('SHOW_SNACKBAR', {
    snackbar: true,
    text: msg,
    color: color
  })
}

export {
  closeConnection,
  selectNode,
  monitorAllChannels,
  getAggregateBondedAdded,
  getAggregateBondedRemoved,
  getCosignatureAdded,
  getConfirmed,
  getUnconfirmedAdded,
  getUnconfirmedRemoved,
  getStatus,
  webSocketConnection
}
