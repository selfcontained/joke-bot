const Botkit = require('botkit')
const BeepBoop = require('beepboop-botkit')

module.exports = (app) => {
  var ambientThreshold = 0.33

  var controller = Botkit.slackbot({
    retry: 10,
    logger: botkitLogger(app.log)
  })

  BeepBoop.start(controller, {
    debug: true,
    logger: beepboopLogger(app.log)
  })

  var jokeTime = ['direct_message', 'direct_mention', 'mention']

  controller.hears('joke', jokeTime, function (bot, message) {
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      bot.reply(message, joke || "Hmmmm, I can't seem to think of any jokes. 😕")
    })
  })

  controller.hears('joke', ['ambient'], function (bot, message) {
    // only tell a joke some of the time, let's not be annoying 😏
    if (Math.random() > ambientThreshold) {
      return
    }

    bot.reply(message, "Did someone say joke? I've got a joke for you... 😋")
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || "Nevermind, that's embarassing, I can't think of any good jokes. 😕")
      }, 2000)
    })
  })

  controller.hears(['lol', 'rofl', 'haha'], ['ambient'], function (bot, message) {
    // only tell a joke some of the time, let's not be annoying 😏
    if (Math.random() > ambientThreshold) {
      return
    }

    bot.reply(message, "hah! you think that's funny? 😏")
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || "Nevermind, that's embarassing, I can't think of any good jokes. 😕")
      }, 2000)
    })
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
