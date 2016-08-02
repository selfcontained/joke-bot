const Router = require('express').Router
const Slapp = require('slapp')
const BeepBoopContext = require('slapp-context-beepboop')
const BeepBoopConvo = require('slapp-convo-beepboop')
const bodyParser = require('body-parser')

module.exports = (app) => {
  var router = new Router()

  router.use(bodyParser.json(), (req, res, next) => {
    console.log('body: ', req.body)

    next()
  })

  app.slapp = Slapp({
    verify_token: app.config.slack.verifyToken,
    context: BeepBoopContext(),
    convo_store: BeepBoopConvo()
  })

  require('./commands')(app)

  require('./messages')(app)

  return app.slapp.attachToExpress(router)
}
