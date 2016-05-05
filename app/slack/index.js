const Router = require('express').Router

module.exports = (app) => {
  var router = new Router()

  // Setup botkit/beepboop rtm controller
  require('./rtm')(app)

  // Setup Slash Commands
  router.use('/commands', require('./commands')(app))

  return router
}
