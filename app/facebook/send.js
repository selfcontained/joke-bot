const request = require('request')

module.exports = function (app) {
  var accessToken = app.config.facebook.accessToken

  return function sendMessage (sender, text, done) {
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
        return done(error)
      } else if (response.body && response.body.error) {
        return done(response.body.error)
      }

      app.log.info('Sent facebook text message')
      done(null)
    })
  }
}
