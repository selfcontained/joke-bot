const EventEmitter = require('events').EventEmitter
const express = require('express')

module.exports = (config) => {
  var app = new EventEmitter()

  app.config = config
  app.log = require('./logger')(config.logging)
  app.http = express()

  app.log.info('config: ', app.config)

  app.jokes = require('./jokes/')(app)

  // Root status route
  app.http.get('/', (req, res) => {
    res.json({
      status: 'ok'
    })
  })

  // mount facebook router
  app.http.use('/facebook', require('./facebook/')(app))
  app.log.facebook('Facebook routes registered')

  app.http.listen(app.config.port, (err) => {
    if (err) {
      return app.log.error(err)
    }

    app.log.info('http server started on port %s', app.config.port)
  })
}
