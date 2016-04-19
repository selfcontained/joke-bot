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

  var atBot = ['direct_message', 'direct_mention', 'mention']

  controller.hears('joke', atBot, (bot, message) => {
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      bot.reply(message, joke || app.messages('NO_JOKE'))
    })
  })

  controller.hears('joke', ['ambient'], (bot, message) => {
    // only tell a joke some of the time, let's not be annoying 😏
    if (Math.random() > ambientThreshold) {
      return
    }

    bot.reply(message, app.message('HEARD_JOKE'))
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || app.messages('NO_JOKE_INITIATED'))
      }, 2000)
    })
  })

  controller.hears(['lol', 'rofl', 'haha'], ['ambient'], (bot, message) => {
    // only tell a joke some of the time, let's not be annoying 😏
    if (Math.random() > ambientThreshold) {
      return
    }

    bot.reply(message, app.messages('HEARD_FUNNY'))
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      // make it seem like bot is typing a joke for a bit
      setTimeout(() => {
        bot.reply(message, joke || app.messages('NO_JOKE_INITIATED'))
      }, 2000)
    })
  })

  controller.hears(['help', 'what do you do'], atBot, (bot, message) => {
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
