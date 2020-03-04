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
  return r
    .table('offers')
    .run(DB.conn)
}

module.exports = Queries
