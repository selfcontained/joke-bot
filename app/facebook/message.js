const request = require('request')

module.exports = (app) => {
  var accessToken = app.config.facebook.accessToken

  // route for handling facebook messages
  function handleMessage (req, res) {
    var entry = ((req.body.entry || [])[0] || {})

    var messagingEvents = (entry.messaging || [])

    var textEvent = messagingEvents.filter((event) => {
      return event.message && event.message.text
      var sender = event.sender.id
      if (event.message && event.message.text) {
        sendTextMessage(sender, event.message.text)
      }
    })[0]

    if (!textEvent) {
      res.sendStatus(200)
    }

    var sender = textEvent.sender.id
    var message = textEvent.message.text

    if (/joke/.test(message)) {
      app.jokes.random((err, joke) => {
        if (err || !joke) {
          return sendMessage(sender, "Hmmmm, I can't seem to think of any jokes. 😕")
        }

        sendMessage(sender, joke)
      })
    }else {
      sendMessage(sender, "I'm gonna be completely honest, I pretty much have no idea what you're saying unless it includes the word joke 😋")
    }
  }

  function sendMessage (sender, text) {
    request({
      method: 'POST',
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: accessToken
      },
      json: {
        recipient: {
          id: sender
        },
        message: {
          text: text
        }
      }
    }, function (error, response, body) {
      if (error) {
        return app.log.error('Error sending facebook message: ', error)
      } else if (response.body.error) {
        return app.log.error('Error sending facebook message: ', response.body.error)
      }

      app.log.info('Sent facebook text message')
    })
  }

  return handleMessage
}