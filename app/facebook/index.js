const Router = require('express').Router

module.exports = (app) => {
  var router = Router()

  router.get('/webhook', require('./verify')(app.config.facebook.verifyToken))
  router.post('/webook', require('./message')(app))

  return router
}
