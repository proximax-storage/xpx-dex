const r = require('rethinkdb')
const Log = require('./log')

const DB = {
  conn: null,
  connStruc: null,
  name: 'dexWallet',
  host: 'localhost',
  port: 32769,
  tables: [
    { table: 'executeOffers', options: {} },
    { table: 'mosaicInfo', options: { primaryKey: 'mosaicIdHex' } }
  ],
  // host: '192.168.1.71',
  async connect () {
    try {
      Log.info('   >> Connecting to RethinkDB...')
      const host = process.env.db_host || DB.host // 192.168.3.242
      const port = process.env.db_port || DB.port //
      const db = process.env.db_name || undefined
      const user = process.env.db_user || undefined
      const password = process.env.db_password || undefined

      DB.conn = await r.connect({ host, port, db, user, password })
      DB.dbCreateStrusture()
      Log.info('   >> RethinkDB connected')
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
  },

  async dbCreateStrusture () {
    try {
      Log.info('   >> Create strusture  RethinkDB...')
      const bd = process.env.db_user || DB.name
      // DB.connStruc = await r.connect({ host, port, db, user, password })
      const data = await r.dbCreate(bd).run(DB.conn)
      // console.log('data', data)
      if (data.config_changes.length > 0) {
        Log.info(`   >> Created dataBase '${data.config_changes[0]['new_val']['name']}'`)
        DB.conn.use(bd)
        for (let element of DB.tables) {
          await DB.createTable(bd, element.table, element.options, DB.conn)
        }
      }
    } catch (error) {
      if (error.msg) {
        Log.info(`   >> ${error.msg}`)
      } else {
        console.error(error)
        process.exit(-1)
      }
    }
  },
  createTable (db, name, options, connect) {
    return r
      .db(db)
      .tableCreate(name, options)
      .run(connect)
      .then(data => {
        if (data.config_changes.length > 0) {
          Log.info(`        >> Created Table '${data.config_changes[0]['new_val']['name']}'`)
        }
      })
      .catch(error => {
        console.log('RETHINKDB: Table', error)
      })
  }
}
module.exports = DB
