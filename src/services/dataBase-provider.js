import * as rDb from 'rethinkdb'
class DataBaseProvider {
  constructor (host, port) {
    this.connection = this.connectDb(host, port)
  }

  connectDb (hosts, port) {
    // console.log('host::', hosts)
    // console.log('port::', port)
    // console.log('rDb::', rDb)
    rDb.connect({ host: '192.168.3.242', port: 28015 }, function (err, conn) {
      console.error('errerrerrerr::', err)
      if (err) throw err
      // console.log('connect::', conn)
      return conn
    })
  }
}
export { DataBaseProvider }
