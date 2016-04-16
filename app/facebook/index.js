const Router = require('express').Router

module.exports = (app) => {
  var router = Router()

  router.get('/webhook', require('./verify')(app))
  router.post('/webhook', require('./message')(app))

  return router
}
