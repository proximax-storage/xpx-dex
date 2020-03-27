const r = require('rethinkdb')
const DB = require('./db')

// const standardValue = { includeInitial: true, includeTypes: true, includeStates: true }
// const standardQuery = {
//   includeInitial: true,
//   includeTypes: true,
//   includeStates: true,
//   includeOffsets: true
// }
// const noRangeQuery = { includeInitial: true, includeTypes: true }

const Queries = {}
// A simple value query for a public user record. We do not emit sensitive fields (tx proximax, etc.) here. Note that the
// pluck operation has to come after the changefeed request.
Queries.changesTable = params => {
  return r
    .table('offers')
    .changes()
    .run(DB.conn)
}

Queries.getAlloffertTx = params => {
  return r.table('offers').run(DB.conn)
}
Queries.getMosaicInfo = params => {
  return r.table('mosaicInfo').run(DB.conn)
}

Queries.insertMoisaicsInfo = params => {
  return r
    .table('mosaicInfo')
    .insert(params, { returnChanges: true, conflict: 'replace' })
    .run(DB.conn)
}
Queries.insertOffert = params => {
  return r
    .table('offers')
    .insert(params, { returnChanges: true })
    .run(DB.conn)
}
Queries.insertExecuteOffers = params => {
  return r
    .table('executeOffers')
    .insert(params, { returnChanges: true })
    .run(DB.conn)
}

module.exports = Queries
