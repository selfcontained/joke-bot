const EventEmitter = require('events').EventEmitter
const express = require('express')
const Cashbox = require('cashbox')
const deap = require('deap')
const morgan = require('morgan')

module.exports = (config) => {
  var app = new EventEmitter()

  app.config = config
  app.log = require('./logger')(config.logging)
  app.messages = require('./messages/')

  app.log.debug('config: ', app.config)

  // Setup cache/data api
  app.cache = new Cashbox(deap({
    error: app.log.error.bind(app.log)
  }, app.config.cache))

  // Setup webserver
  app.http = express()
  app.http.use(morgan(':date[iso] - :method :url :status :res[content-length] - :response-time ms'))

  // Root status route
  app.http.get('/', (req, res) => {
    res.json({
      status: 'ok'
    })
  })

  // Setup jokes api and test routes
  app.jokes = require('./jokes/')(app)
  app.http.get('/jokes', (req, res) => {
    app.jokes.all((err, jokes) => {
      if (err) {
        return app.log.error('Error fetching jokes: ', err.message)
      }

      res.json(jokes)
    })
  })
  app.http.get('/jokes/random', (req, res) => {
    app.jokes.random((err, joke) => {
      if (err) {
        return app.log.error('Error fetching jokes: ', err.message)
      }

      res.send(joke)
    })
  })

  // mount slack & facebook router
  app.http.use('/slack', require('./slack/')(app))
  app.http.use('/facebook', require('./facebook/')(app))
  app.log.facebook('Slack & Facebook routes registered')

  app.http.listen(app.config.port, (err) => {
    if (err) {
      return app.log.error(err)
    }

    app.log.info('http server started on port %s', app.config.port)
  })
}
