const Router = require('express').Router
const bodyParser = require('body-parser')

module.exports = (app) => {
  var router = Router()

  router.get('/webhook', require('./verify')(app))
  router.post('/webhook', bodyParser.json(), require('./message')(app))

  return router
}
