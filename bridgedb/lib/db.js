const r = require('rethinkdb')
const Log = require('./log')

const DB = {
  conn: null,
  async connect () {
    try {
      Log.info('   >> Connecting to RethinkDB...')
      const host = process.env.db_host || '192.168.1.69'
      const port = process.env.db_port || 32769
      const db = process.env.db_name || 'dexWallet'
      const user = process.env.db_user || undefined
      const password = process.env.db_password || undefined
      DB.conn = await r.connect({ host, port, db, user, password })
      Log.info('   >> RethinkDB Connected!')
    } catch (error) {
      console.error(error)
      process.exit(-1)
    }
  }
}
module.exports = DB
