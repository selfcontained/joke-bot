const Router = require('express').Router
const Slapp = require('slapp')
const BeepBoopContext = require('slapp-context-beepboop')
const BeepBoopConvo = require('slapp-convo-beepboop')

module.exports = (app) => {
  var router = new Router()

  app.slapp = Slapp({
    verify_token: app.config.slack.verifyToken,
    context: BeepBoopContext(),
    convo_store: BeepBoopConvo()
  })

  require('./commands')(app)

  require('./messages')(app)

  require('beepboop-slapp-presence-polyfill')(app.slapp, {
    debug: true
  })

  return app.slapp.attachToExpress(router)
}
