
// Route handler for facebook messenger token verification
module.exports = (verifyToken) => {
  return (req, res) => {
    var hub = req.query.hub || {}

    if (hub.mode === 'subscribe' && hub.verify_token === verifyToken) {
      return res.send(hub.challenge)
    }

    res.sendStatus(400)
  }
}
