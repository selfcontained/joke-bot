const Wit = require('node-wit').Wit
console.log(Wit)

module.exports = (app) => {
  var accessToken = app.config.wit.accessToken
  var sendMessage = require('./send')(app)

  // Setting up our wit bot
  var wit = new Wit(accessToken, {
    say (fbUserId, context, message, cb) {
      // Our bot has something to say!
      // Let's retrieve the Facebook user whose session belongs to
      sendMessage(fbUserId, message, (err, data) => {
        if (err) {
          app.log.error('Error sending a response to %s: %s', fbUserId, err.message)
        }

        console.log('calling wit callbac after say')
        cb()
      })
    },
    merge (sessionId, context, entities, message, cb) {
      app.log.debug('merge: ', context, entities, message)
      cb(context)
    },
    error (sessionId, context, err) {
      app.log.error(err.message)
    },
    tellJoke (sessionId, context, cb) {
      app.jokes.random((err, joke) => {
        if (err) {
          app.log.error(err.message)
        }

        context.joke = joke || "Hmmmm, I can't seem to think of any jokes. 😕"

        cb(context)
      })
    }
  })

  return function processMessage (userId, message) {
    app.log.debug('processing message via wit: %s', message)

    // get user's context, or create a new one
    var userKey = 'context:' + userId

    app.cache.get(userKey, (err, context) => {
      if (err) {
        return app.log.error(err.message)
      }
      // Default context to empty object
      context = context || {}

      // let wit process the message
      wit.runActions(
        userId, // the user's current session
        message, // the user's message
        context, // the user's current context
        (error, context) => {
          app.log.info('wit callback: ', context)
          if (error) {
            return app.log.error('Oops! Got an error from Wit:', error)
          }

          // Our bot did everything it has to do.
          // Now it's waiting for further messages to proceed.
          app.log.info('waiting for futher messages')

          // Updating the user's current session state
          app.cache.set(userKey, context)

          // TODO: determine when to expire the context?
          // app.cache.expire(userKey)
        }
      )
    })
  }
}
