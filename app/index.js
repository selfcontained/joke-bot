const EventEmitter = require('events').EventEmitter
const express = require('express')

module.exports = (config) => {
  var app = new EventEmitter()

  app.config = config
  app.log = require('./logger')(config.logging)
  app.http = express()

  app.log.info('config: ', app.config)

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

  // Root status route
  app.http.get('/', (req, res) => {
    res.json({
      status: 'ok'
    })
  })

  // mount facebook router
  app.http.use('/facebook', require('./facebook/')(app))
  app.log.facebook('Facebook routes registered')

  // register slackbot
  require('./slack/')(app)

  app.http.listen(app.config.port, (err) => {
    if (err) {
      return app.log.error(err)
    }

    app.log.info('http server started on port %s', app.config.port)
  })
}
