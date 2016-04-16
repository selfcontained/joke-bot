
// Route handler for facebook messenger token verification
module.exports = (app) => {
  var verifyToken = app.config.facebook.verifyToken
  return (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
      return res.send(req.query['hub.challenge'])
    }

    res.sendStatus(400)
  }
}
