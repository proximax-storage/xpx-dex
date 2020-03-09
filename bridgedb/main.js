const express = require('express')
const path = require('path')
const DB = require('./lib/db')
const queries = require('./lib/queries')
const Log = require('./lib/log')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const BlockchainProvider = require('./lib/blockchain-provider')
const bl = new BlockchainProvider()
// Connect rethinkdb module
DB.connect().then(successMessage => {
  changesTable()
})

// Connect socket and channel
io.on('connection', socket => {
  // CHANNELS
  Log.info(`   >> socket user connected`)
  socket.on('disconnect', () => {
    Log.info(`   >> socket user disconnected'`)
  })
  socket.on('getOffertsTx', msg => {
    getAllOffertTx()
  })
  socket.on('getMoisaicsInfo', msg => {
    getMosaicInfo()
  })
  socket.on('insertNewOffers', data => {
    insertOffert(data)
  })
  socket.on('insertMoisaicsInfo', data => {
    insertMoisaicsInfo(data)
  })
})
// ################ queries rethinkdb #############
function changesTable () {
  queries.changesTable(null).then(cursor => {
    cursor.each((err, change) => {
      if (err) throw err
      if (change['new_val'] && change['old_val'] === null) {
        // INSERT
        console.log('==> Insert')
        io.emit('SET_NEW_OFFERS', change['new_val'])
      } else if (change['old_val'] && change['new_val'] === null) {
        // DELETE
        console.log('==> Delete')
        io.emit('SET_DELETE_OFFERS', change['old_val'])
      } else if (change['old_val'] && change['ne&&w_val']) {
        // UPDATE
        console.log('   ==> Update')
        io.emit('SET_UPDATE_OFFERS', change)
      }
    })
  })
}
function getAllOffertTx () {
  queries.getAlloffertTx(null).then(cursor => {
    console.log('==> get all offert tx')
    cursor.toArray((err, result) => {
      if (err) throw err
      io.emit('SET_OFFERS', result)
    })
  })
}
function getMosaicInfo () {
  queries.getMosaicInfo(null).then(cursor => {
    console.log('==> get mosaic info')
    cursor.toArray((err, result) => {
      if (err) throw err
      io.emit('SET_MOSAIC_INFO', result)
    })
  })
}
function insertOffert (data) {
  queries.insertOffert([data]).then(result => {
    const dataMosaics = []
    if (result['errors'] > 0) throw result['first_error']
    if (result['inserted'] > 0) {
      for (let index = 0; index < result['inserted']; index++) {
        const element = result['changes'][index]
        if (element['new_val']) {
          for (let items of element['new_val'].offers) {
            console.log('HEX', bl.getMosaicId(items.mosaicId).toHex())
            dataMosaics.push({
              mosaicId: bl.getMosaicId(items.mosaicId),
              mosaicIdHex: bl.getMosaicId(items.mosaicId).toHex()
            })
            insertMoisaicsInfo(dataMosaics)
          }
        }
      }
    }
    io.emit('RETURN_INSERT_OFFERT', result)
  })
}
function insertMoisaicsInfo (data) {
  queries.insertMoisaicsInfo(data).then(result => {
    if (result['errors'] > 0) throw result['first_error']
    io.emit('RETURN_INSERT_MOSAIC_INFO', result)
  })
}

// Listen http
app.use(express.static(path.join(__dirname, '../public'))) // use static dir
app.set('port', process.env.PORT || 3500) // set port
http.listen(app.get('port'), () => {
  Log.info(`   >> listening on port ${app.get('port')}`)
})
