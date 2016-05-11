const Router = require('express').Router
const bodyParser = require('body-parser')

module.exports = (app) => {
  var verifyToken = app.config.slack.verifyToken
  var router = Router()

  router.get('/joke', (req, res) => {
    res.sendStatus(200)
  })

  router.post('/joke', bodyParser.urlencoded({ extended: true }), (req, res) => {
    if (req.body.token !== verifyToken) {
      return res.sendStatus(401)
    }

    app.jokes.newJoke(req.body.team_id, (err, joke, jokeId) => {
      if (err) {
        app.log.error(err.message)
      }

      app.track('joke.command', {
        distinct_id: req.body.team_id,
        teamDomain: req.body.team_domain,
        jokeId: jokeId,
        joke: joke
      })

      res.json({
        response_type: 'in_channel',
        text: joke || app.messages('NO_JOKE')
      })
    })
  })

  return router
}
