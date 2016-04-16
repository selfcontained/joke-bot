
// Route handler for facebook messenger token verification
module.exports = (app) => {
  var verifyToken = app.config.facebook.verifyToken
  return (req, res) => {
    var hub = req.query.hub || {}
    app.log.facebook('verify: ', req.query)

    if (hub.mode === 'subscribe' && hub.verify_token === verifyToken) {
      return res.send(hub.challenge)
    }

    res.sendStatus(400)
  }
}
