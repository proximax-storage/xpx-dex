const express = require('express')
const path = require('path')
const app = express()

const DB = require('./lib/db')
// const queries = require('./lib/queries')
const Log = require('./lib/log')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, '../public')))
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('customEmit', function (msg) {
    console.log('channel custom emit', msg)
    io.emit('customEmit', 'Hola hemos recibido tu mensaje desde custom emit: ' + msg)
  })
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
  socket.on('chat_message', function (msg) {
    console.log('message: ' + msg)
    io.emit('chat_message', 'Hola hemos recibido tu mensaje: ' + msg)
  })
})
app.set('port', process.env.PORT || 3700)
http.listen(app.get('port'), () => {
  Log.info(`   >> listening on port ${app.get('port')}`)
})

// connect rethinkdb module
DB.connect().then(successMessage => {
  // changesTable()
})

// ################ queries rethinkdb #############
// function changesTable () {
//   queries.changesTable(null).then(function (cursor) {
//     console.log('changesTable')
//     cursor.each(function (err, change) {
//       console.log('change::', change)
//       console.error('err', err)
//       Stream.emit('push-offertTx', 'test', { changeTx: change })
//     })
//   })
// }
// function getAllOffertTx() {
//   queries.getAlloffertTx(null).then(function(cursor) {
//     console.log('getAlloffertTx')
//     cursor.toArray(function(err, result) {
//       if (err) throw err
//       Stream.emit('push-offertTx', '', { tx: result })
//     })
//   })
// }
// ################ Routers api ###################
// app.get('/offertTx', function (req, res) {
//   res.status(200).set({
//     Connection: 'keep-alive',
//     'Cache-control': 'no-cache',
//     'Content-Type': 'text/event-stream'
//   })
//   console.log('llego aqui')
//   Stream.on('push-offertTx', function (event, data) {
//     res.write(`data: ${JSON.stringify(data)}\n\n`)
//   })
//   getAllOffertTx()
//   changesTable()
// })

// #####
