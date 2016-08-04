
module.exports = (app) => {
  var ambientCheck = require('./ambient-check')(app)

  var atBot = ['direct_message', 'direct_mention', 'mention']

  app.slapp
    // Send a message to the user that added the bot right after it connects
    .event('bb.team_added', function (msg) {
      var user = msg.meta.user_id
      var token = msg.meta.bot_token

      app.track('team.added', {
        distinct_id: msg.meta.team_id,
        teamName: msg.meta.team_name,
        teamDomain: msg.meta.team_domain,
        userId: user
      })
      app.log.info('welcoming user %s', user)

      app.slapp.client.im.open({ token, user }, (err, data) => {
        if (err) {
          return app.log.error(err)
        }
        var channel = data.channel.id

        msg
          .say({ channel, text: 'Thanks for adding me to your team!' })
          .say({ channel, text: 'In order for the rofls and lols to start flowing, just /invite me to a channel!' })
      })
    })
    .message('joke', atBot, (msg) => {
      // filter out a matching slash command
      if (msg.body.text === '/joke') {
        return
      }

      var teamId = msg.meta.team_id

      app.jokes.newJoke(teamId, (err, joke, jokeId) => {
        if (err) {
          app.log.error(err.message)
        }

        app.track('joke.requested', {
          distinct_id: teamId,
          teamName: msg.meta.team_name,
          teamDomain: msg.meta.team_domain,
          jokeId: jokeId,
          joke: joke
        })
        msg.say(joke || app.messages('NO_JOKE'))
      })
    })
    .message(/lol|rofl|haha|hehe|lmao/, 'ambient', (msg) => {
      var teamId = msg.meta.team_id

      // limit the amount of ambient responses
      if (!ambientCheck(msg.team)) {
        return
      }

      msg.say(app.messages('HEARD_FUNNY'))

      app.jokes.newJoke(teamId, (err, joke, jokeId) => {
        if (err) {
          app.log.error(err.message)
        }

        app.track('joke.ambient.lol', {
          distinct_id: teamId,
          teamName: msg.meta.team_name,
          teamDomain: msg.meta.team_domain,
          jokeId: jokeId,
          joke: joke
        })

        // make it seem like bot is typing a joke for a bit
        setTimeout(() => {
          msg.say(joke || app.messages('NO_JOKE_INITIATED'))
        }, 2000)
      })
    })
    .message(/thanks|thnx/, atBot, (msg) => {
      app.track('thanks.reply', {
        distinct_id: msg.meta.team_id,
        teamName: msg.meta.team_name,
        teamDomain: msg.meta.team_domain
      })
      msg.say(app.messages('YOUR_WELCOME'))
    })
    .message(/good one|nice/, atBot, (msg) => {
      app.track('nice.reply', {
        distinct_id: msg.meta.team_id,
        teamName: msg.meta.team_name,
        teamDomain: msg.meta.team_domain
      })
      msg.say(app.messages('THANKS'))
    })
    .message(/help|what do you do/, atBot, (msg) => {
      app.track('help.reply', {
        distinct_id: msg.meta.team_id,
        teamName: msg.meta.team_name,
        teamDomain: msg.meta.team_domain
      })
      msg.say(app.messages('HELP'))
    })
}
