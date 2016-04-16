const GoogleSpreadsheet = require('google-spreadsheet')
const Cashbox = require('cashbox')

module.exports = (app) => {
  var LAST_JOKES = []
  var config = app.config.spreadsheet
  var sheet = new GoogleSpreadsheet(config.id)
  var cache = new Cashbox()

  return function getJokes (done) {
    cache.get('jokes', (key, callback) => {
      app.log.info('loading jokes from google...')

      sheet.getRows(config.sheet, (err, rows) => {
        // Treat errors by sending the last good set of lot data
        if (err) {
          app.log.error(err)
          return callback(null, LAST_JOKES)
        }

        // If our data is empty for some reason, send the last good set
        if (!rows || !rows.length) {
          return callback(null, LAST_JOKES)
        }

        // Keep a local ref of last good set of lot data
        LAST_JOKES = rows

        callback(null, rows)
      })
    }, config.ttl, done)
  }
}
