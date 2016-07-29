
module.exports = (app) => {
  app.slackapp.command('/joke', (msg) => {
    var teamId = msg.body.team_id
    var teamDomain = msg.body.team_domain

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
}
