const sampledThreshold = 0.05
const teamThrottleMS = 2 * 60 * 60 * 1000 // 2 hours

module.exports = function (app) {
  var teamsLastAmbient = {}

  return function ambientCheck (team) {
    var sendMessage = Math.random() > sampledThreshold
    if (!sendMessage) {
      return false
    }

    // Check if we sent an ambient message recently
    if (teamsLastAmbient[team] && teamsLastAmbient[team] > (Date.now() - teamThrottleMS)) {
      app.log.info('sent an ambient response too recently to %s', team)
      return false
    }

    teamsLastAmbient[team] = Date.now()

    return sendMessage
  }
}
