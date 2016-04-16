const request = require('request')

module.exports = (app) => {
  var accessToken = app.config.facebook.accessToken

  // route for handling facebook messages
  function handleMessage (req, res) {
    var entry = ((req.body.entry || [])[0] || {})
    app.log.facebook('webhook entry: ', entry)

    var messagingEvents = (entry.messaging || [])

    messagingEvents.forEach((event) => {
      var sender = event.sender.id
      if (event.message && event.message.text) {
        sendTextMessage(sender, event.message.text)
      }
    })

    res.sendStatus(200)
  }

  function sendTextMessage (sender, text) {
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
