const Mixpanel = require('mixpanel')

module.exports = function (app, config) {
  var mixpanel
  var token = app.config.mixpanel.token

  if (token) {
    mixpanel = Mixpanel.init(token)
    app.log.info('Tracking enabled')
  } else {
    app.log.info('Tracking disabled')
  }

  // expose alias for track calls
  return function track () {
    if (!mixpanel) {
      return
    }

    app.log.info('app.track(%s)', arguments[0])
    mixpanel.track.apply(mixpanel, arguments)
  }
}
