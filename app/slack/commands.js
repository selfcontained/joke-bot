const Router = require('express').Router
const bodyParser = require('body-parser')

module.exports = (app) => {
  var verifyToken = app.config.slack.verifyToken
  var router = Router()

  router.get('/joke', (req, res) => {
    res.sendStatus(200)
  })

  router.post('/joke', bodyParser.json(), (req, res) => {
    if (req.body.token !== verifyToken) {
      return res.sendStatus(401)
    }

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      res.json({
        // response_type: 'in_channel',
        text: joke || app.messages('NO_JOKE')
      })
    })
  })

  return router
}
