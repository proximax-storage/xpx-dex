const r = require('rethinkdb')
const Log = require('./log')

const DB = {
  conn: null,
  async connect () {
    try {
      Log.info('   >> Connecting to RethinkDB...')
      const host = process.env.db_host || '192.168.3.242 ' // 192.168.3.242
      const port = process.env.db_port || 32769
      const db = process.env.db_name || 'dexWallet'
      const user = process.env.db_user || undefined
      const password = process.env.db_password || undefined
      DB.conn = await r.connect({ host, port, db, user, password })
      Log.info('   >> RethinkDB connected!')
    } catch (error) {
      console.error(error)
      process.exit(-1)
    }
  },
  async close () {
    DB.conn
      .close({ noreplyWait: true })
      .then(function () {
        // conn is now closed
        Log.info('   >> RethinkDB disconnect!')
      })
      .error(function (err) {
        console.error(err)
        // process the error
      })
  }
}
module.exports = DB
