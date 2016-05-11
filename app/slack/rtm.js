const Botkit = require('botkit')
const BeepBoop = require('beepboop-botkit')

// Setup slack rtm connections w/ botkit & beepboop
module.exports = (app) => {
  var ambientCheck = require('./ambient-check')(app)

  var controller = Botkit.slackbot({
    retry: Infinity,
    logger: botkitLogger(app.log)
  })

  var beepboop = BeepBoop.start(controller, {
    debug: true,
    logger: beepboopLogger(app.log)
  })

  // Send a message to the user that added the bot right after it connects
  beepboop.on('botkit.rtm.started', function (bot, resource, meta) {
    var slackUserId = resource.SlackUserID

    if (meta.isNew && slackUserId) {
      app.track('team.added', {
        distinct_id: resource.SlackTeamID,
        teamName: resource.SlackTeamName,
        userId: resource.SlackUserID
      })
      app.log.info('welcoming user %s', slackUserId)
      bot.api.im.open({ user: slackUserId }, function (err, response) {
        if (err) {
          return app.log.error(err)
        }
        var dmChannel = response.channel.id
        bot.say({channel: dmChannel, text: 'Thanks for adding me to your team!'})
        bot.say({channel: dmChannel, text: 'In order for the rofls and lols to start flowing, just /invite me to a channel!'})
      })
    }
  })

  var atBot = ['direct_message', 'direct_mention', 'mention']

  controller.hears('joke', atBot, (bot, message) => {
    // filter out a matching slash command
    if (message.text === '/joke') {
      return
    }

    bot.startTyping(message)

    app.jokes.newJoke(message.team, (err, joke, jokeId) => {
      if (err) {
        app.log.error(err.message)
      }

      app.track('joke.requested', {
        distinct_id: message.team,
        teamName: bot.team_info.name,
        teamDomain: bot.team_info.domain,
        jokeId: jokeId,
        joke: joke
      })
      bot.reply(message, joke || app.messages('NO_JOKE'))
    })
  })

  controller.hears('joke', ['ambient'], (bot, message) => {
    // filter out a matching slash command
    if (message.text === '/joke') {
      return
    }
    // limit the amount of ambient responses
    if (!ambientCheck(message.team)) {
      return
    }

    bot.reply(message, app.messages('HEARD_JOKE'))
    bot.startTyping(message)

    app.jokes.newJoke(message.team, (err, joke, jokeId) => {
      if (err) {
        app.log.error(err.message)
      }

      app.track('joke.ambient', {
        distinct_id: message.team,
        teamName: bot.team_info.name,
        teamDomain: bot.team_info.domain,
        jokeId: jokeId,
        joke: joke
      })

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || app.messages('NO_JOKE_INITIATED'))
      }, 2000)
    })
  })

  controller.hears(['lol', 'rofl', 'haha', 'hehe', 'lmao'], ['ambient'], (bot, message) => {
    // limit the amount of ambient responses
    if (!ambientCheck(message.team)) {
      return
    }

    bot.reply(message, app.messages('HEARD_FUNNY'))
    bot.startTyping(message)

    app.jokes.newJoke(message.team, (err, joke, jokeId) => {
      if (err) {
        app.log.error(err.message)
      }

      app.track('joke.ambient.lol', {
        distinct_id: message.team,
        teamName: bot.team_info.name,
        teamDomain: bot.team_info.domain,
        jokeId: jokeId,
        joke: joke
      })

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || app.messages('NO_JOKE_INITIATED'))
      }, 2000)
    })
  })

  controller.hears(['thanks', 'thnx'], atBot, (bot, message) => {
    app.track('thanks.reply', {
      distinct_id: message.team,
      teamName: bot.team_info.name,
      teamDomain: bot.team_info.domain
    })
    bot.reply(message, app.messages('YOUR_WELCOME'))
  })

  controller.hears(['good one', 'nice'], atBot, (bot, message) => {
    app.track('nice.reply', {
      distinct_id: message.team,
      teamName: bot.team_info.name,
      teamDomain: bot.team_info.domain
    })
    bot.reply(message, app.messages('THANKS'))
  })

  controller.hears(['help', 'what do you do'], atBot, (bot, message) => {
    app.track('help.reply', {
      distinct_id: message.team,
      teamName: bot.team_info.name,
      teamDomain: bot.team_info.domain
    })
    bot.reply(message, app.messages('HELP'))
  })
}

function beepboopLogger (log) {
  return {
    debug: log.beepboop.bind(log),
    error: log.error.bind(log)
  }
}

function botkitLogger (log) {
  return {
    log: function (lvl) {
      var args = Array.prototype.slice.call(arguments, 1)
      // isolate botkit debug messages - chatty
      if (lvl === 'debug') {
        return
      }

      log.botkit.apply(log, args)
    }
  }
}
