const express = require('express')
const path = require('path')
const DB = require('./lib/db')
const queries = require('./lib/queries')
const Log = require('./lib/log')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
// const BlockchainProvider = require('./lib/blockchain-provider')
// const bl = new BlockchainProvider()
// Connect rethinkdb module

DB.connect().then(successMessage => {
  // changesTable()
  // DB.dbCreateStrusture().then(successMessage => {
  //   // changesTable()
  // })
})

// Connect socket and channel
io.on('connection', socket => {
  // CHANNELS
  Log.info(`   >> socket user connected`)
  socket.on('disconnect', () => {
    Log.info(`   >> socket user disconnected'`)
  })
  // GETTER CHANNELS
  socket.on('getMoisaicsInfo', msg => {
    getMosaicInfo()
  })
  // ISERT CHANNELS
  socket.on('insertExecuteOffers', data => {
    insertExecuteOffers(data)
  })
  socket.on('insertMoisaicsInfo', data => {
    insertMoisaicsInfo(data)
  })
  // UPDATE CHANNELS
})

// ################ queries rethinkdb #############
// GETTER QUERIES
function getMosaicInfo () {
  queries.getMosaicInfo(null).then(cursor => {
    cursor.toArray((err, result) => {
      if (err) throw err
      io.emit('SET_MOSAIC_INFO', result)
    })
  })
}
// ISERT QUERIES
function insertMoisaicsInfo (data) {
  const dataMoisaics = data.moisaicsInfo
  const dataOffer = data.dataOffer
  queries.insertMoisaicsInfo(dataMoisaics).then(result => {
    if (result['errors'] > 0) throw result['first_error']
    // if (result['inserted'] > 0) {
    io.emit('RETURN_INSERT_MOSAIC_INFO', { dataDb: result, dataOffer: dataOffer })
    // }
  })
}
function insertExecuteOffers (data) {
  queries.insertExecuteOffers(data).then(result => {
    if (result['errors'] > 0) throw result['first_error']
    io.emit('RETURN_INSERT_EXECUTE_OFFERS', result)
  })
}
// UPDATE QUERIES

// ################ Listen http#############
app.use(express.static(path.join(__dirname))) // use static dir
app.set('port', process.env.PORT || 900) // set port)
http.listen(app.get('port'), () => {
  Log.info(`   >> listening on port ${app.get('port')}`)
})
