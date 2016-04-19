
module.exports = (app) => {
  var processMessage = require('./wit')(app)

  // route for handling facebook messages
  function handleMessage (req, res) {
    var entry = ((req.body.entry || [])[0] || {})

    // dumping this for now to grock payloads a little better
    console.log(JSON.stringify(req.body))

    var messagingEvents = (entry.messaging || [])

    var textEvent = messagingEvents.filter((event) => {
      return event.message && event.message.text
    })[0]

    // ack the message
    res.sendStatus(200)

    if (!textEvent) {
      app.log.info('non text event received from facebook: ', req.body)
      return
    }

    app.log.facebook('facebook text event: ', textEvent)
    var sender = textEvent.sender.id
    var message = textEvent.message.text

    processMessage(sender, message)
  }

  return handleMessage
}
