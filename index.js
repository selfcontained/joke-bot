const os = require('os')
const express = require('express')

var port = process.env.PORT || 8080
var app = express()

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    memory: process.memoryUsage(),
    uptime: os.uptime(),
    cpu: os.loadavg()
  })
})

app.get('/facebook', (req, res) => {
  res.send('facebook verify route')
})

app.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log('Server started successfully on port %s', port)
})
