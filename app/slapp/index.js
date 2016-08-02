const Router = require('express').Router
const Slapp = require('slapp')
const BeepBoopContext = require('slapp-context-beepboop')
const BeepBoopConvo = require('slapp-convo-beepboop')

module.exports = (app) => {
  var router = new Router()

  var logger = (req, res, next) => {
    console.log('slapp: ', req.slapp)

    next()
  }

  app.slapp = Slapp({
    verify_token: app.config.slack.verifyToken,
    context: [BeepBoopContext(), logger],
    convo_store: BeepBoopConvo()
  })

  require('./commands')(app)

  require('./messages')(app)

  return app.slapp.attachToExpress(router)
}
