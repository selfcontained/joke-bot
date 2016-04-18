const GoogleSpreadsheet = require('google-spreadsheet')
const Cashbox = require('cashbox')
const deap = require('deap')

module.exports = (app) => {
  var LAST_JOKES = []
  var config = app.config.spreadsheet
  var sheet = new GoogleSpreadsheet(config.id)
  var cache = new Cashbox(deap({
    error: app.log.error.bind(app.log)
  }, app.config.cache))

  return function getJokes (done) {
    cache.get('jokes', (key, callback) => {
      app.log.info('loading jokes from google...')

      sheet.getRows(config.sheet, (err, rows) => {
        if (err) {
          // Treat errors by sending the last good set of jokes
          if (LAST_JOKES.length > 0) {
            app.log.error(err.message)
            return callback(null, LAST_JOKES)
          }

          return callback(err, [])
        }

        // If our data is empty for some reason, send the last good set
        if (!rows || !rows.length) {
          if (LAST_JOKES.length > 0) {
            return callback(null, LAST_JOKES)
          }

          return callback(new Error('no jokes returned'), [])
        }

        var jokes = rows.map((row) => {
          return row.joke
        })

        // Keep a local ref of last good set of jokes
        LAST_JOKES = jokes

        callback(null, jokes)
      })
    }, config.ttl, done)
  }
}
