const Router = require('express').Router
const SlackApp = require('slackapp')

module.exports = (app) => {
  let router = new Router()

  let slackapp = SlackApp()

  slackapp.command('/joke', (msg) => {
    let teamId = msg.body.team_id
    let teamDomain = msg.body.team_domain

    app.jokes.newJoke(teamId, (err, joke, jokeId) => {
      if (err) {
        app.log.error(err.message)
      }

      app.track('joke.command', {
        distinct_id: teamId,
        teamDomain: teamDomain,
        jokeId: jokeId,
        joke: joke
      })

      msg.respond(msg.body.response_url, {
        response_type: 'in_channel',
        text: joke || app.messages('NO_JOKE')
      })
    })
  })

  // Setup botkit/beepboop rtm controller
  // require('./rtm')(app)

  // Setup Slash Commands
  // router.use('/commands', require('./commands')(app))

  return router
}
