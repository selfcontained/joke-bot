const Router = require('express').Router
const SlackApp = require('slackapp')

module.exports = (app) => {
  var router = new Router()

  app.slackapp = SlackApp({
    debug: app.config.slackapp.debug
  })

  require('./commands')(app)

  require('./messages')(app)

  return app.slackapp.attachToExpress(router)
}
