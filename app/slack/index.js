const Botkit = require('botkit')
const BeepBoop = require('beepboop-botkit')

module.exports = (app) => {
  var controller = Botkit.slackbot({
    retry: true,
    logger: botkitLogger(app.log)
  })

  BeepBoop.start(controller, {
    debug: true,
    logger: beepboopLogger(app.log)
  })

  var atBot = ['direct_message', 'direct_mention', 'mention', 'ambient']

  controller.hears('joke', atBot, function (bot, message) {
    bot.startTyping(message)

    app.jokes.random((err, joke) => {
      if (err) {
        app.log.error(err.message)
      }

      bot.reply(message, joke || "Hmmmm, I can't seem to think of any jokes. 😕")
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
