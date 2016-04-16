const Router = require('express').Router
const bodyParser = require('body-parser')

module.exports = (app) => {
  var router = Router()

  router.get('/webhook', require('./verify')(app))
  router.post('/webhook', bodyParser.json(), require('./message')(app))
  router.get('/jokes', (req, res) => {
    app.jokes.all((err, jokes) => {
      if (err) {
        return app.log.error('Error fetching jokes: ', err.message)
      }

      res.json(jokes)
    })
  })
  router.get('/jokes/random', (req, res) => {
    app.jokes.random((err, joke) => {
      if (err) {
        return app.log.error('Error fetching jokes: ', err.message)
      }

      res.send(joke)
    })
  })

  return router
}
