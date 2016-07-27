const EventEmitter = require('events').EventEmitter
const express = require('express')
const Cashbox = require('cashbox')
const deap = require('deap')
const morgan = require('morgan')
const Persist = require('beepboop-persist')

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

  // Beep Boop persistence service
  app.persist = Persist({
    debug: true
  })

  app.track = require('./track/')(app)

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
        app.log.error('Error fetching jokes: ', err.message)
        res.send(err.message)
      }

      res.json(jokes)
    })
  })
  app.http.get('/jokes/random', (req, res) => {
    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error('Error fetching jokes: ', err.message)
        return res.send(err.message)
      }

      res.send(joke)
    })
  })
  app.http.get('/jokes/new-random/:identifier', (req, res) => {
    app.jokes.newJoke(req.params.identifier, (err, joke) => {
      if (err) {
        app.log.error('Error fetching jokes: ', err.message)
        return res.send(err.message)
      }

      res.send(joke)
    })
  })

  // mount persist, slack & facebook routers
  app.http.use('/persist', require('./persist/')(app))
  app.http.use(require('./slackapp/')(app))

  app.http.listen(app.config.port, (err) => {
    if (err) {
      return app.log.error(err)
    }

    app.log.info('http server started on port %s', app.config.port)
  })
}
